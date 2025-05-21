import { isNil } from "./isNil";

export class Range {
  private readonly from: number;
  private readonly to: number;
  private readonly step: number;

  constructor(to: number);
  constructor(from: number, to: number);
  constructor(from: number, to: number, step: number);
  constructor(fromOrTo: number, to?: number, step?: number) {
    this.step = step || 1;

    if (isNil(to)) {
      this.from = 0;
      this.to = fromOrTo;
    } else {
      this.from = fromOrTo;
      this.to = to;
    }
  }

  *[Symbol.iterator](): Generator<number> {
    for (let index = this.from; index < this.to; index += this.step) {
      yield index;
    }
  }

  values(): Generator<number> {
    return this[Symbol.iterator]();
  }

  toArray(): number[] {
    return [...this.values()];
  }

  forEach(callback: (value: number) => void) {
    for (const value of this) {
      callback(value);
    }
  }
}

export function range(to: number): Range;
export function range(from: number, to: number): Range;
export function range(from: number, to: number, step: number): Range;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function range(fromOrTo: any, to?: any, step?: any) {
  return new Range(fromOrTo, to, step);
}
