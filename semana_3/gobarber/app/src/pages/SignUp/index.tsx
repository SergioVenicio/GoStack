import React, { useRef } from "react";
import {
  Alert,
  Image,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { Form } from "@unform/mobile";
import { FormHandles } from "@unform/core";

import api from "../../services/api";

import * as Yup from "yup";

import getValidationErrors from "../../utils/getValidationErrors";

import Icon from "react-native-vector-icons/Feather";

import Input from "../../components/Input";
import Button from "../../components/Button";

import logoImg from "../../assets/logo.png";

import { Container, Title, BackToSignIn, BackToSignInText } from "./styles";

interface submitData {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const navigation = useNavigation();
  const formRef = useRef<FormHandles>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const handleSignUp = async (data: submitData) => {
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
      return;
    }

    try {
      await api.post("/users", data);
      Alert.alert("Cadastro realizado com sucesso!");
      navigation.navigate("SignIn");
    } catch (error) {
      const { message } = error.response.data;
      const description =
        message === "This email has already been used"
          ? "Esse usuário já existe"
          : message;

      Alert.alert("Erro ao realizar cadastro", description);
    }
  };

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        enabled
      >
        <ScrollView contentContainerStyle={{ flex: 1 }}>
          <Container>
            <Image source={logoImg} />

            <View>
              <Title>Crie sua conta</Title>
            </View>

            <Form
              onSubmit={handleSignUp}
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
                  passwordRef.current?.focus();
                }}
              />
              <Input
                ref={passwordRef}
                secureTextEntry
                name="password"
                icon="lock"
                placeholder="Senha"
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
                Entrar
              </Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      <BackToSignIn
        onPress={() => {
          navigation.navigate("SignIn");
        }}
      >
        <Icon name="arrow-left" size={20} color="#fff" />
        <BackToSignInText>Voltar para logon</BackToSignInText>
      </BackToSignIn>
    </>
  );
};

export default SignUp;
