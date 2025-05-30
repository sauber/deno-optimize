import { Optimize } from "./optimize.ts";

/** Using Adam optimizer find combination of parameter values for highest output from agent */
export class Maximize extends Optimize {
  /** Direction for learning (+1 for maximize) */
  protected direction: number = +1;
}
