// tokenStorage.js

let accessToken = null;

// Function to set the access token
export const setAccessToken = (token) => {
  accessToken = token;
  console.log("Access token saved:", token);
};

// Function to get the access token
export const getAccessToken = () => {
  return accessToken;
};

// Optional: Clear access token
export const clearAccessToken = () => {
  accessToken = null;
};
