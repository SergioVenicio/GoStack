import React, { useCallback, useEffect, useRef } from "react";
import {
  Alert,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from "react-native";

import ImagePicker from "react-native-image-picker";

import Icon from "react-native-vector-icons/Feather";

import { useNavigation } from "@react-navigation/native";

import { Form } from "@unform/mobile";
import { FormHandles } from "@unform/core";

import api from "../../services/api";

import * as Yup from "yup";

import getValidationErrors from "../../utils/getValidationErrors";

import Input from "../../components/Input";
import Button from "../../components/Button";

import {
  Container,
  Title,
  UserAvatarButton,
  UserAvatar,
  Spacer,
  BackButton,
} from "./styles";
import useAuthContext from "../../contexts/AuthContext";

const SignUp: React.FC = () => {
  const { user, updateUser } = useAuthContext();
  const navigation = useNavigation();
  const formRef = useRef<FormHandles>(null);
  const emailRef = useRef<TextInput>(null);
  const oldPasswordRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const handleUpdateAvatar = useCallback(async () => {
    ImagePicker.showImagePicker(
      {
        title: "Selectione um avatar",
        cancelButtonTitle: "Cancelar",
        takePhotoButtonTitle: "Usar câmera",
        chooseFromLibraryButtonTitle: "Escolher da galeria",
      },
      (response) => {
        if (response.didCancel) {
          return;
        }

        if (response.error) {
          Alert.alert("Erro ao atualizar seu avatar.");
          return;
        }

        const data = new FormData();
        data.append("avatar", {
          uri: response.uri,
          name: `${user.id}.jpg`,
          type: "image/jpeg",
        });

        api
          .patch("/users/avatar", data)
          .then((apiResponse) => {
            updateUser({
              ...user,
              ...apiResponse.data,
            });
          })
          .catch((e) => console.log(e));
      }
    );
  }, [updateUser]);

  const handleSubmit = useCallback(async (data): Promise<void> => {
    console.log(data);
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
      updateUser({
        ...user,
        name: data?.name || user.name,
        email: data?.email || user.email,
      });
      Alert.alert("Perfil atualizado com sucesso");
      navigation.goBack();
    } catch {
      Alert.alert(
        "Erro na atualização de perfil",
        "Ocorreu um erro ao atualizar seu perfil, tente novamente mais tarde"
      );
    }
  }, []);

  useEffect(() => {
    formRef.current?.setData({
      name: user.name,
      email: user.email,
    });
  }, []);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, []);
  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        enabled
      >
        <ScrollView contentContainerStyle={{ flex: 1 }}>
          <Container>
            <BackButton onPress={handleGoBack}>
              <Icon name="chevron-left" size={24} color="#999591" />
            </BackButton>

            <UserAvatarButton onPress={handleUpdateAvatar}>
              <UserAvatar source={{ uri: user.avatar_url }} />
            </UserAvatarButton>

            <View>
              <Title>Meu perfil</Title>
            </View>

            <Form
              onSubmit={handleSubmit}
              ref={formRef}
              style={{ flex: 1, width: "100%" }}
            >
              <Input
                autoCapitalize="words"
                name="name"
                icon="user"
                placeholder="Nome"
                returnKeyType="next"
                onSubmitEditing={() => {
                  emailRef.current?.focus();
                }}
              />

              <Input
                ref={emailRef}
                keyboardType="email-address"
                autoCorrect={false}
                autoCapitalize="none"
                name="email"
                icon="mail"
                placeholder="E-mail"
                returnKeyType="next"
                onSubmitEditing={() => {
                  oldPasswordRef.current?.focus();
                }}
              />

              <Spacer />

              <Input
                ref={oldPasswordRef}
                secureTextEntry
                name="old_password"
                icon="lock"
                placeholder="Senha atual"
                textContentType="newPassword"
                returnKeyType="send"
                onSubmitEditing={() => {
                  passwordRef.current?.focus();
                }}
              />

              <Input
                ref={passwordRef}
                secureTextEntry
                name="password"
                icon="lock"
                placeholder="Nova senha"
                textContentType="newPassword"
                returnKeyType="send"
                onSubmitEditing={() => {
                  confirmPasswordRef.current?.focus();
                }}
              />

              <Input
                ref={confirmPasswordRef}
                secureTextEntry
                name="password_confirmation"
                icon="lock"
                placeholder="Confirme sua senha"
                textContentType="newPassword"
                returnKeyType="send"
                onSubmitEditing={() => {
                  formRef.current?.submitForm();
                }}
              />

              <Button
                onPress={() => {
                  formRef.current?.submitForm();
                }}
              >
                Confirmar mudanças
              </Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default SignUp;
