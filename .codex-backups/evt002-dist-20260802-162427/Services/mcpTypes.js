// 基础内容类型（目前工具主要返回 text）

// 通用工具返回结构（保守建模，允许额外字段）

// read_emails

// add_schedule

// add_todo

// delete_schedule

// update_schedule

// get_schedule

// get_server_time

// search_tasks

// 工具名称集合与通用签名

export var MCPToolNames = /*#__PURE__*/function (MCPToolNames) {
  MCPToolNames["ReadEmails"] = "read_emails";
  MCPToolNames["SearchEmails"] = "search_emails";
  MCPToolNames["AddSchedule"] = "add_schedule";
  MCPToolNames["AddTodo"] = "add_todo";
  MCPToolNames["DeleteSchedule"] = "delete_schedule";
  MCPToolNames["UpdateSchedule"] = "update_schedule";
  MCPToolNames["GetSchedule"] = "get_schedule";
  MCPToolNames["GetServerTime"] = "get_server_time";
  MCPToolNames["SearchTasks"] = "search_tasks";
  return MCPToolNames;
}({});
export default {};