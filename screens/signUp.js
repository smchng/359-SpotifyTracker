import React, { useState } from 'react';
import { StyleSheet, View, Text, Button, Image, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { NavigationButton } from "../components/buttons";
import TextInput from "../components/input";
import { Container } from '../components/Container';

export default function SignUp({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Adjust behavior based on platform
    >
      {/* Optionally wrap in ScrollView to allow scrolling when keyboard shows */}
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Container>
          <View style={styles.welcomeContainer}>
            <Text style={styles.greetingText}>Welcome to</Text>
            <Text style={styles.nameAppText}>Melody Moods!</Text>
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
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              textColor="black"
              secureTextEntry={true} // This will hide the password input
            />
          </View>

          <View style={styles.buttonContainer}>
            <NavigationButton 
              text="Sign Up" 
              page="SpotifyLogin" 
              navigation={navigation}
              buttonStyle={styles.signUpButton}
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
    marginTop: -50,
  },
  image: {
    width: 180,
    height: 180,
    marginTop: 15,
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
    marginTop: 30,
  },
  signUpButton: {
    backgroundColor: '#303030',
  },
  buttonContainer: {
    //marginTop: 20, // Optional: Add some spacing between inputs and the button
  },
});
