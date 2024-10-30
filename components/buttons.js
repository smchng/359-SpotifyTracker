import { StyleSheet, View, Text, Button } from "react-native";
//Login Button
export function Buttons({ text, page, navigation }) {
  const handlePage = () => {
    navigation.navigate(page); // Navigate to the page passed in as a prop
  };
  return <Button title={text} onPress={handlePage}></Button>;
}

//Timer Button

//Each Profile logs date button

//Ciruclar button for Home, Map, x
