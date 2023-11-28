import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { useEffect } from 'react';
import CardList from "../DComponents/CardList";
import { THEME } from "../Constants";
import Events from "../TAPEvents/Events";
import Amazon from "../DogNeeds/Amazon";
import NewDog from "../DogProfile/NewDog";
import DogProfile from "../DogProfile/DogProfile";
import IDCard from "../DogProfile/IDCard";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { BackHandler } from "react-native";

const Tab = createBottomTabNavigator()

export const TabNavigator = () => {
  const iconSize = 30

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
    return () => backHandler.remove()
  }, [])

  return (
    <Tab.Navigator 
      screenOptions={{
        tabBarShowLabel: false, 
        headerShown: false,
        // tabBarActiveBackgroundColor: '#E8D1AF',
        tabBarActiveTintColor: THEME.brandDark,
        tabBarInactiveTintColor: THEME.brandLight,
        tabBarStyle: {
          backgroundColor: THEME.white
        }
      }}
      
    >
      <Tab.Screen 
        name="DogProfile" 
        component={DogProfile} 
        options={{
          headerShown: false,
          tabBarIcon: ({ tintColor, focused }) => (
            <FontAwesome5 solid={true} name='user' color={focused ? THEME.brandDark : THEME.brandLight} size={iconSize}/>
          )
        }}
      />
      <Tab.Screen
        name="Tricks"
        component={CardList}
        options={{
          headerShown: false,
          tabBarIcon: ({ tintColor, focused }) => (
            <FontAwesome5 solid={true} name='cookie-bite' color={focused ? THEME.brandDark : THEME.brandLight} size={iconSize}/>
          )
        }}/>
      <Tab.Screen
        name="Amazon"
        component={Amazon}
        options={{
          headerShown: false,
          tabBarIcon: ({ tintColor, focused }) => (
            <FontAwesome5 solid={true} name='tasks' color={focused ? THEME.brandDark : THEME.brandLight} size={iconSize}/>
          )
        }}
      />
      <Tab.Screen
        name="Events"
        component={Events}
        options={{
          headerShown: false,
          tabBarIcon: ({ tintColor, focused }) => (
            <FontAwesome5 solid={true} name='calendar-alt' color={focused ? THEME.brandDark : THEME.brandLight} size={iconSize}/>
          )
        }}/>
    </Tab.Navigator>
  )
}