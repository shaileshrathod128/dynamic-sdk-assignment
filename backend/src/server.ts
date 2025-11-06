import app from "./app";
import { env } from "./config/env";
import { log } from "./config/logger";

app.listen(env.PORT, () => log(`API running at http://localhost:${env.PORT}`));
