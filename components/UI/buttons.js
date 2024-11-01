import { StyleSheet, View, Text, Button } from "react-native";
//Login Button
export function Buttons({ text, page, navigation }) {
  const handlePage = () => {
    navigation.navigate(page); // Navigate to the page passed in as a prop
  };
  return <Button title={text} onPress={handlePage}></Button>;
}

export function LogoutButton({ text, page, navigation, onPress }) {
  const handlePage = () => {
    if (onPress) onPress(); // Call onPress if provided
    navigation.navigate(page); // Navigate if navigation and page are provided
  };

  return <Button title={text} onPress={handlePage} />;
}

//Timer Button

//Each Profile logs date button

//Ciruclar button for Home, Map, x
export function CircleButton({ text, page, navigation }) {
  const handlePage = () => {
    navigation.navigate(page); // Navigate to the page passed in as a prop
  };
  return <Button title={text} onPress={handlePage}></Button>;
}
