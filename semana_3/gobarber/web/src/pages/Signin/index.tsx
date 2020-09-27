import React, { useRef, useCallback } from "react";

import { Link } from "react-router-dom";

import { FiLogIn, FiMail, FiLock } from "react-icons/fi";
import { FormHandles } from "@unform/core";
import { Form } from "@unform/web";
import * as Yup from "yup";

import useAuthContext from "../../contexts/AuthContext";
import useToastContext from "../../contexts/ToastContext";

import Input from "../../components/Input";
import Button from "../../components/Button";

import { AnimationContainer, Background, Container, Content } from "./styles";

import logo from "../../assets/logo.svg";
import getValidationErrors from "../../utils/getValidationErrors";

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { signIn } = useAuthContext();
  const { addToast } = useToastContext();

  const handleSubmit = useCallback(
    async (data): Promise<void> => {
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        email: Yup.string()
          .required("O email é obrigatório")
          .email("Digite um email válido"),
        password: Yup.string().required("A senha é obrigatória"),
      });

      try {
        await schema.validate(data, {
          abortEarly: false,
        });
        await signIn({
          email: data.email,
          password: data.password,
        });
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);
          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: "error",
          title: "Erro ao autenticar",
          description: "Email ou senha inválidos",
        });
      }
    },
    [addToast, signIn]
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logo} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Faça seu logon</h1>

            <Input
              name="email"
              type="text"
              placeholder="E-mail"
              icon={FiMail}
            />
            <Input
              name="password"
              type="password"
              placeholder="Senha"
              icon={FiLock}
            />

            <Button type="submit">Entrar</Button>

            <Link to="/forgot-password">Esqueci minha senha</Link>
          </Form>

          <Link to="/signup">
            <FiLogIn />
            Criar conta
          </Link>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default SignIn;
