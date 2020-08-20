import { Request, Response } from "express";
import User from "./interfaces/User";

export default function createUser(request: Request, response: Response) {
  const user: User = request.body;
  return response.json({ message: user });
}
