import React, { ButtonHTMLAttributes } from "react";

import { Container } from "./styles";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

const Button: React.FC<ButtonProps> = ({ type, loading, children }) => (
  <Container type={type}>{loading ? "Carregando" : children}</Container>
);

export default Button;
