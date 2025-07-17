import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { Config } from "drizzle-kit";

console.log(process.env.DB_URL!);

function createTempConfig() {
  const configPath = path.join(__dirname, "drizzle-config.json");
  const configContent = {
    dialect: "postgresql",
    dbCredentials: { url: process.env.DB_URL! },
    schema: "./src/common/models",
    out: "./src/common/database/migrations",
    verbose: true,
    migrations: {
      table: "drizzle_migrations",
      schema: "public",
    },
  } satisfies Config;

  fs.writeFileSync(configPath, JSON.stringify(configContent, null, 2));

  return configPath;
}

function cleanupTempFile(configPath: string) {
  if (fs.existsSync(configPath)) {
    fs.unlinkSync(configPath);
  }
}

function runDrizzleCommand(command: string) {
  console.log(`Running: ${command}`);

  return new Promise<void>((resolve, reject) => {
    const process = exec(command);

    process.stdout?.on("data", (data) => {
      console.log(data.toString());
    });

    process.stderr?.on("data", (data) => {
      console.error(data.toString());
    });

    process.on("exit", (code) => {
      if (code === 0) {
        console.log(`Command completed successfully`);
        resolve();
      } else {
        console.error(`Command failed with code ${code}`);
        reject(new Error(`Command failed with code ${code}`));
      }
    });
  });
}

// 메인 함수
async function main() {
  const command = process.argv[2];

  if (!command) {
    console.error(
      "Command is required. Use: generate, push, pull, studio, migrate, migrate:create, migrate:sql, or migrate:rollback"
    );
    process.exit(1);
  }

  try {
    console.log(`Database: ${process.env.DB_URL}`);

    const configPath = createTempConfig();

    try {
      switch (command) {
        case "generate":
        case "migrate":
        case "push":
        case "pull":
          await runDrizzleCommand(
            `drizzle-kit ${command} --config=${configPath}`
          );
          break;

        case "studio":
          const studioProcess = exec(
            `drizzle-kit studio --port=3333 --config=${configPath}`
          );

          studioProcess.stdout?.on("data", (data) => {
            console.log(data.toString());
          });

          studioProcess.stderr?.on("data", (data) => {
            console.error(data.toString());
          });

          studioProcess.on("exit", (code) => {
            cleanupTempFile(configPath);
            console.log(`Drizzle Studio exited with code ${code}`);
          });

          process.on("SIGINT", () => {
            console.log("Stopping Drizzle Studio...");
            cleanupTempFile(configPath);
            studioProcess.kill();
            process.exit(0);
          });

          return;
        default:
          console.error(`Unknown command: ${command}`);
          process.exit(1);
      }
    } finally {
      if (command !== "studio") {
        cleanupTempFile(configPath);
      }
    }
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Unhandled error:", error);
  process.exit(1);
});
