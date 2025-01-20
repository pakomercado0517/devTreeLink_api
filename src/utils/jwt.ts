import jwt, { JwtPayload } from "jsonwebtoken";
const { JWT_SECRET } = process.env;

export const generateJWT = (payload: JwtPayload) => {
  const token = jwt.sign(payload, JWT_SECRET as string, {
    expiresIn: "180d",
  });
  return token;
};

export const verifyJWT = (token: string) => {
  const payload = jwt.verify(token, JWT_SECRET as string);
  return payload;
};
