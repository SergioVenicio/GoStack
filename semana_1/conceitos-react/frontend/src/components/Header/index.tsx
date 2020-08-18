import React from "react";

interface HeaderParams {
  title: string;
  children?: object;
}

const Header: React.FC<HeaderParams> = ({ title, children }) => {
  return (
    <header>
      <h1>{title}</h1>

      {children}
    </header>
  );
};

export default Header;
