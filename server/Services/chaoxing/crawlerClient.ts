import axios, { type AxiosInstance } from "axios";
import { v4 as uuidv4 } from "uuid";
import { logger } from "../../Utils/logger.js";

export interface CrawlJobStatus {
    job_id: string;
    status: string;
    account_id?: string;
    phase?: string;
    progress?: number;
    error_code?: string | null;
    error_message?: string | null;
    created_at?: string;
    started_at?: string | null;
    finished_at?: string | null;
}

export class CrawlerClient {
    private http: AxiosInstance;
    private pollIntervalMs: number;
    private timeoutMs: number;

    constructor(opts?: {
        baseUrl?: string;
        pollIntervalMs?: number;
        timeoutMs?: number;
    }) {
        const baseURL =
            opts?.baseUrl ||
            process.env.CRAWLER_BASE_URL ||
            "http://127.0.0.1:8070";
        this.pollIntervalMs =
            opts?.pollIntervalMs ??
            Number(process.env.CHAOXING_POLL_INTERVAL_MS || 2000);
        this.timeoutMs =
            opts?.timeoutMs ??
            Number(process.env.CHAOXING_SYNC_TIMEOUT_MS || 180000);
        this.http = axios.create({
            baseURL,
            timeout: 30000,
            validateStatus: () => true,
        });
    }

    async createJob(
        accountId: string,
        options?: {
            mode?: string;
            max_workers?: number;
            notice_max_pages?: number;
            skip_ended?: boolean;
            idempotencyKey?: string;
        },
    ): Promise<{ job_id: string; status: string }> {
        const key = options?.idempotencyKey || uuidv4();
        const res = await this.http.post(
            "/v1/crawl-jobs",
            {
                account_id: accountId,
                mode: options?.mode || "full",
                max_workers: options?.max_workers ?? 4,
                notice_max_pages: options?.notice_max_pages ?? 10,
                skip_ended: options?.skip_ended ?? false,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Idempotency-Key": key,
                },
            },
        );
        if (res.status === 202 && res.data?.job_id) {
            return res.data;
        }
        if (res.status === 409 && res.data?.detail?.active_job_id) {
            return {
                job_id: res.data.detail.active_job_id,
                status: "running",
            };
        }
        const code = res.data?.detail?.code || res.status;
        const msg =
            typeof res.data?.detail === "object"
                ? JSON.stringify(res.data.detail)
                : res.data?.detail || res.statusText;
        throw new Error(`createJob failed: ${code} ${msg}`);
    }

    async getJob(jobId: string): Promise<CrawlJobStatus> {
        const res = await this.http.get(`/v1/crawl-jobs/${jobId}`);
        if (res.status !== 200) {
            throw new Error(
                `getJob failed: ${res.status} ${JSON.stringify(res.data)}`,
            );
        }
        return res.data;
    }

    async getResult(jobId: string): Promise<any> {
        const res = await this.http.get(`/v1/crawl-jobs/${jobId}/result`);
        if (res.status === 200) return res.data;
        if (res.status === 202) {
            throw new Error("result_not_ready");
        }
        const detail = res.data?.detail;
        const err = new Error(
            detail?.message || detail?.code || `result failed ${res.status}`,
        ) as Error & { code?: string; status?: number };
        err.code = detail?.code;
        err.status = res.status;
        throw err;
    }

    async waitForJob(
        jobId: string,
    ): Promise<{ status: CrawlJobStatus; result?: any }> {
        const deadline = Date.now() + this.timeoutMs;
        while (Date.now() < deadline) {
            const st = await this.getJob(jobId);
            if (st.status === "succeeded") {
                const result = await this.getResult(jobId);
                return { status: st, result };
            }
            if (st.status === "failed") {
                return { status: st };
            }
            await new Promise((r) => setTimeout(r, this.pollIntervalMs));
        }
        logger.warn(`Chaoxing job ${jobId} timed out after ${this.timeoutMs}ms`);
        throw new Error("crawl_timeout");
    }

    async healthReady(): Promise<boolean> {
        try {
            const res = await this.http.get("/health/ready");
            return res.status === 200;
        } catch {
            return false;
        }
    }
}
