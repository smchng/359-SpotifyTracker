// src/App.js

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { UserProvider } from "./components/UserAuth";

//Import the Screens
import Enter from "./screens/enter";
import Login from "./screens/login";
import SignUp from "./screens/signUp";
import SpotifyLogin from "./screens/spotifyLogin";
import { Map } from "./screens/map";
import { ProfileStorage } from "./screens/profileStorage";

export default function App() {
  const Stack = createStackNavigator();
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="SpotifyLogin">
          <Stack.Screen name="SpotifyLogin" component={SpotifyLogin} />
          <Stack.Screen name="ProfileStorage" component={ProfileStorage} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}
