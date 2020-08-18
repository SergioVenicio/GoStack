import React from "react";

interface InputProps {
  name: string;
  placeholder?: string;
  value?: any;
  onChange: React.EventHandler<any>;
}

const Input: React.FC<InputProps> = ({
  name,
  placeholder,
  value,
  onChange,
}) => {
  return (
    <input
      type="text"
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
};

export default Input;
