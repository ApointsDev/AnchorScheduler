import { calculateReminderAt, parseLegacyTaskMetadata, resolveTaskMetadata } from "../Services/taskMetadata.js";
describe("structured task metadata", function () {
  it("normalizes a reminder lead and derives reminderAt", function () {
    var metadata = resolveTaskMetadata({
      eventType: "schedule",
      category: "工作",
      allDay: false,
      reminderMinutesBefore: 30,
      attachments: ["agenda.pdf", "agenda.pdf"]
    });
    expect(metadata).toEqual({
      eventType: "schedule",
      category: "工作",
      allDay: false,
      isReminderOn: true,
      reminderMinutesBefore: 30,
      attachments: ["agenda.pdf"]
    });
    expect(calculateReminderAt("2026-08-02T10:00:00+08:00", true, 30)).toBe("2026-08-02T01:30:00.000Z");
  });
  it("rejects invalid structured values", function () {
    expect(function () {
      return resolveTaskMetadata({
        reminderMinutesBefore: -1
      });
    }).toThrow("reminderMinutesBefore");
    expect(function () {
      return resolveTaskMetadata({
        attachments: "file"
      });
    }).toThrow("attachments");
  });
  it("migrates and removes the legacy Anchor suffix", function () {
    var migrated = parseLegacyTaskMetadata("正文\n[Anchor 类型:schedule | 分类:工作 | 提醒:提前1小时 | 全天事件 | 附件:a.pdf、b.png]", "2026-08-02T10:00:00+08:00");
    expect(migrated).toEqual({
      description: "正文",
      metadata: {
        eventType: "schedule",
        category: "工作",
        allDay: true,
        isReminderOn: true,
        reminderMinutesBefore: 60,
        attachments: ["a.pdf", "b.png"]
      }
    });
  });
});