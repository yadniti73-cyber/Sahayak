import jwt from "jsonwebtoken";
import { appConfig } from "@/server/config";

export function signJwt(payload) {
  return jwt.sign(payload, appConfig.jwtSecret, {
    algorithm: "HS256",
    expiresIn: appConfig.jwtExpiresIn,
  });
}

export function verifyJwt(token) {
  try {
    return jwt.verify(token, appConfig.jwtSecret, { algorithms: ["HS256"] });
  } catch (error) {
    return null;
  }
}
