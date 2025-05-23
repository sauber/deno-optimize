import { randn } from "@sauber/statistics";
import { Adam } from "./adam.ts";

type Sample = [number, number];
type Samples = Array<Sample>;

/** Estimate slope by linear regression */
function slope(samples: Samples): number {
  const sum = [0, 0, 0, 0];
  samples.forEach((v) => {
    sum[0] += v[0];
    sum[1] += v[1];
    sum[2] += v[0] * v[0];
    sum[3] += v[0] * v[1];
  });
  const len = samples.length;
  const run: number = len * sum[2] - sum[0] * sum[0];
  const rise: number = len * sum[3] - sum[0] * sum[1];
  const gradient: number = run === 0 ? 0 : rise / run;
  return gradient;
}

/** Properties of an exported parameter */
export type ParameterData = {
  name: string;
  min: number;
  max: number;
  value: number;
};

/** Parameter is a floating point value that can be adjusted */
export class Parameter {
  /** Amount value has changed */
  public changed: number = 0;

  /** Underlying optimer */
  private readonly optimizer = new Adam();

  /** Precision of value */
  public precision: number = 0.001;

  // Current float value of parameter
  protected _value: number;

  // Samples of results
  private readonly samples: Samples = [];

  constructor(
    public readonly name: string,
    public readonly min: number,
    public readonly max: number,
    value?: number,
  ) {
    this._value = value || this.random;
  }

  public static import(par: ParameterData): Parameter {
    return new Parameter(par.name, par.min, par.max, par.value);
  }

  public export(): ParameterData {
    return { name: this.name, min: this.min, max: this.max, value: this.value };
  }

  /** Random number between min and max */
  public get random(): number {
    return this.min + Math.random() * (this.max - this.min);
  }

  /** Public value of parameter */
  public get value(): number {
    const rounded = parseFloat(
      (this.precision * Math.round(this._value / this.precision))
        .toPrecision(3),
    );
    return rounded;
  }

  /** Set value  */
  public set(value: number): void {
    this._value = value;
    if (this._value < this.min) this._value = this.min;
    if (this._value > this.max) this._value = this.max;
    this.samples.length = 0;
  }

  /** Suggest a value close to current value */
  public suggest(): number {
    const width = this.max - this.min;
    const value = this._value - width / 2 + randn() * width;
    if (value > this.max) return this.max;
    else if (value < this.min) return this.min;
    else return value;
  }

  /** Using parameter value what was end result */
  public learn(x: number, y: number): void {
    this.samples.push([x, y]);
  }

  /** Gradient of samples */
  public get gradient(): number {
    if (this.samples.length < 2) return 0;
    const gr: number = slope(this.samples);
    return gr;
  }

  /** Adjust value according to gradient */
  public update(): void {
    const grad = this.gradient;
    const update = this.optimizer.update(-grad);
    this.changed = update;
    this.set(this._value + update);
  }

  // Pretty print value and gradient
  public print(): string {
    const v: number = parseFloat(this.value.toFixed(4));
    const g: number = parseFloat(this.changed.toFixed(4));
    return `${this.name}: v=${v} g=${g}`;
  }
}

/** Parameter where value is integer */
export class IntegerParameter extends Parameter {
  public override get value(): number {
    return Math.round(this._value);
  }

  public override get random(): number {
    return Math.round(super.random);
  }

  public override suggest(): number {
    return Math.round(super.suggest());
  }
}

/** Parameter where value is not adjustable */
export class StaticParameter extends Parameter {
  constructor(name: string, value: number) {
    super(name, value, value, value);
  }

  public override get value(): number {
    return this._value;
  }

  public override get random(): number {
    return this._value;
  }

  public override suggest(): number {
    return this._value;
  }

  public override learn(_x: number, _y: number): void {
    // Do nothing
  }

  public override get gradient(): number {
    return 0;
  }

  public override update(): void {
    // Do nothing
  }

  public override print(): string {
    return `${this.name}: v=${this._value} g=0`;
  }
}

/** An array of variuos parameters */
export type Parameters = Array<Parameter>;
