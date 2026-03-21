import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { GameProvider } from './src/utils/GameContext';
import HomeScreen from './src/screens/HomeScreen';
import SetupScreen from './src/screens/SetupScreen';
import GameScreen from './src/screens/GameScreen';
import ChallengeScreen from './src/screens/ChallengeScreen';
import ShameWallScreen from './src/screens/ShameWallScreen';
import ScoreScreen from './src/screens/ScoreScreen';
import HowToPlayScreen from './src/screens/HowToPlayScreen';

const Stack = createStackNavigator();

const DarkTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#070714',
    card: '#070714',
    text: '#FFFFFF',
    border: '#2A2A5A',
    notification: '#FF3CAC',
  },
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GameProvider>
        <NavigationContainer theme={DarkTheme}>
          <StatusBar style="light" backgroundColor="#070714" />
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerShown: false,
              cardStyle: { backgroundColor: '#070714' },
              cardStyleInterpolator: ({ current, layouts }) => ({
                cardStyle: {
                  opacity: current.progress,
                  transform: [
                    {
                      translateY: current.progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [40, 0],
                      }),
                    },
                  ],
                },
              }),
            }}
          >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="HowToPlay" component={HowToPlayScreen} />
            <Stack.Screen name="Setup" component={SetupScreen} />
            <Stack.Screen name="Game" component={GameScreen} />
            <Stack.Screen
              name="Challenge"
              component={ChallengeScreen}
              options={{
                cardStyleInterpolator: ({ current, layouts }) => ({
                  cardStyle: {
                    opacity: current.progress,
                    transform: [
                      {
                        scale: current.progress.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.9, 1],
                        }),
                      },
                    ],
                  },
                }),
              }}
            />
            <Stack.Screen name="ShameWall" component={ShameWallScreen} />
            <Stack.Screen name="Score" component={ScoreScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </GameProvider>
    </GestureHandlerRootView>
  );
}
