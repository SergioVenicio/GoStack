import React from "react";

import { AuthContextProvider } from "./AuthContext";
import App from "../App";

const AppProvider: React.FC = ({ children }) => (
  <AuthContextProvider>{children}</AuthContextProvider>
);

export default AppProvider;
