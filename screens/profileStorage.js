import React, { useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { CircleButton } from "../components/UI/buttons";
import Logout from "../components/logout";
import { NavigationButton } from "../components/UI/buttons";
import { RecentlyPlayed } from "../components/RecentlyPlayed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LocIcon from "../assets/svg/location.svg";
import UserIcon from "../assets/svg/user.svg"; // Assuming you want a user icon in the top nav
import MusicTimer from "../components/MusicTimer";
import { useUser } from "../components/UserAuth"; // Assuming you are using UserContext or similar

// Profile Storage Screen
export function ProfileStorage({ navigation }) {
  const { userId } = useUser(); // Get user information if needed for MusicTimer

  return (
    <View style={styles.container}>
      {/* Top Navigation Bar */}
      <View style={styles.topNav}>
        <CircleButton
          SVGIcon={LocIcon}
          page="Map"
          navigation={navigation}
        />
        <MusicTimer userId={userId} />
      </View>

      {/* User Info Section: Circle Image and Two Boxes */}
      <View style={styles.userInfoSection}>
        {/* Circle Image on top of boxes */}
        <Image
          source={{ uri: "https://placekitten.com/200/200" }} // Placeholder image URL
          style={styles.circleImage}
        />

        {/* Square Boxes */}
        <View style={styles.squareBoxes}>
          <View style={styles.firstBoxContainer}>
            {/* Circle above the first box */}
            <View style={styles.circleTop} />
            <View style={styles.squareBox}>
              <Text style={styles.boxTitle}>User</Text>
            </View>
          </View>

          <View style={styles.secondBoxContainer}>
            {/* Circle above the second box */}
            <View style={styles.circleTop} />
            <View style={styles.squareBox}>
              <Text style={styles.boxTitle}>Spotify ID</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Main Content Below User Info Section */}
      <View style={styles.mainContent}>
        <RecentlyPlayed navigation={navigation} />

        <View style={styles.buttonContainer}>
          <NavigationButton
            text="Logout"
            page="ProfileStorage"
            navigation={navigation}
            buttonStyle={styles.logoutButton}
            textColor="#6E6E6E"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  // Top Navigation bar styling
  topNav: {
    position: "absolute", // Fix at the top of the screen
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1, // Ensure this is above the content
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 80, // Fixed height of the top nav
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4, // For Android shadow effect
  },
  // User Info Section styling (Circle Image + Boxes)
  userInfoSection: {
    alignItems: "center",
    marginTop: 120, // Adjust this for the distance from the top nav
    paddingHorizontal: 16,
  },
  // Circle Image on top of the boxes
  // circleImage: {
  //   position: "absolute",
  //   top: -20, // Moves the image upwards, adjust if needed
  //   width: 80,
  //   height: 80,
  //   borderRadius: 50, // Circular shape
  //   borderWidth: 5,
  //   borderColor: "#000000", // Optional border color
  //   zIndex: 2, // Ensure it's above the boxes
  // },
  // Square Boxes layout
  squareBoxes: {
    flexDirection: "row",
    justifyContent: "flex-start", // Align boxes to the left, no space between them
    width: "100%",
    marginTop: -30, // Adjust distance from the circle image
  },
  // Container for first box with circle on top
  firstBoxContainer: {
    alignItems: "center", // Center the circle on top of the box
    marginRight: 25, // Small gap between boxes
  },
  // Container for second box with circle on top
  secondBoxContainer: {
    alignItems: "center", // Center the circle on top of the box
  },
  squareBox: {
    width: 150,
    height: 100,
    backgroundColor: "#EBEFF2", // Box color
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 13, // Optional rounded corners
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  boxTitle: {
    fontSize: 12,
    color: "#303030",
  },

  // Style for circles above boxes
  circleTop: {
    width: 70,
    height: 70,
    borderRadius: 70, // Make it a perfect circle
    backgroundColor: "#FF6347", // You can change the color
    marginBottom: -10, // Add space between circle and box
  },
  // Container for content below the user info section
  mainContent: {
    marginTop: 280, // Start content below the user info section
    flex: 1,
    paddingHorizontal: 16,
  },
  buttonContainer: {},
  logoutButton: {
    backgroundColor: "#EBEFF2",
  },
});
