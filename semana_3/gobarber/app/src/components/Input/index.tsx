import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";

import { TextInputProps } from "react-native";

import { useField } from "@unform/core";

import { Container, TextInput, Icon } from "./styles";

interface inputValueReference {
  value: string;
}

interface InputProps extends TextInputProps {
  name: string;
  icon: string;
}

interface InputRef {
  focus(): void;
}

const Input: React.RefForwardingComponent<InputRef, InputProps> = (
  { name, icon, ...props }: InputProps,
  ref: InputRef
) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const inputElementRef = useRef(null);
  const { registerField, defaultValue = "", fieldName, error } = useField(name);
  const inputValueRef = useRef<inputValueReference>({ value: defaultValue });

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);
    setIsFilled(!!inputValueRef.current.value);
  }, []);

  useImperativeHandle(ref, () => ({
    focus() {
      inputElementRef?.current?.focus();
    },
  }));

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputValueRef.current,
      path: "value",
      setValue(ref: any, value: string) {
        inputValueRef.current.value = value;
        inputElementRef.current?.setNativeProps({ text: value });
      },
      clearValue() {
        inputValueRef.current.value = "value";
        inputElementRef.current?.clear();
      },
    });
  }, [fieldName, registerField]);

  return (
    <Container isFocused={isFocused} isErrored={!!error}>
      <Icon
        name={icon}
        size={20}
        color={isFocused || isFilled ? "#ff9000" : "#666360"}
      />

      <TextInput
        placeholderTextColor="#666360"
        name={name}
        onChangeText={(value) => (inputValueRef.current.value = value)}
        ref={inputElementRef}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        {...props}
      />
    </Container>
  );
};

export default forwardRef(Input);
