import { Request, Response } from "express";
import { z } from "zod";
import { verifyMessageService } from "../services/verify.service";
const schema = z.object({
  message: z.string().min(1),
  signature: z.string().min(1),
});

export const verifySignature = (req: Request, res: Response) => {
  try {
    const { message, signature } = schema.parse(req.body);
    const result = verifyMessageService(message, signature);
    return res.json(result);
  } catch (e: any) {
    return res.status(400).json({ error: e.message });
  }
};
