/**
 * Example of searching for optimal input parameters to find maximum output.
 */

import { Dashboard } from "./src/dashboard.ts";
import { Minimize } from "./src/minimize.ts";
import { Parameter, type Parameters } from "./src/parameter.ts";
import type { Status } from "./src/types.d.ts";

// Two input parameters and one output parameter.
type Inputs = [number, number];
type Output = number;

/**
 * Three Hump Camel example from
 * https://www.sfu.ca/~ssurjano/optimization.html
 */
function ThreeHumpCamel(x1: number, x2: number): Output {
  const term1 = 2 * x1 ** 2;
  const term2 = -1.05 * x1 ** 4;
  const term3 = x1 ** 6 / 6;
  const term4 = x1 * x2;
  const term5 = x2 ** 2;
  const y = term1 + term2 + term3 + term4 + term5;
  return y;
}

// Process input parameters and generate output
const agent = (input: Inputs): Output => ThreeHumpCamel(input[0], input[1]);

// Input parameters and min/max constraints
const parameters = [
  new Parameter("x", -2, 2),
  new Parameter("y", -2, 2),
];

// Max number of epochs for the optimization process
const epochs = 20000;

// Width of the dashboard
const width = 74;

// Dashboard to visualize the optimization process.
const dashboard = new Dashboard(epochs, width);

// Callback to render the dashboard.
const status: Status = (
  iteration: number,
  _momentum: number,
  _parameters: Parameters,
  loss: Array<Output>,
): void => {
  console.log(dashboard.render(parameters, iteration, loss));
};

// Frequency of callbacks
const every = 10;
// Epsilon value for stopping criteria
const epsilon = 0.0005;
// Count of samples for gradient calculation
const batchSize = 100;

// Optimizer instance with the defined parameters and settings
const optimizer = new Minimize({
  parameters,
  agent: agent as (inputs: Array<number>) => number,
  epochs,
  status,
  every,
  epsilon,
  batchSize,
});

// Run the optimization process.
const iterations = optimizer.run();

// Display the results
console.log(
  `Found minimum after ${iterations} iterations. Input:`,
  parameters.map((p) => p.value),
  "Output:",
  agent(parameters.map((p) => p.value) as Inputs),
);

/** Example of expected output:
deno-optimize> deno example.ts
x -2 [============ -0.107       ] 2 ‖ 1.17 ┼╮
y -2 [============= -0.007      ] 2 ‖ 0.00 ┤╰─────────────────────────────
 1521/20000 [====-----------------------------------------------] 12:28:12
Found minimum after 1521 iterations. Input: [ -0.107, -0.007 ] Output: 0.023558616540675304
deno-optimize>
*/
