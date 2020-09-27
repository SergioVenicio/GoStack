import React, { useRef, useCallback } from "react";
import { useHistory, useLocation } from "react-router-dom";

import { FiLock } from "react-icons/fi";
import { FormHandles } from "@unform/core";
import { Form } from "@unform/web";
import * as Yup from "yup";

import useToastContext from "../../contexts/ToastContext";

import Input from "../../components/Input";
import Button from "../../components/Button";

import { AnimationContainer, Background, Container, Content } from "./styles";

import logo from "../../assets/logo.svg";
import getValidationErrors from "../../utils/getValidationErrors";
import api from "../../services/api";

interface ResetPassowrdData {
  password: string;
  password_confirmation: string;
}

const ResetPassowrd: React.FC = () => {
  const history = useHistory();
  const location = useLocation();

  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToastContext();

  const handleSubmit = useCallback(
    async (data: ResetPassowrdData): Promise<void> => {
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        password: Yup.string().required("A senha é obrigatória"),
        password_confirmation: Yup.string().oneOf(
          [Yup.ref("password"), undefined],
          "As senhas devem ser iguais"
        ),
      });

      try {
        await schema.validate(data, {
          abortEarly: false,
        });

        const { password, password_confirmation } = data;
        const token = location.search.replace("?token=", "");

        if (!token) {
          addToast({
            type: "error",
            title: "Erro ao resetar senha",
            description: "Token inválido.",
          });
          return;
        }

        await api.post("/password/reset", {
          password,
          password_confirmation,
          token,
        });

        history.push("/");
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);
          formRef.current?.setErrors(errors);
          return;
        }

        addToast({
          type: "error",
          title: "Erro ao resetar senha",
          description: "Ocorreu um erro ao resetar sua senha, tente novamente.",
        });
      }
    },
    [addToast, history, location.search]
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logo} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Recuperar senha</h1>

            <Input
              name="password"
              type="password"
              placeholder="Nova senha"
              icon={FiLock}
            />

            <Input
              name="password_confirmation"
              type="password"
              placeholder="Confirmação de senha"
              icon={FiLock}
            />

            <Button type="submit">Alterar senha</Button>
          </Form>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default ResetPassowrd;
