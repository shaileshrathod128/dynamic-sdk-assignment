import { verifyMessageService } from "../../services/verify.service";
import { ethers } from "ethers";
import { verifySignature } from "../verify.controller";

// ✅ Mock the verifyMessageService so we isolate the controller
jest.mock("../../services/verify.service");
const mockVerifyMessageService = verifyMessageService as jest.Mock;

describe("verifySignature controller", () => {
  const mockReq = (body: any = {}) => ({ body } as any);
  const mockRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => jest.clearAllMocks());

  it("returns 200 and result for valid request", () => {
    const result = {
      isValid: true,
      signer: ethers.Wallet.createRandom().address,
      originalMessage: "hello world",
    };
    mockVerifyMessageService.mockReturnValue(result);

    const req = mockReq({ message: "hello world", signature: "0x123" });
    const res = mockRes();

    verifySignature(req, res);

    expect(mockVerifyMessageService).toHaveBeenCalledWith(
      "hello world",
      "0x123"
    );
    expect(res.json).toHaveBeenCalledWith(result);
    expect(res.status).not.toHaveBeenCalled(); // defaults to 200
  });

  it("returns 400 if message is missing", () => {
    const req = mockReq({ signature: "0xabc" });
    const res = mockRes();

    verifySignature(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    const payload = res.json.mock.calls[0][0];
    expect(payload.error).toMatch(/message/i);
  });

  it("returns 400 if signature is missing", () => {
    const req = mockReq({ message: "hello" });
    const res = mockRes();

    verifySignature(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json.mock.calls[0][0].error).toMatch(/signature/i);
  });

  it("returns 400 if message is empty string", () => {
    const req = mockReq({ message: "", signature: "0x123" });
    const res = mockRes();

    verifySignature(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json.mock.calls[0][0].error).toMatch(/message/i);
  });

  it("returns 400 if signature is empty string", () => {
    const req = mockReq({ message: "ok", signature: "" });
    const res = mockRes();

    verifySignature(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json.mock.calls[0][0].error).toMatch(/signature/i);
  });

  it("handles thrown errors from verifyMessageService gracefully", () => {
    mockVerifyMessageService.mockImplementation(() => {
      throw new Error("Bad signature");
    });
    const req = mockReq({ message: "test", signature: "0x123" });
    const res = mockRes();

    verifySignature(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Bad signature" });
  });

  it("calls verifyMessageService only once per valid request", () => {
    mockVerifyMessageService.mockReturnValue({
      isValid: true,
      signer: "0xabc",
      originalMessage: "msg",
    });
    const req = mockReq({ message: "msg", signature: "0xabc" });
    const res = mockRes();

    verifySignature(req, res);

    expect(mockVerifyMessageService).toHaveBeenCalledTimes(1);
  });
});
