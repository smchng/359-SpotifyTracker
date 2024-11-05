import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, KeyboardAvoidingView, ScrollView } from 'react-native';
import { NavigationButton } from "../components/buttons";
import TextInput from "../components/input";

// Login with existing account
export default function Login({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <KeyboardAvoidingView 
        style={styles.container} 
        behavior="padding" 
        keyboardVerticalOffset={100}
      >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.welcomeContainer}>
          <Image
            source={require('../assets/welcomeIcon1.png')}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.greetingText}>Welcome Back!</Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="Username"
            textColor="black"
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            textColor="black"
            secureTextEntry={true} // This will hide the password input
          />
          <NavigationButton 
            text="Login" 
            page="SpotifyLogin" 
            navigation={navigation}
            buttonStyle={styles.loginButton}
            textColor="#FFFFFF" 
          />
        </View>
      </ScrollView>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F3F5',
    justifyContent: 'space-between',
    alignItems: 'center',
    // marginVertical: 100,
  },

  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },

  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 100,
  },

  image: {
    width: 180,
    height: 180,
  },

  greetingText: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000000',
  },

  inputContainer: {
    marginTop: 60,
  },

  loginButton: {
    backgroundColor: '#303030',
  },
});
