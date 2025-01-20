import { Request, Response, NextFunction } from "express";
import { verifyJWT } from "../utils/jwt";
import User, { IUser } from "../models/User";

declare global {
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
}

export const authenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bearer = req.headers.authorization;

  if (!bearer) {
    const error = new Error("Usuario no autorizado");
    res.status(401).json({ error: error.message });
    return;
  }

  const [, token] = bearer.split(" ");

  if (!token) {
    const error = new Error("Usuario no autorizado");
    res.status(401).json({ error: error.message });
    return;
  }

  try {
    const payload = verifyJWT(token);
    if (typeof payload === "object" && payload.id) {
      const user = await User.findById(payload.id).select("-password");
      if (user) {
        req.user = user;
        next();
      } else {
        const error = new Error("El Usuario no existe");
        res.status(404).json({ error: error.message });
      }
    }
  } catch (error) {
    res.status(500).json({ error: "token no válido " });
  }
};
