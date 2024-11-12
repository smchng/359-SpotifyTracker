import { StyleSheet, View, TextInput as RNTextInput } from 'react-native';

// Custom TextInput component
const CustomTextInput = ({ value, onChangeText, placeholder, style, textColor }) => (
  <View style={[styles.inputContainer, style]}>
    <RNTextInput
      style={[styles.input, { color: textColor }]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#888" 
    />
  </View>
);

const styles = StyleSheet.create({
  inputContainer: {
    width: 300,
    marginBottom: 15,
    borderRadius: 13,
    paddingVertical: 20,
    backgroundColor: '#303030',
    alignSelf: 'center',
    
    //shadow
    shadowColor: '#000000',
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 7,
  },

  input: {
    paddingLeft: 20,
    fontSize: 12,
    textAlign: 'left',
  },
});

export default CustomTextInput;
