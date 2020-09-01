import React from "react";

import GlobalStyle from "./styles/global";

import SignIn from "./pages/signin";
import SignUp from "./pages/signup";

const App = () => {
  return (
    <>
      <div className="App">
        <SignIn />
      </div>
      <GlobalStyle />
    </>
  );
};

export default App;
