import express from "express";
import { verifySignature } from "../controllers/verify.controller";
export const verifyRouter = express.Router();

verifyRouter.post("/", verifySignature);
