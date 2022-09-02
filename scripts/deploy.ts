const build = Deno.run({ cmd: ["pnpm", "run", "build"], cwd: "frontend" });
await build.status();
build.close();

const deploy = Deno.run({
  cmd: [
    "deployctl",
    "deploy",
    `--project=${Deno.env.get("DENO_DEPLOY_PROJECT")}`,
    "--exclude=frontend/node_modules",
    "backend/mod.ts",
  ],
});
await deploy.status();
deploy.close();
