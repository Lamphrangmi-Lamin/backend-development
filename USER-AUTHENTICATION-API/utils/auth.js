import { createHmac, timingSafeEqual } from "node:crypto";

export const getValidSessionId = (cookieHeader) => {
  if (!cookieHeader) return null;

  const cookies = Object.fromEntries(
    cookieHeader.split("; ").map((c) => c.split("=")),
  );

  const sid = cookies.sid;
  if (!sid || !sid.includes(".")) return null;

  const [sessionId, signature] = sid.split(".");

  const COOKIE_SECRET = process.env.COOKIE_SECRET;
  const expectedSignature = createHmac("sha256", COOKIE_SECRET)
    .update(sessionId)
    .digest("base64url");

  const sigBuffer = Buffer.from(signature);
  const expectedSigBuffer = Buffer.from(expectedSignature);

  if (
    sigBuffer.length !== expectedSigBuffer.length ||
    !timingSafeEqual(sigBuffer, expectedSigBuffer)
  )
    return null;

  return sessionId;
};
