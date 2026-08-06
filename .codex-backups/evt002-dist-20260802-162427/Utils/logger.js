function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
import { toShanghaiISO } from "./time.js";
// 注意：编译后在dist目录运行，但.env文件在server目录
var envPath = path.resolve(__dirname, '..', '..', '.env');
var dotenvResult = dotenv.config({
  path: envPath
});
if (dotenvResult.error) {
  console.error('错误: 无法加载.env文件:', dotenvResult.error.message);
} else {
  console.info('.env文件成功加载');
}
export var LogLevel = /*#__PURE__*/function (LogLevel) {
  LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
  LogLevel[LogLevel["INFO"] = 1] = "INFO";
  LogLevel[LogLevel["WARN"] = 2] = "WARN";
  LogLevel[LogLevel["ERROR"] = 3] = "ERROR";
  LogLevel[LogLevel["NONE"] = 4] = "NONE";
  return LogLevel;
}({});
export var Logger = /*#__PURE__*/function () {
  function Logger() {
    _classCallCheck(this, Logger);
    _defineProperty(this, "level", LogLevel.INFO);
    _defineProperty(this, "logToFile", false);
    _defineProperty(this, "logFilePath", '');
    _defineProperty(this, "maxFileSize", 10 * 1024 * 1024);
    // 10MB
    _defineProperty(this, "maxFiles", 5);
    // 从环境变量读取日志等级
    this.loadLogLevelFromEnv();
    // 从环境变量读取文件日志配置
    this.loadFileConfigFromEnv();
  }
  return _createClass(Logger, [{
    key: "loadLogLevelFromEnv",
    value: function loadLogLevelFromEnv() {
      var _process$env$LOG_LEVE;
      var envLevel = (_process$env$LOG_LEVE = process.env.LOG_LEVEL) === null || _process$env$LOG_LEVE === void 0 ? void 0 : _process$env$LOG_LEVE.toLowerCase();
      console.log("\uD83D\uDD27 \u8BFB\u53D6\u73AF\u5883\u53D8\u91CF LOG_LEVEL: ".concat(envLevel || '未设置'));
      switch (envLevel) {
        case 'debug':
          this.level = LogLevel.DEBUG;
          break;
        case 'info':
          this.level = LogLevel.INFO;
          break;
        case 'warn':
          this.level = LogLevel.WARN;
          break;
        case 'error':
          this.level = LogLevel.ERROR;
          break;
        case 'none':
          this.level = LogLevel.NONE;
          break;
        default:
          this.level = LogLevel.INFO;
      }
      console.log("\uD83D\uDCCA \u5F53\u524D\u65E5\u5FD7\u7B49\u7EA7: ".concat(this.getLevelName()));
    }
  }, {
    key: "loadFileConfigFromEnv",
    value: function loadFileConfigFromEnv() {
      var _process$env$LOG_TO_F;
      var logToFile = ((_process$env$LOG_TO_F = process.env.LOG_TO_FILE) === null || _process$env$LOG_TO_F === void 0 ? void 0 : _process$env$LOG_TO_F.toLowerCase()) === 'true';
      var logFilePath = process.env.LOG_FILE_PATH || path.join(process.cwd(), 'logs', 'app.log');
      var maxFileSize = parseInt(process.env.LOG_MAX_FILE_SIZE || '10485760'); // 10MB default
      var maxFiles = parseInt(process.env.LOG_MAX_FILES || '5');
      this.logToFile = logToFile;
      this.logFilePath = logFilePath;
      this.maxFileSize = maxFileSize;
      this.maxFiles = maxFiles;
      if (this.logToFile) {
        console.log("\uD83D\uDCDD \u6587\u4EF6\u65E5\u5FD7\u5DF2\u542F\u7528\uFF0C\u65E5\u5FD7\u6587\u4EF6\u8DEF\u5F84: ".concat(this.logFilePath));
        this.ensureLogDirectoryExists();
      }
    }
  }, {
    key: "ensureLogDirectoryExists",
    value: function ensureLogDirectoryExists() {
      var logDir = path.dirname(this.logFilePath);
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, {
          recursive: true
        });
        console.log("\uD83D\uDCC1 \u521B\u5EFA\u65E5\u5FD7\u76EE\u5F55: ".concat(logDir));
      }
    }
  }, {
    key: "rotateLogFile",
    value: function rotateLogFile() {
      if (!fs.existsSync(this.logFilePath)) {
        return;
      }
      var stats = fs.statSync(this.logFilePath);
      if (stats.size >= this.maxFileSize) {
        var logDir = path.dirname(this.logFilePath);
        var logFileName = path.basename(this.logFilePath, path.extname(this.logFilePath));
        var logFileExt = path.extname(this.logFilePath);

        // 删除最旧的日志文件
        var oldestLogFile = path.join(logDir, "".concat(logFileName, ".").concat(this.maxFiles).concat(logFileExt));
        if (fs.existsSync(oldestLogFile)) {
          fs.unlinkSync(oldestLogFile);
        }

        // 重命名现有的日志文件
        for (var i = this.maxFiles - 1; i >= 1; i--) {
          var oldFile = path.join(logDir, "".concat(logFileName, ".").concat(i).concat(logFileExt));
          var newFile = path.join(logDir, "".concat(logFileName, ".").concat(i + 1).concat(logFileExt));
          if (fs.existsSync(oldFile)) {
            fs.renameSync(oldFile, newFile);
          }
        }

        // 重命名当前日志文件
        var firstRotatedFile = path.join(logDir, "".concat(logFileName, ".1").concat(logFileExt));
        fs.renameSync(this.logFilePath, firstRotatedFile);
      }
    }
  }, {
    key: "writeToFile",
    value: function writeToFile(level, message) {
      if (!this.logToFile) {
        return;
      }
      try {
        this.rotateLogFile();
        var timestamp = toShanghaiISO();
        var logMessage = "[".concat(timestamp, "] [").concat(level, "] ").concat(message);
        for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
          args[_key - 2] = arguments[_key];
        }
        var argsStr = args.length > 0 ? ' ' + args.map(function (arg) {
          return _typeof(arg) === 'object' ? JSON.stringify(arg, null, 2) : String(arg);
        }).join(' ') : '';
        var fullLogMessage = logMessage + argsStr + '\n';
        fs.appendFileSync(this.logFilePath, fullLogMessage, 'utf8');
      } catch (error) {
        console.error('❌ 写入日志文件失败:', error);
      }
    }
  }, {
    key: "getLevelName",
    value: function getLevelName() {
      switch (this.level) {
        case LogLevel.DEBUG:
          return 'DEBUG';
        case LogLevel.INFO:
          return 'INFO';
        case LogLevel.WARN:
          return 'WARN';
        case LogLevel.ERROR:
          return 'ERROR';
        case LogLevel.NONE:
          return 'NONE';
        default:
          return 'INFO';
      }
    }
  }, {
    key: "setLevel",
    value: function setLevel(level) {
      this.level = level;
      console.log("\uD83D\uDCCA \u65E5\u5FD7\u7B49\u7EA7\u5DF2\u8BBE\u7F6E\u4E3A: ".concat(this.getLevelName()));
    }
  }, {
    key: "getLevel",
    value: function getLevel() {
      return this.level;
    }
  }, {
    key: "reloadFromEnv",
    value: function reloadFromEnv() {
      this.loadLogLevelFromEnv();
      this.loadFileConfigFromEnv();
    }
  }, {
    key: "enableFileLogging",
    value: function enableFileLogging(logFilePath, maxFileSize, maxFiles) {
      this.logToFile = true;
      if (logFilePath) this.logFilePath = logFilePath;
      if (maxFileSize) this.maxFileSize = maxFileSize;
      if (maxFiles) this.maxFiles = maxFiles;
      this.ensureLogDirectoryExists();
      console.log("\u6587\u4EF6\u65E5\u5FD7\u5DF2\u542F\u7528\uFF0C\u65E5\u5FD7\u6587\u4EF6\u8DEF\u5F84: ".concat(this.logFilePath));
    }
  }, {
    key: "disableFileLogging",
    value: function disableFileLogging() {
      this.logToFile = false;
      console.log('文件日志已禁用');
    }
  }, {
    key: "isFileLoggingEnabled",
    value: function isFileLoggingEnabled() {
      return this.logToFile;
    }
  }, {
    key: "getLogFilePath",
    value: function getLogFilePath() {
      return this.logFilePath;
    }
  }, {
    key: "debug",
    value: function debug(message) {
      if (this.level <= LogLevel.DEBUG) {
        var _console;
        for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          args[_key2 - 1] = arguments[_key2];
        }
        (_console = console).log.apply(_console, ["[DEBUG] ".concat(message)].concat(args));
        this.writeToFile.apply(this, ['DEBUG', message].concat(args));
      }
    }
  }, {
    key: "info",
    value: function info(message) {
      if (this.level <= LogLevel.INFO) {
        var _console2;
        for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
          args[_key3 - 1] = arguments[_key3];
        }
        (_console2 = console).log.apply(_console2, ["[INFO] ".concat(message)].concat(args));
        this.writeToFile.apply(this, ['INFO', message].concat(args));
      }
    }
  }, {
    key: "warn",
    value: function warn(message) {
      if (this.level <= LogLevel.WARN) {
        var _console3;
        for (var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
          args[_key4 - 1] = arguments[_key4];
        }
        (_console3 = console).warn.apply(_console3, ["[WARN] ".concat(message)].concat(args));
        this.writeToFile.apply(this, ['WARN', message].concat(args));
      }
    }
  }, {
    key: "error",
    value: function error(message) {
      if (this.level <= LogLevel.ERROR) {
        var _console4;
        for (var _len5 = arguments.length, args = new Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
          args[_key5 - 1] = arguments[_key5];
        }
        (_console4 = console).error.apply(_console4, ["[ERROR] ".concat(message)].concat(args));
        this.writeToFile.apply(this, ['ERROR', message].concat(args));
      }
    }
  }, {
    key: "success",
    value: function success(message) {
      if (this.level <= LogLevel.INFO) {
        var _console5;
        for (var _len6 = arguments.length, args = new Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
          args[_key6 - 1] = arguments[_key6];
        }
        (_console5 = console).log.apply(_console5, ["[SUCCESS] ".concat(message)].concat(args));
        this.writeToFile.apply(this, ['SUCCESS', message].concat(args));
      }
    }
  }, {
    key: "start",
    value: function start(message) {
      if (this.level <= LogLevel.INFO) {
        var _console6;
        for (var _len7 = arguments.length, args = new Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
          args[_key7 - 1] = arguments[_key7];
        }
        (_console6 = console).log.apply(_console6, ["[START] ".concat(message)].concat(args));
        this.writeToFile.apply(this, ['START', message].concat(args));
      }
    }
  }, {
    key: "step",
    value: function step(message) {
      if (this.level <= LogLevel.DEBUG) {
        var _console7;
        for (var _len8 = arguments.length, args = new Array(_len8 > 1 ? _len8 - 1 : 0), _key8 = 1; _key8 < _len8; _key8++) {
          args[_key8 - 1] = arguments[_key8];
        }
        (_console7 = console).log.apply(_console7, ["[STEP] ".concat(message)].concat(args));
        this.writeToFile.apply(this, ['STEP', message].concat(args));
      }
    }
  }, {
    key: "data",
    value: function data(message) {
      if (this.level <= LogLevel.DEBUG) {
        var _console8;
        for (var _len9 = arguments.length, args = new Array(_len9 > 1 ? _len9 - 1 : 0), _key9 = 1; _key9 < _len9; _key9++) {
          args[_key9 - 1] = arguments[_key9];
        }
        (_console8 = console).log.apply(_console8, ["[DATA] ".concat(message)].concat(args));
        this.writeToFile.apply(this, ['DATA', message].concat(args));
      }
    }
  }, {
    key: "network",
    value: function network(message) {
      if (this.level <= LogLevel.DEBUG) {
        var _console9;
        for (var _len0 = arguments.length, args = new Array(_len0 > 1 ? _len0 - 1 : 0), _key0 = 1; _key0 < _len0; _key0++) {
          args[_key0 - 1] = arguments[_key0];
        }
        (_console9 = console).log.apply(_console9, ["[NETWORK] ".concat(message)].concat(args));
        this.writeToFile.apply(this, ['NETWORK', message].concat(args));
      }
    }
  }, {
    key: "exchange",
    value: function exchange(message) {
      if (this.level <= LogLevel.INFO) {
        var _console0;
        for (var _len1 = arguments.length, args = new Array(_len1 > 1 ? _len1 - 1 : 0), _key1 = 1; _key1 < _len1; _key1++) {
          args[_key1 - 1] = arguments[_key1];
        }
        (_console0 = console).log.apply(_console0, ["[EXCHANGE] ".concat(message)].concat(args));
        this.writeToFile.apply(this, ['EXCHANGE', message].concat(args));
      }
    }
  }, {
    key: "graph",
    value: function graph(message) {
      if (this.level <= LogLevel.INFO) {
        var _console1;
        for (var _len10 = arguments.length, args = new Array(_len10 > 1 ? _len10 - 1 : 0), _key10 = 1; _key10 < _len10; _key10++) {
          args[_key10 - 1] = arguments[_key10];
        }
        (_console1 = console).log.apply(_console1, ["[GRAPH] ".concat(message)].concat(args));
        this.writeToFile.apply(this, ['GRAPH', message].concat(args));
      }
    }
  }, {
    key: "auth",
    value: function auth(message) {
      if (this.level <= LogLevel.INFO) {
        var _console10;
        for (var _len11 = arguments.length, args = new Array(_len11 > 1 ? _len11 - 1 : 0), _key11 = 1; _key11 < _len11; _key11++) {
          args[_key11 - 1] = arguments[_key11];
        }
        (_console10 = console).log.apply(_console10, ["[AUTH] ".concat(message)].concat(args));
        this.writeToFile.apply(this, ['AUTH', message].concat(args));
      }
    }
  }, {
    key: "mcp",
    value: function mcp(message) {
      if (this.level <= LogLevel.INFO) {
        var _console11;
        for (var _len12 = arguments.length, args = new Array(_len12 > 1 ? _len12 - 1 : 0), _key12 = 1; _key12 < _len12; _key12++) {
          args[_key12 - 1] = arguments[_key12];
        }
        (_console11 = console).log.apply(_console11, ["[MCP] ".concat(message)].concat(args));
        this.writeToFile.apply(this, ['MCP', message].concat(args));
      }
    }
  }], [{
    key: "getInstance",
    value: function getInstance() {
      if (!Logger.instance) {
        Logger.instance = new Logger();
      }
      return Logger.instance;
    }
  }]);
}();

// 导出单例实例
export var logger = Logger.getInstance();