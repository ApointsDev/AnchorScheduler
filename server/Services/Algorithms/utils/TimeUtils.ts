import { TimeSlot } from '../types';

export class TimeUtils {
  static generateTimeSlots(startTime: string, endTime: string, interval: number): TimeSlot[] {
    const slots: TimeSlot[] = [];
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    let current = new Date();
    current.setHours(startHour, startMinute, 0, 0);
    
    const end = new Date();
    end.setHours(endHour, endMinute, 0, 0);

    let idCounter = 1;

    while (current < end) {
      const slotEnd = new Date(current.getTime() + interval * 60000);
      if (slotEnd > end) break;

      slots.push({
        id: `slot_${idCounter++}`,
        start: new Date(current),
        end: new Date(slotEnd)
      });

      current = slotEnd;
    }

    return slots;
  }

  static hasTimeOverlap(slot1: TimeSlot, slot2: TimeSlot): boolean {
    return slot1.start < slot2.end && slot2.start < slot1.end;
  }

  static timeDifference(start: Date, end: Date): number {
    return (end.getTime() - start.getTime()) / 60000;
  }

  static mergeTimeSlots(slots: TimeSlot[]): TimeSlot[] {
    if (slots.length === 0) return [];
    
    const sorted = [...slots].sort((a, b) => a.start.getTime() - b.start.getTime());
    const merged: TimeSlot[] = [sorted[0]];

    for (let i = 1; i < sorted.length; i++) {
      const current = sorted[i];
      const last = merged[merged.length - 1];

      if (current.start <= last.end) {
        last.end = new Date(Math.max(last.end.getTime(), current.end.getTime()));
      } else {
        merged.push(current);
      }
    }

    return merged;
  }

  static splitTimeSlot(slot: TimeSlot, maxDuration: number): TimeSlot[] {
    const result: TimeSlot[] = [];
    let current = new Date(slot.start);
    const end = new Date(slot.end);
    let idCounter = 1;

    while (current < end) {
      const chunkEnd = new Date(Math.min(current.getTime() + maxDuration * 60000, end.getTime()));
      result.push({
        id: `${slot.id}_part_${idCounter++}`,
        start: new Date(current),
        end: new Date(chunkEnd)
      });
      current = chunkEnd;
    }

    return result;
  }

  static isWeekday(date: Date): boolean {
    const day = date.getDay();
    return day !== 0 && day !== 6;
  }

  static addBusinessMinutes(date: Date, minutes: number): Date {
    // Simplified implementation: just adds minutes, ignoring business hours logic for now
    // as full business logic requires configuration of business hours
    return new Date(date.getTime() + minutes * 60000);
  }
}
