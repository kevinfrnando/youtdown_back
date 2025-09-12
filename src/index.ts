import { env } from "./config/env";
import { buildServer } from "./interface/http/server";

const app = buildServer();
app.listen(env.PORT, () => {
  console.log(`youtdown backend escuchando en http://localhost:${env.PORT}`);
});
