import { StyleSheet, View, Text, Button } from "react-native";
import LogoutButton from "./components/logoutButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
//Login Button
export function ProfileStorage() {
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserProfile(null);
  };
  return (
    <View>
      <LogoutButton onLogout={handleLogout} />;
    </View>
  );
}
