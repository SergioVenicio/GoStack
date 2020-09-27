import React, { useRef, useCallback, useState } from "react";

import { Link } from "react-router-dom";

import { FiLogIn, FiMail } from "react-icons/fi";
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

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToastContext();

  const handleSubmit = useCallback(
    async (data): Promise<void> => {
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        email: Yup.string()
          .required("O email é obrigatório")
          .email("Digite um email válido"),
      });

      try {
        setLoading(true);
        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post("/password/forgot", {
          email: data.email,
        });
        addToast({
          type: "success",
          title: "Email de recuperação enviado",
          description:
            "Enviamos um e-mail para confirmar a recuperação de senha, cheque sua caixa de entrada.",
        });
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);
          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: "error",
          title: "Erro na recuperação de senha",
          description:
            "Ocorreu um erro ao tentar realizar a recuperação de senha, tente novamente.",
        });
      } finally {
        setLoading(false);
      }
    },
    [addToast]
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logo} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Recuperar senha</h1>

            <Input
              name="email"
              type="text"
              placeholder="E-mail"
              icon={FiMail}
            />

            <Button loading={loading} type="submit">
              Recuperar
            </Button>

            <Link to="/">Voltar para o logon</Link>
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

export default ForgotPassword;
