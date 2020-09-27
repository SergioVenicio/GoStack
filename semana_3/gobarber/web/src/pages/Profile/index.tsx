import React, { ChangeEvent, useCallback, useRef } from "react";
import { Link, useHistory } from "react-router-dom";

import { FormHandles } from "@unform/core";
import { Form } from "@unform/web";
import * as Yup from "yup";

import useToastContext from "../../contexts/ToastContext";

import { FiMail, FiLock, FiUser, FiCamera, FiArrowLeft } from "react-icons/fi";
import Input from "../../components/Input";
import Button from "../../components/Button";

import getValidationErrors from "../../utils/getValidationErrors";

import api from "../../services/api";

import { AvatarInput, Container, Content } from "./styles";
import useAuthContext from "../../contexts/AuthContext";

interface profileData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  old_password: string;
}
const Profile: React.FC = () => {
  const { user, updateUser } = useAuthContext();
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToastContext();
  const history = useHistory();

  const handleAvatarChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target?.files) {
        const data = new FormData();
        data.append("avatar", event.target.files[0]);

        api.patch("/users/avatar", data).then(({ data }) => {
          addToast({
            type: "success",
            title: "Avatar atualizado com sucesso!",
          });
          updateUser(data);
        });
      }
    },
    [addToast, updateUser]
  );

  const handleSubmit = useCallback(
    async (data: profileData): Promise<void> => {
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        name: Yup.string().required("O nome é obrigatório"),
        email: Yup.string()
          .required("O email é obrigatório")
          .email("Digite um email válido"),

        old_password: Yup.string(),
        password: Yup.string()
          .min(6, "A senha deve possuir pelo menos 6 caracteres")
          .when("old_password", {
            is: true,
            then: Yup.string().required(),
            otherwise: Yup.string(),
          }),
        password_confirmation: Yup.string().oneOf(
          [Yup.ref("password"), undefined],
          "Confimação incorreta"
        ),
      });

      try {
        await schema.validate(data, {
          abortEarly: false,
        });
      } catch (error) {
        const errors = getValidationErrors(error);
        formRef.current?.setErrors(errors);
        console.error(error);
        return;
      }

      try {
        const {
          name,
          email,
          password,
          old_password,
          password_confirmation,
        } = data;
        const formData = Object.assign(
          {
            name,
            email,
          },
          old_password
            ? {
                password,
                old_password,
                password_confirmation,
              }
            : {}
        );
        await api.put("/profile", formData);
        addToast({
          type: "success",
          title: "Perfil atualizado!",
          description: "Suas infomações foram atualizadas com sucesso!",
        });

        updateUser({
          ...user,
          name: data?.name || user.name,
          email: data?.email || user.email,
        });
        history.push("/");
      } catch (error) {
        const { data } = error.response;
        const { message } = data;
        addToast({
          type: "error",
          title: "Erro ao realizar atualização",
          description:
            "Ocorreu um erro ao atualizar o perfil, tente novamente.",
        });
      }
    },
    [addToast, history]
  );

  return (
    <Container>
      <header>
        <div>
          <Link to="/dashboard">
            <FiArrowLeft />
          </Link>
        </div>
      </header>

      <Content>
        <Form
          ref={formRef}
          initialData={{
            ...user,
          }}
          onSubmit={handleSubmit}
        >
          <AvatarInput>
            <img src={user.avatar_url} alt={user.name} />
            <label htmlFor="avatar">
              <FiCamera />
              <input type="file" id="avatar" onChange={handleAvatarChange} />
            </label>
          </AvatarInput>

          <h1>Meu perfil</h1>

          <Input name="name" type="text" placeholder="Nome" icon={FiUser} />
          <Input name="email" type="text" placeholder="E-mail" icon={FiMail} />
          <div className="divider" style={{ marginTop: "24px" }}></div>
          <Input
            name="old_password"
            type="password"
            placeholder="Senha atual"
            icon={FiLock}
          />
          <Input
            name="password"
            type="password"
            placeholder="Nova senha"
            icon={FiLock}
          />
          <Input
            name="password_confirmation"
            type="password"
            placeholder="Confirmar senha"
            icon={FiLock}
          />
          <Button type="submit">Confirmar mudanças</Button>
        </Form>
      </Content>
    </Container>
  );
};

export default Profile;
