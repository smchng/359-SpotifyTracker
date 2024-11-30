import {
  StyleSheet,
  View,
  Text,
  Button,
  TouchableOpacity,
  Image,
} from "react-native";

export const CustomButton = ({ text, onPress, style, textColor }) => (
  <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
    <Text style={[styles.buttonText, { color: textColor }]} numberOfLines={1}>
      {text}
    </Text>
  </TouchableOpacity>
);

export const NavigationButton = ({
  text,
  page,
  navigation,
  buttonStyle,
  textColor,
}) => {
  const handlePage = () => {
    navigation.navigate(page);
  };
  return (
    <CustomButton
      text={text}
      onPress={handlePage}
      style={buttonStyle}
      textColor={textColor}
    />
  );
};

export const ActionButton = ({ text, buttonStyle, textColor, onPress }) => {
  const handlePage = () => {
    if (onPress) onPress(); // Call the custom function if it exists
  };

  return (
    <CustomButton
      text={text}
      onPress={handlePage} // Corrected to pass only `handlePage` to the `CustomButton`
      style={buttonStyle}
      textColor={textColor}
    />
  );
};

export function LogoutButton({ page, navigation, onPress }) {
  const handlePage = () => {
    if (onPress) onPress(); // Call onPress if provided
    navigation.navigate(page); // Navigate if navigation and page are provided
  };

  return (
    <CustomButton
      text="Logout"
      onPress={handlePage} // Corrected to pass only `handlePage` to the `CustomButton`
      style={{ backgroundColor: "#303030" }}
      textColor="white"
    />
  );
}

//Ciruclar button for Home, Map, x
export function CircleButton({ SVGIcon, page, navigation }) {
  const handlePage = () => {
    navigation.navigate(page);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePage}>
      {/* Render the SVG component passed in as a prop */}
      {SVGIcon && <SVGIcon width={20} height={20} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    position: "absolute", // Position the track display absolutely
    top: 20, 
    left: 20, 
    zIndex: 1,
    backgroundColor: "#EBEFF2",
    padding: 15,
    borderRadius: 100,
    shadowColor: "#000", 
    shadowOffset: { width: 5, height: 2 },
    shadowOpacity: 0.25, 
    shadowRadius: 7, 
    elevation: 2, 
  },
  button: {
    //alignItems: 'center',
    width: 300,
    marginVertical: 15,
    borderRadius: 13,
    paddingVertical: 20,

    //shadow
    shadowColor: "#000000",
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 7,
  },

  buttonText: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
});
