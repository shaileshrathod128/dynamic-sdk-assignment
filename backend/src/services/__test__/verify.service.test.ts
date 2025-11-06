import { ethers } from "ethers";
import { verifyMessageService } from "../verify.service";

describe("verifyMessageService", () => {
  it("returns isValid=true with correct signer for a valid signature", async () => {
    const wallet = ethers.Wallet.createRandom();
    const message = "hello world";
    const signature = await wallet.signMessage(message);

    const out = verifyMessageService(message, signature);
    expect(out.isValid).toBe(true);
    expect(out.signer.toLowerCase()).toBe(wallet.address.toLowerCase());
    expect(out.originalMessage).toBe(message);
  });

  it("works with mixed-case checksum addresses (case-insensitive match)", async () => {
    const wallet = ethers.Wallet.createRandom();
    const message = "checksum test";
    const signature = await wallet.signMessage(message);

    const out = verifyMessageService(message, signature);
    // recovered signer is EIP-55 checksummed; compare case-insensitively
    expect(out.signer.toLowerCase()).toBe(wallet.address.toLowerCase());
    expect(out.isValid).toBe(true);
  });

  it("supports unicode / emoji messages", async () => {
    const wallet = ethers.Wallet.createRandom();
    const message = "👩‍🚀🚀 — 核心验证 — café — 𝛑";
    const signature = await wallet.signMessage(message);

    const out = verifyMessageService(message, signature);
    expect(out.isValid).toBe(true);
    expect(out.signer.toLowerCase()).toBe(wallet.address.toLowerCase());
    expect(out.originalMessage).toBe(message);
  });

  it("supports very long messages", async () => {
    const wallet = ethers.Wallet.createRandom();
    const message = "x".repeat(10_000);
    const signature = await wallet.signMessage(message);

    const out = verifyMessageService(message, signature);
    expect(out.isValid).toBe(true);
    expect(out.signer.toLowerCase()).toBe(wallet.address.toLowerCase());
    expect(out.originalMessage).toBe(message);
  });

  it("returns a signer even if message/signature are from DIFFERENT messages (NOTE: current behavior)", async () => {
    const wallet = ethers.Wallet.createRandom();
    const messageSigned = "signed message";
    const signature = await wallet.signMessage(messageSigned);

    const differentMessage = "another message";
    const out = verifyMessageService(differentMessage, signature);

    // ethers.verifyMessage recovers an address from (message, signature);
    // this service treats ANY recovered address as "valid".
    // So isValid will still be true here.
    expect(out.isValid).toBe(true);
    expect(typeof out.signer).toBe("string");
    expect(out.originalMessage).toBe(differentMessage);

    // ✅ If you want to truly validate, compare `out.signer` against an expected address upstream.
    // Or change the service to accept an `expectedAddress` and compare equality.
  });

  it("fails if signature is malformed: wrong length", () => {
    const message = "bad-sig";
    const badSig = "0x1234"; // too short / invalid
    expect(() => verifyMessageService(message, badSig)).toThrow();
  });

  it("fails if signature is malformed: missing 0x prefix", () => {
    const message = "no-0x";
    const badSig = "e5b9f3c0b1...deadbeef"; // simulate missing 0x; any short/gibberish will do
    expect(() => verifyMessageService(message, badSig)).toThrow();
  });

  it("fails if signature is not hex", () => {
    const message = "not-hex";
    const badSig = "0xZZZZ-not-hex";
    expect(() => verifyMessageService(message, badSig)).toThrow();
  });

  it("works with empty-string message only if signature was produced for empty string", async () => {
    const wallet = ethers.Wallet.createRandom();
    const empty = "";
    const signature = await wallet.signMessage(empty);

    const out = verifyMessageService(empty, signature);
    expect(out.isValid).toBe(true);
    expect(out.signer.toLowerCase()).toBe(wallet.address.toLowerCase());
    expect(out.originalMessage).toBe(empty);
  });

  it("returns the originalMessage exactly as provided (no normalization)", async () => {
    const wallet = ethers.Wallet.createRandom();
    const message = "  spaced\t\nmessage\u00A0"; // includes NBSP
    const signature = await wallet.signMessage(message);

    const out = verifyMessageService(message, signature);
    expect(out.originalMessage).toBe(message);
    expect(out.isValid).toBe(true);
    expect(out.signer.toLowerCase()).toBe(wallet.address.toLowerCase());
  });

  it("handles uppercase vs lowercase hex in signature (if produced that way)", async () => {
    const wallet = ethers.Wallet.createRandom();
    const message = "hex case";
    const sig = await wallet.signMessage(message);
    const upper = "0x" + sig.slice(2).toUpperCase();

    // ethers tolerates hex casing
    const out = verifyMessageService(message, upper);
    expect(out.isValid).toBe(true);
    expect(out.signer.toLowerCase()).toBe(wallet.address.toLowerCase());
  });
});
