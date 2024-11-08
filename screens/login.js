import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { NavigationButton } from "../components/buttons";
import TextInput from "../components/input";
import { Container } from '../components/Container';  // Assuming this is a custom container component

export default function Login({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Adjust behavior based on platform
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Container>
          <View style={styles.welcomeContainer}>
            <Text style={styles.greetingText}>Welcome Back!</Text>
            <Text style={styles.nameAppText}>Melody Moods</Text>
            <Image
              source={require('../assets/welcomeIcon1.png')}
              style={styles.image}
              resizeMode="contain"
            />
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
          </View>

          <View style={styles.buttonContainer}>
            <NavigationButton 
              text="Login" 
              page="SpotifyLogin" 
              navigation={navigation}
              buttonStyle={styles.loginButton}
              textColor="#FFFFFF" 
            />
          </View>
        </Container>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  welcomeContainer: {
    alignItems: 'center',
    marginTop: -50,  // Adjust top margin to push the content higher (similar to SignUp)
    marginBottom: 30,  // Add some spacing below the text
  },
  image: {
    width: 180,
    height: 180,
    marginTop: 15,  // Adjust image margin to space it out properly
  },
  greetingText: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#303030',
  },
  nameAppText: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#303030',
  },
  inputContainer: {
    width: '100%',
    marginTop: 70,  // Adjust top margin to ensure inputs are spaced from the welcome section
  },
  loginButton: {
    backgroundColor: '#303030',

  },
  buttonContainer: {
    
  },
});
