import { FixedEvent } from '../types';

export class FragmentationUtils {
  /**
   * 检测时间槽是否为“碎片化”时段（即填补空隙的时段）。
   * 如果时间槽紧邻固定事件（前或后），则视为碎片化时段。
   * 这种时段适合安排短任务，以避免打断大块连续时间。
   * 
   * @param slotStart 时间槽开始时间
   * @param slotEnd 时间槽结束时间
   * @param fixedEvents 固定事件列表
   * @param thresholdMs 判定邻近的阈值（毫秒），默认 1分钟
   */
  static isFragmented(slotStart: Date, slotEnd: Date, fixedEvents: FixedEvent[], thresholdMs: number = 60000): boolean {
    // 检查前面是否有紧邻的事件
    const hasEventBefore = fixedEvents.some(e => Math.abs(e.endTime.getTime() - slotStart.getTime()) < thresholdMs);
    
    // 检查后面是否有紧邻的事件
    const hasEventAfter = fixedEvents.some(e => Math.abs(e.startTime.getTime() - slotEnd.getTime()) < thresholdMs);
    
    return hasEventBefore || hasEventAfter;
  }
}
