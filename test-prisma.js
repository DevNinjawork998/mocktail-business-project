const { execSync } = require("child_process");
try {
  execSync(
    "npx ts-node -e \"const c = require('./prisma/prisma.config.ts').default; console.log(c);\" ",
    { stdio: "inherit" },
  );
} catch (e) {
  console.error(e);
}
