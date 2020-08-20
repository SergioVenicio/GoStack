import { Request, Response } from "express";
import User from "./interfaces/User";

export default function createUser(request: Request, response: Response) {
  return response.json({ message: <User>request.body });
}
