import { View, StyleSheet } from 'react-native';

export const Container = ({ children, style }) => {
  return <View style={[styles.container, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F3F5', // default background colour
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 100,
  },
});