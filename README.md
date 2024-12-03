**Abstract**
This app offers users personalized personality insights based on their mood and 
movement patterns. It helps users explore their music preferences and behavioural 
trends by analyzing their daily habits. 
Leveraging Spotify's API, it tracks listening history, including currently playing tracks, 
and extracts key attributes to create a dynamic musical persona. A music session timer 
segments listening patterns, while integrated Google Maps visualizes user locations 
with custom markers and session routes. 
By analyzing mood and movement patterns alongside listening habits, the app 
generates tailored behavioural and music trend analyses. This combination of data
driven insights empowers users to explore their preferences, understand behavioural 
tendencies, and enhance their music experience through an interactive and 
personalized interface.

**Challenges**
Integrating APIs and managing user authentication presented difficulties, particularly 
with handling IP address restrictions and configuring scopes for proper permissions. 
The correct IP of the expo app needs to be generated and passed into Spotify 
Developer in order for access to the users Spotify account. 
Storing data in the correct Firebase collections or documents and retrieving it 
accurately with the corresponding user ID required specific data organization. 
Additionally, locating and referencing data proved challenging because so many 
elements, such as user sessions or preferences, were dynamic variables that required 
precise mapping and management. Therefore, user IDs and document IDs were 
constantly stored and retrieved.
 We also discovered version issues with Expo. As we had to update our application files 
from SDK 51 to 52 midway through the project. The main challenge was Spotify’s API 
and device were version as we discovered the API is not compatible with older 
devices, such as iPhone 12 or 13 and Samsung Flip4. The polling of songs only worked 
on newer phones such as iPhone 14 and above, so, 2022 or newer devices.
