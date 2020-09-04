import styled from "styled-components/native";
import { RectButton } from "react-native-gesture-handler";

export const ButtonText = styled.Text`
  font-family: "RobotoSlab-Medium";
  color: #312e38;
  font-size: 18px;
`;

export const Container = styled(RectButton)`
  width: 100%;
  height: 60px;
  background: #ff9000;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
`;
