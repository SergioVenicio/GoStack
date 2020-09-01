import React, { useCallback, useRef } from "react";
import { FormHandles } from "@unform/core";
import { Form } from "@unform/web";
import * as Yup from "yup";

import getValidationErrors from "../../utils/getValidationErrors";

import { FiArrowLeft, FiMail, FiLock, FiUser } from "react-icons/fi";

import Input from "../../components/Input";
import Button from "../../components/Button";

import { Background, Container, Content } from "./styles";

import logo from "../../assets/logo.svg";

interface submitData {
  name: string;
  email: string;
  password: string;
}
const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const handleSubmit = useCallback(async (data: submitData): Promise<void> => {
    formRef.current?.setErrors({});
    const schema = Yup.object().shape({
      name: Yup.string().required("O nome é obrigatório"),
      email: Yup.string()
        .required("O email é obrigatório")
        .email("Digite um email válido"),
      password: Yup.string().min(6, "Tamanho minimo de 6 caracteres"),
    });

    try {
      await schema.validate(data, {
        abortEarly: false,
      });
    } catch (error) {
      const errors = getValidationErrors(error);
      formRef.current?.setErrors(errors);
      console.error(error);
    }
  }, []);

  return (
    <Container>
      <Background />

      <Content>
        <img src={logo} alt="GoBarber" />

        <Form ref={formRef} onSubmit={handleSubmit}>
          <h1>Faça seu cadastro</h1>

          <Input name="name" type="text" placeholder="Nome" icon={FiUser} />
          <Input name="email" type="text" placeholder="E-mail" icon={FiMail} />
          <Input
            name="password"
            type="password"
            placeholder="Senha"
            icon={FiLock}
          />

          <Button type="submit">Cadastrar</Button>
        </Form>

        <a href="#">
          <FiArrowLeft />
          Voltar para logon
        </a>
      </Content>
    </Container>
  );
};

export default SignUp;
