import request from "supertest";
import app from "../../app";
import { ethers } from "ethers";

describe("POST /verify-signature", () => {
  it("verifies valid signature", async () => {
    const wallet = ethers.Wallet.createRandom();
    const message = "test";
    const signature = await wallet.signMessage(message);
    const res = await request(app)
      .post("/verify-signature")
      .send({ message, signature });
    expect(res.body.isValid).toBe(true);
  });
});
