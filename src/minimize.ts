import { Optimize } from "./optimize.ts";

/** Using Adam optimizer find combination of parameter values for lowest output from agent */
export class Minimize extends Optimize {
  /** Direction for learning (-1 for minimize) */
  protected direction: number = -1;
}
