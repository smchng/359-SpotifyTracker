import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { UserProvider } from "./components/UserAuth";
import { TimerProvider } from "./components/TimerContext";

// Import the Screens
import Enter from "./screens/enter";
import Login from "./screens/login";
import SignUp from "./screens/signUp";
import SpotifyLogin from "./screens/spotifyLogin";
import { Map } from "./screens/map";
import { ProfileStorage } from "./screens/profileStorage";
import PlaylistProfile from "./screens/playlistProfile";

export default function App() {
  const Stack = createStackNavigator();
  return (
    <UserProvider>
      <TimerProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Enter">
            <Stack.Screen name="Enter" component={Enter} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="SpotifyLogin" component={SpotifyLogin} />
            <Stack.Screen name="Map" component={Map} />
            <Stack.Screen name="ProfileStorage" component={ProfileStorage} />
            <Stack.Screen name="PlaylistProfile" component={PlaylistProfile} />
          </Stack.Navigator>
        </NavigationContainer>
      </TimerProvider>
    </UserProvider>
  );
}
