import type { Parameters } from "./parameter.ts";

/** An optimizer calculates how much to adjust parameter value based on parameter gradient */
export interface Optimizer {
  // Calculate update from gradient
  update: (grad: number) => number;
}

/** Input is an array of numbers */
export type Inputs = Array<number>;

/** Output is a single number */
export type Output = number;

/** Callback to Dashboard render function */
export type Status = (
  iteration: number,
  momentum: number,
  parameters: Parameters,
  loss: Array<Output>,
) => void;
