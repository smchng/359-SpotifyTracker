import { StyleSheet, TouchableOpacity, Text, Image } from "react-native";

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

export const LoginButton = ({
  text,
  navigation,
  onPress, // Make sure this prop is used
  buttonStyle,
  textColor,
}) => {
  return (
    <CustomButton
      text={text}
      onPress={onPress} // Pass it to the CustomButton
      style={buttonStyle}
      textColor={textColor}
    />
  );
};

//Welcome Pages Image Component

// Logout Button Component
export const LogoutButton = ({ text, page, navigation, onPress }) => {
  const handlePage = () => {
    if (onPress) onPress();
    navigation.navigate(page);
  };
  return <CustomButton text={text} onPress={handlePage} />;
};

// Circular Button Component (if needed in the future)
export const CircleButton = ({ text, page, navigation }) => {
  const handlePage = () => {
    navigation.navigate(page);
  };
  return <CustomButton text={text} onPress={handlePage} />;
};

const styles = StyleSheet.create({
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
