import {
  assertEquals,
  assertGreater,
  assertInstanceOf,
  assertLessOrEqual,
} from "@std/assert";
import { Dashboard } from "./dashboard.ts";
import { Maximize } from "./maximize.ts";
import { Parameter } from "./parameter.ts";
import { type Inputs, NoisyBumpySlope, type Output } from "./testdata.ts";
import type { Status } from "./types.d.ts";

Deno.test("Instance", () => {
  const min = new Maximize();
  assertInstanceOf(min, Maximize);
});

Deno.test("Run", () => {
  const min = new Maximize();
  const iterations = min.run();
  assertEquals(iterations, 1);
});

Deno.test(
  "Optimize parameters for maximal reward loss",
  { ignore: true },
  () => {
    const agent: (input: Inputs) => Output = NoisyBumpySlope;

    const parameters = [
      new Parameter("x", -5, 5),
      new Parameter("y", -5, 5),
    ];

    // Dashboard
    const epochs = 20000;
    const width = 74;
    const dashboard = new Dashboard(epochs, width);

    const status: Status = (
      iteration: number,
      _momentum: number,
      _parameters,
      loss: Array<Output>,
    ): void => {
      console.log(dashboard.render(parameters, iteration, loss));
    };

    const optimizer = new Maximize({
      parameters,
      agent: agent as (inputs: Array<number>) => number,
      epochs,
      status,
      every: 10,
      epsilon: 0.05,
      batchSize: 100,
    });

    const iterations = optimizer.run();
    console.log(
      "Iterations:",
      iterations,
      "Reward:",
      agent(parameters.map((p) => p.value) as Inputs),
    );
    console.log(parameters.map((p) => p.print()));
    assertGreater(iterations, 0);
    assertLessOrEqual(iterations, epochs);
  },
);
