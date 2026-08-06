import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { getScheduleQueue, type ScheduleQueueItem } from "../../services/api";
import InlineScheduleApproval from "../MyMail/InlineScheduleApproval";
import LoadingSpinner from "../ui/LoadingSpinner";

const ScheduleQueue: React.FC = () => {
    const { t } = useTranslation();
    const [items, setItems] = useState<ScheduleQueueItem[]>([]);
    const [loading, setLoading] = useState(false);

    const load = async () => {
        setLoading(true);
        try {
            const res = await getScheduleQueue();
            setItems(res.queue || []);
        } catch (e: any) {
            console.error("Failed to load queue", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    return (
        <div className="settings-page">
            <Card>
                <CardHeader>
                    <CardTitle>{t("nav.pendingSchedule")}</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <LoadingSpinner />
                    ) : items.length === 0 ? (
                        <div>{t("schedule.noPendingSchedule")}</div>
                    ) : (
                        <InlineScheduleApproval
                            items={items}
                            onItemsChange={() => load()}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default ScheduleQueue;
