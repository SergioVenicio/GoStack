import React from "react";

import { AuthContextProviver } from "./AuthContext";
import { ToastContextProvider } from "./ToastContext";

const AppProvider: React.FC = ({ children }) => (
  <AuthContextProviver>
    <ToastContextProvider>{children}</ToastContextProvider>
  </AuthContextProviver>
);

export default AppProvider;
