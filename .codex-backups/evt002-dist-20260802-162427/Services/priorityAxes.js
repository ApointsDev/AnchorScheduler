function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
/**
 * 四象限双轴分数：重要程度 / 紧急程度，取值 [-1, 1]
 * 与既有 importance 枚举（high|normal|low）及 quadrant（q1–q4）共存，向后兼容。
 */

import { normalizeImportance } from "./db/taskMapper.js";

// -1 .. 1

/** 将任意输入规范到 [-1, 1]；非法则 null */
export function clampAxisScore(value) {
  if (value === undefined || value === null || value === "") return null;
  var n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return null;
  if (n > 1) return 1;
  if (n < -1) return -1;
  // 保留合理精度，避免浮点噪声
  return Math.round(n * 10000) / 10000;
}

/** 由 high/normal/low 推导默认双轴（LLM 未给出分数时使用） */
export function defaultAxesFromImportance(importance) {
  var imp = normalizeImportance(importance || undefined);
  switch (imp) {
    case "high":
      return {
        importanceScore: 0.75,
        urgencyScore: 0.5
      };
    case "low":
      return {
        importanceScore: -0.5,
        urgencyScore: -0.25
      };
    default:
      return {
        importanceScore: 0,
        urgencyScore: 0
      };
  }
}

/**
 * 解析请求/LLM 中的双轴分数。
 * fillDefaults=true 时，缺失轴用 importance 枚举推导。
 */
export function resolvePriorityAxes(input) {
  var importanceScore = clampAxisScore(input.importanceScore);
  var urgencyScore = clampAxisScore(input.urgencyScore);
  if (input.fillDefaults) {
    var d = defaultAxesFromImportance(input.importance);
    if (importanceScore === null) importanceScore = d.importanceScore;
    if (urgencyScore === null) urgencyScore = d.urgencyScore;
  }
  return {
    importanceScore: importanceScore,
    urgencyScore: urgencyScore
  };
}

/** 由双轴推导艾森豪威尔象限（任一轴缺失则 undefined） */
export function quadrantFromAxes(importanceScore, urgencyScore) {
  if (importanceScore === null || importanceScore === undefined || urgencyScore === null || urgencyScore === undefined) {
    return undefined;
  }
  var important = importanceScore > 0;
  var urgent = urgencyScore > 0;
  if (important && urgent) return "q1";
  if (important && !urgent) return "q2";
  if (!important && urgent) return "q3";
  return "q4";
}

/** 校验 body 是否至少提供了一个轴，并返回规范化结果 */
export function parsePriorityAxesBody(body) {
  if (!body || _typeof(body) !== "object") {
    return {
      ok: false,
      error: "Body must be an object"
    };
  }
  var b = body;
  var hasImp = b.importanceScore !== undefined;
  var hasUrg = b.urgencyScore !== undefined;
  if (!hasImp && !hasUrg) {
    return {
      ok: false,
      error: "importanceScore and/or urgencyScore required (range -1..1)"
    };
  }
  var axes = {};
  if (hasImp) {
    if (b.importanceScore === null) {
      axes.importanceScore = undefined;
      // allow explicit null? treat as clear → store null via special
    }
    var v = clampAxisScore(b.importanceScore);
    if (b.importanceScore !== null && v === null) {
      return {
        ok: false,
        error: "importanceScore must be a number in [-1, 1]"
      };
    }
    if (v !== null) axes.importanceScore = v;else if (b.importanceScore === null) {
      // clear
      axes.importanceScore = null;
    }
  }
  if (hasUrg) {
    var _v = clampAxisScore(b.urgencyScore);
    if (b.urgencyScore !== null && _v === null) {
      return {
        ok: false,
        error: "urgencyScore must be a number in [-1, 1]"
      };
    }
    if (_v !== null) axes.urgencyScore = _v;else if (b.urgencyScore === null) {
      axes.urgencyScore = null;
    }
  }
  return {
    ok: true,
    axes: axes
  };
}