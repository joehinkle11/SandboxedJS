
import Benchmarkify from "benchmarkify";

// Create a new benchmark
// The `.printHeader` method will print the name of benchmark & some
// information from the OS/PC to the console.
const benchmark = new Benchmarkify("Simple example").printHeader();


import { runPrimitivesBenchmark } from "./primitives.benchmark.mjs";
await runPrimitivesBenchmark(benchmark);
import { runBinaryOpsBenchmark } from "./binary_ops.benchmark.mjs";
await runBinaryOpsBenchmark(benchmark);
import { runObjectLookupsBenchmark } from "./object_lookups.benchmark.mjs";
await runObjectLookupsBenchmark(benchmark);
import { runArrayLookupsBenchmark } from "./array_lookups.benchmark.mjs";
await runArrayLookupsBenchmark(benchmark);
