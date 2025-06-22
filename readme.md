## Overview

**Project Title**: Mini Study Tracker

**Project Description**:  
Mini Study Tracker is a mobile app built using React Native that helps students keep track of how much time they’ve studied for each course. The app allows users to input their course name, log the number of hours and minutes studied, and write session notes. It displays total time tracked per course, supports deleting sessions or full courses, and stores all data locally so progress persists even after the app is closed. A welcome screen with a study-themed image greets the user before accessing the tracker.

**Project Goals**:

- Learn and apply core React Native concepts (components, props, useState, useEffect)
- Handle user input and validate form data
- Dynamically update display after interaction
- Store and retrieve data using `AsyncStorage` for persistence
- Add a welcome screen and use local image assets
- Style components with clean, user-friendly layouts

## Instructions for Build and Use

### Steps to run the app:

1. Clone/Download the repository (or download the project folder)
2. Navigate into the project directory
3. Run `npm install` to install required packages
4. Launch the app using Expo:
   ```
   npx expo start
   ```
   Then scan the QR code with Expo Go app on your phone.

### How to use the app:

1. On first launch, you’ll see a welcome screen with a “Get Started” button
2. Enter a course name and tap "Add"
3. Add study time (hours and minutes) and optional notes for the session
4. View total time per course and session notes
5. Delete sessions or entire courses as needed

## Development Environment

To recreate the development environment, use the following tools:

- React Native (via Expo)
- Node.js (v22+)
- npm (v10+)
- Visual Studio Code**
- Expo Go (on iOS/Android device for testing)
- Expo CLI

## Useful Resources

The following tutorials and documentation were helpful while building this app:

- [React Native Crash Course (YouTube)](https://youtu.be/bCpFbERgj7s)
- [React Native for Beginners (YouTube)](https://youtu.be/WDunoPNBxKA)
- [React Native Official Docs](https://reactnative.dev/)
- [React Native Tutorial](https://reactnative.dev/docs/tutorial?utm_source=chatgpt.com)
- [React Masters Documentation (2025)](https://medium.com/@reactmasters.in/react-native-documentation-for-2025-fbcff4d00bb4)
- [Definitive Guide for React Developers](https://blog.risingstack.com/a-definitive-react-native-guide-for-react-developers/?utm_source=chatgpt.com)
- [ChatGPT](https://chatgpt.com)

## Future Work

- [ ] Add support for multiple users or profiles
- [ ] Include weekly and monthly study summaries with visual charts
- [ ] Add reminders or motivational popups to encourage consistency
- [ ] Improve accessibility and visual polish/Fix iPhone Expo issues