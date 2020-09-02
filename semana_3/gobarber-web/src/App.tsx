import React from "react";

import { AuthContextProviver } from "./contexts/AuthContext";

import GlobalStyle from "./styles/global";

import SignIn from "./pages/signin";
import SignUp from "./pages/signup";

const App = () => {
  return (
    <>
      <div className="App">
        <AuthContextProviver>
          <SignIn />
        </AuthContextProviver>
      </div>
      <GlobalStyle />
    </>
  );
};

export default App;
