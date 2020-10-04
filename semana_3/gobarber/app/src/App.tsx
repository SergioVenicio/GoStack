import "react-native-gesture-handler";
import React from "react";
import { View, StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";

import AppProvider from "./contexts";

import Routes from "./routes";

const App: React.FC = () => (
  <NavigationContainer>
    <StatusBar barStyle="light-content" translucent backgroundColor="#312e38" />
    <View style={{ flex: 1, backgroundColor: "#312e38" }}>
      <AppProvider>
        <Routes />
      </AppProvider>
    </View>
  </NavigationContainer>
);

export default App;
