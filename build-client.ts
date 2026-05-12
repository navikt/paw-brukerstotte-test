import * as esbuild from "esbuild";

const watchMode = Deno.args.includes("--watch");

const buildOptions: esbuild.BuildOptions = {
  entryPoints: ["client/island-loader.tsx"],
  outfile: "static/islands.js",
  bundle: true,
  minify: !watchMode,
  sourcemap: watchMode ? "inline" : false,
  format: "esm",
  target: "es2022",
  jsx: "automatic",
  jsxImportSource: "react",
  logLevel: "info",
};

if (watchMode) {
  const ctx = await esbuild.context(buildOptions);
  await ctx.watch();
  console.log("esbuild: watching client/ for changes...");
} else {
  await esbuild.build(buildOptions);
  esbuild.stop();
}
