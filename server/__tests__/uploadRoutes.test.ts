import {
    ALLOWED_MIME_EXT_MAP,
    isOwnedAttachmentFilename,
} from "../routes/uploadRoutes";

describe("upload routes — attachment filename ownership", () => {
  it("accepts a file owned by the current user", () => {
    expect(
      isOwnedAttachmentFilename("u1", "sched-u1-1700000000000-abcd.pdf")
    ).toBe(true);
  });

  it("rejects files owned by another user", () => {
    expect(
      isOwnedAttachmentFilename("u1", "sched-u2-1700000000000-abcd.pdf")
    ).toBe(false);
  });

  it("rejects files without the schedule-attachment prefix", () => {
    expect(isOwnedAttachmentFilename("u1", "avatar-u1.jpg")).toBe(false);
    expect(isOwnedAttachmentFilename("u1", "notes.txt")).toBe(false);
  });

  it("rejects path traversal and absolute paths", () => {
    expect(
      isOwnedAttachmentFilename("u1", "../sched-u1-x.pdf")
    ).toBe(false);
    expect(isOwnedAttachmentFilename("u1", "/etc/passwd")).toBe(false);
    expect(isOwnedAttachmentFilename("u1", "sched-u1-x/../evil")).toBe(false);
  });

  it("rejects empty filenames", () => {
    expect(isOwnedAttachmentFilename("u1", "")).toBe(false);
  });
});

describe("upload routes — MIME whitelist", () => {
  it("allows document / image / archive types", () => {
    expect(ALLOWED_MIME_EXT_MAP["application/pdf"]).toBe(".pdf");
    expect(
      ALLOWED_MIME_EXT_MAP[
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ]
    ).toBe(".docx");
    expect(ALLOWED_MIME_EXT_MAP["image/png"]).toBe(".png");
    expect(ALLOWED_MIME_EXT_MAP["application/zip"]).toBe(".zip");
    expect(ALLOWED_MIME_EXT_MAP["text/csv"]).toBe(".csv");
  });

  it("does NOT allow script/executable/injection-prone types", () => {
    for (const dangerous of [
      "text/html",
      "application/javascript",
      "text/javascript",
      "image/svg+xml",
      "application/xml",
      "application/wasm",
      "application/x-msdownload",
      "application/x-sh",
      "application/octet-stream",
      "application/x-httpd-php",
    ]) {
      expect(ALLOWED_MIME_EXT_MAP[dangerous]).toBeUndefined();
    }
  });
});
