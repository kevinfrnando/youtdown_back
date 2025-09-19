import { env } from "./config/env";
import { FileLoggerAdapter } from "./infrastructure/logger/FileLoggerAdapter";
import { buildServer } from "./interface/http/server";

const logger = new FileLoggerAdapter();
const app = buildServer();
const host = "0.0.0.0";
const port = env.PORT || 3000;
const domain = env.PROD_CLIENT_URL || `http://localhost:${port}`;

app.listen(port, host, () => {
  logger.info(`youtdown backend escuchando en ${domain}`);
});
