import React from "react";
import { render, fireEvent, wait } from "@testing-library/react";

import Input from "../../components/Input";

jest.mock("@unform/core", () => {
  return {
    useField() {
      return {
        fieldName: "email",
        defaultValue: "",
        error: "",
        registerField: jest.fn(),
      };
    },
  };
});

describe("Input component", () => {
  it("should to be able to render an input", () => {
    const { getByPlaceholderText } = render(
      <Input type="email" name="email" placeholder="E-mail" />
    );

    expect(getByPlaceholderText("E-mail")).toBeTruthy();
  });

  it("should hide highlight on input blur", async () => {
    const { getByPlaceholderText, getByTestId } = render(
      <Input type="email" name="email" placeholder="E-mail" />
    );

    const inputElement = getByPlaceholderText("E-mail");
    const inputContainer = getByTestId("input-container");

    fireEvent.focus(inputElement);
    fireEvent.blur(inputElement);

    await wait(() => {
      expect(inputContainer).not.toHaveStyle("border-color: #ff9000");
      expect(inputContainer).not.toHaveStyle("color: #ff9000");
    });
  });
});
