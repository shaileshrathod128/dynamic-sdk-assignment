import express from "express";
import cors from "./config/cors";
import { verifyRouter } from "./routes/verify.route";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
app.use(express.json());
app.use(cors);

app.use("/verify-signature", verifyRouter);
app.use(errorHandler);

export default app;
