import React from "react";
import { View, Button } from "react-native";

import useAuthContext from "../../contexts/AuthContext";

const Dashboard: React.FC = () => {
  const { signOut } = useAuthContext();
  return (
    <View>
      <Button title="Sair" onPress={signOut} />
    </View>
  );
};

export default Dashboard;
