import {
  StyleSheet,
  View,
  Text,
  Button,
  TouchableOpacity,
  Image,
} from "react-native";
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
export function CircleButton({ SVGIcon, page, navigation }) {
  const handlePage = () => {
    navigation.navigate(page);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePage}>
      {/* Render the SVG component passed in as a prop */}
      {SVGIcon && <SVGIcon width={25} height={25} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    position: "absolute", // Position the track display absolutely
    top: 20, // Adjust bottom position as necessary
    left: 20, // Adjust left position as necessary
    zIndex: 1,
    backgroundColor: "#EBEFF2",
    padding: 20,
    borderRadius: 100,
    shadowColor: "#000", // Color of the shadow
    shadowOffset: { width: 5, height: 2 }, // Offset shadow to the right by 5px (horizontal)
    shadowOpacity: 0.25, // Shadow opacity (simulating rgba(0, 0, 0, 0.25))
    shadowRadius: 7, // Shadow blur radius (simulating 7px)
    elevation: 2, // For Android shadow effect
  },
});
