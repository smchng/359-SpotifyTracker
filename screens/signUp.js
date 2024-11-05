// Sign up
import React, { useState } from 'react';
import { StyleSheet, View, Text, Button, Image } from "react-native";
import { NavigationButton } from "../components/buttons";
import TextInput from "../components/input";
import { Container } from '../components/Container';

export default function SignUp({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  return (
    <Container>
      <View style={styles.welcomeContainer}>
        <Text style={styles.greetingText}>Welcome to</Text>
        <Text style={styles.nameAppText}>Melody Moods!</Text>
        {/* image should go on this line */}
        {/* <WelcomeIcon width="100%" height="100%" /> */}
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
  );
}

const styles = StyleSheet.create({
  welcomeContainer: {
    alignItems: 'center',
  },
  image: {
    width: 180,
    height: 180,
    
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
    marginTop: 25,
  },
  signUpButton: {
    backgroundColor: '#303030',
  },
});