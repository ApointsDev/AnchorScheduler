declare module 'ical.js' {
  export function parse(input: string): any[];

  export class Component {
    constructor(jcal: any[]);
    getFirstSubcomponent(name: string): Component | null;
    getAllSubcomponents(name: string): Component[];
    getFirstProperty(name: string): Property | null;
    getAllProperties(name: string): Property[];
    toString(): string;
  }

  export class Property {
    getFirstValue(): any;
    getValues(): any[];
    toString(): string;
  }

  export class Event {
    constructor(component: Component);
    getFirstProperty(name: string): Property | null;
    getAllProperties(name: string): Property[];
    uid: string;
    summary: string | null;
    description: string | null;
    location: string | null;
    startDate: Time;
    endDate: Time;
    duration: Duration;
    recurrenceId: Time | null;
    isRecurring: boolean;
    isMultiDay: boolean;
  }

  export class Time {
    constructor(icaltime: any);
    toJSDate(): Date;
    toISOString(): string;
  }

  export class Duration {
    constructor(duration: any);
  }

  export class Recur {
    freq: string;
    interval: number;
    count: number;
    until: Time | null;
    byweekno: number[];
    byday: any[];
    toString(): string;
  }
}