import type { Parameters } from "./parameter.ts";
import type { Output } from "./types.d.ts";
import { gauges as gauge_chart, linechart, progress } from "@sauber/widgets";

// ANSI escape codes
const ESC = "\u001B[";
const LINEUP = "F";

////////////////////////////////////////////////////////////////////////

/** Visualize parameters */
export class Dashboard {
  /** First run? */
  private first: boolean = true;
  // private readonly progress: Iteration;
  private readonly startms: number;

  constructor(
    private readonly max_iterations: number = 1,
    private readonly width: number = 78,
  ) {
    // this.progress = new Iteration(max_iterations, width);
    this.startms = Date.now();
  }

  private gauges(parameters: Parameters, width: number): string[] {
    const v = parameters.map((p) =>
      [p.name, p.min, p.max, p.value] as [string, number, number, number]
    );
    const output = gauge_chart(v, width);
    return output.split("\n");
  }

  private reward(
    reward: Array<Output>,
    width: number,
    height: number,
  ): string[] {
    const output = linechart(reward, height, width);
    return output.split("\n");
  }

  /** Combine chart components */
  public render(
    parameters: Parameters,
    iteration: number,
    reward: Array<Output>,
  ): string {
    // Vertical Seperator
    const seperator = " ‖ ";

    // Get each component
    const width: number = Math.floor((this.width - seperator.length) / 2);
    const gauges: string[] = this.gauges(parameters, width);
    const chart: string[] = this.reward(reward, width, gauges.length);
    // const eta: string = this.progress.render(iteration);
    const spentms = Date.now() - this.startms;
    const eta: string = progress(
      iteration,
      this.max_iterations,
      spentms,
      this.width,
    );

    // Combine components
    const lines: string[] = gauges.map((g, index) =>
      g + seperator + chart[index]
    );
    const up: string = this.first
      ? ""
      : ESC + (lines.length + 1).toString() + LINEUP;
    this.first = false;
    return up + lines.join("\n") + "\n" + eta;
  }
}
