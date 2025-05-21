import { Optimizer } from "./optimizer.ts";

/** Using Adam optimizer find combination of parameter values for lowest output from agent */
export class Minimize extends Optimizer {
  /** Direction for learning (-1 for minimize) */
  protected direction: number = -1;
}
