import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      currentUser?: { email: string, id: string };
      session: { jwt: string } | null;
    }
  }
}

interface UserPayload {
  email: string;
  id: string;
}

export const currentUser =
  (req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.session?.jwt) {
      return next();
    }

    try {
      const payload = jwt.verify(
        req.session.jwt,
        process.env.JWT_KEY!
      ) as UserPayload

      req.currentUser = payload;
    } catch (error) {
      console.log(error);
    } finally {
      next();
    }
  };