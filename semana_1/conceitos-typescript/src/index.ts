import express from "express";

import createUser from "./routes";

import User from "./interfaces/User";

const app = express();
app.use(express.json());

const PORT = 3333;

app.get("/", (request, response) => {
  type UserResponse = Pick<User, "name" | "email">;
  const tiringa: UserResponse = {
    name: "Tiringa",
    email: "homiii.vaite@lascar.com.br",
  };
  return response.json(tiringa);
});

app.post("/user/create", createUser);

app.listen(PORT, () => {
  console.log(`Listening on :${PORT}`);
});
