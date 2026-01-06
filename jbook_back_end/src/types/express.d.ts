import { Request } from "express";

interface UserPayload {
  user_id: string;
  session: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}
