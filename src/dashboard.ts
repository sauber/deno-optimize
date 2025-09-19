import type { Parameters } from "./parameter.ts";
import type { Output } from "./types.d.ts";
import {
  type Block,
  Frame,
  Gauges,
  LineChart,
  Progress,
  Split,
  Stack,
} from "@sauber/widgets";

// ANSI escape codes
const ESC = "\u001B[";
const LINEUP = "F";

////////////////////////////////////////////////////////////////////////

/** Visualize parameters */
export class Dashboard {
  /** First run? */
  private first: boolean = true;

  // Dashboard components
  private readonly gauges: Gauges;
  private readonly chart: LineChart;
  private readonly progress: Progress;
  private readonly layout: Block;

  constructor(
    private readonly parameters: Parameters,
    max_iterations: number = 1,
    width: number = 78,
  ) {
    this.gauges = new Gauges(
      parameters.map((p) => [
        p.name,
        p.min,
        p.max,
        p.value,
      ]),
      width / 2,
    );

    this.chart = new LineChart([], parameters.length);
    this.chart.setWidth(width / 2);

    this.progress = new Progress("#", max_iterations, width);

    this.layout = new Stack([
      new Split([new Frame(this.gauges, "Parameters"), new Frame(this.chart, "Results")]),
      this.progress,
    ]);
  }

  /** Combine chart components */
  public render(
    iteration: number,
    reward: Array<Output>,
  ): string {
    this.gauges.update(this.parameters.map((p) => p.value));
    this.chart.update(reward);
    this.progress.update(iteration);

    // Moving cursor up
    const up: string = this.first
      ? ""
      : ESC + this.layout.height.toString() + LINEUP;
    this.first = false;

    return up + this.layout.toString();
  }
}
