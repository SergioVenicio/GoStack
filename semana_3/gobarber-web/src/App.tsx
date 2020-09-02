import React from "react";
import { BrowserRouter } from 'react-router-dom'

import AppProvider from "./contexts";

import GlobalStyle from "./styles/global";

import Routes from './routes'

const App = () => {
  return (
    <>
      <div className="App">
          <BrowserRouter>
            <AppProvider>
              <Routes />
            </AppProvider>
          </BrowserRouter>
      </div>
      <GlobalStyle />
    </>
  );
};

export default App;
