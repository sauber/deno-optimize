import type { Parameters } from "./parameter.ts";
import type { Output } from "./types.d.ts";
import {
  Frame,
  gauges as gauge_chart,
  LineChart,
  linechart,
  progress,
  Split,
  Stack,
  Static,
} from "@sauber/widgets";

// ANSI escape codes
const ESC = "\u001B[";
const LINEUP = "F";

////////////////////////////////////////////////////////////////////////

/** Visualize parameters */
export class Dashboard {
  /** First run? */
  private first: boolean = true;
  private readonly startms: number;

  constructor(
    private readonly max_iterations: number = 1,
    private readonly width: number = 78,
  ) {
    this.startms = Date.now();
  }

  private gauges(parameters: Parameters, width: number): string {
    const v = parameters.map((p) =>
      [p.name, p.min, p.max, p.value] as [string, number, number, number]
    );
    const output = gauge_chart(v, width);
    return output;
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
    // const separator = " ‖ ";

    // Get each component
    const width: number = Math.floor((this.width -4) / 2);
    const height: number = parameters.length;
    const gauges: string = this.gauges(parameters, width);
    const spentms = Date.now() - this.startms;
    const eta: string = progress(
      iteration,
      this.max_iterations,
      spentms,
      this.width,
    );

    // Create Dashboard
    const gb = new Static(gauges, width);
    const lc = new LineChart(reward, height);
    lc.setWidth(width);
    const db = new Stack([
      new Split([
        new Frame(gb, "Parameters"),
        new Frame(lc, "Reward"),
      ]),

      new Static(eta),
    ]);

    // Move cursor up
    const up: string = this.first ? "" : ESC + db.height.toString() + LINEUP;
    this.first = false;

    return up + db.toString();
  }
}
