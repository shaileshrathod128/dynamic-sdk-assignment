import cors from "cors";
import { env } from "./env";
export const corsOptions = {
  origin: env.CORS_ORIGIN.split(","),
  credentials: false,
};
export default cors(corsOptions);
