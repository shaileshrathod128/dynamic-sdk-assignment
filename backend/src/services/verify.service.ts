import { ethers } from "ethers";

export const verifyMessageService = (message: string, signature: string) => {
  const signer = ethers.verifyMessage(message, signature);
  const isValid = Boolean(signer && ethers.isAddress(signer));
  return { isValid, signer, originalMessage: message };
};
