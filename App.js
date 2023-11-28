import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import doggosReducer from './src/Redux/dogoosReducer.js';
import { View, StyleSheet, Dimensions, BackHandler } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import CarouselController from './src/Tricks/CarouselController.js'
import thunk from 'redux-thunk';
import Login from './src/Navigation/Login.js';
import { TabNavigator } from './src/Navigation/TabNavigator.js';
import NewEvent from './src/TAPEvents/NewEvent.js';
import { THEME } from './src/Constants.js';
import NewDog from './src/DogProfile/NewDog.js';
import { useEffect } from 'react';
import NotificationHandler from './src/Notifications/NotificationHandler.js';
import { CalendarView } from './src/TAPEvents/CalendarView.js';
import { useRef } from 'react';
import { StatusBar } from 'react-native';
import Constants from 'expo-constants';
import Snackbar from './src/TAPSnackbar/Snackbar.js';

export default function App() {
  const store = createStore(doggosReducer, applyMiddleware(thunk));
  const Drawer = createDrawerNavigator();
  let width = Dimensions.get('window').width
  let height = Dimensions.get('window').height
  const video = useRef(null)

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
    return () => backHandler.remove()
  }, [])

  return (
    <View style={styles.appContainer}>
      <StatusBar translucent={true} backgroundColor={'transparent'}/>
      <Provider store={store}>
        <NavigationContainer>
          <Drawer.Navigator
            drawerPosition = 'right'  
            drawerType = 'back'
            screenOptions={{drawerPositon: 'right', headerShown:false, drawerStyle:{left: 0}}}
          >
            <Drawer.Screen
              name="Login"
              component={Login}
            />
            <Drawer.Screen 
              name="Home"
              component={TabNavigator}
            />
            <Drawer.Screen
              name="NewDog"
              component={NewDog}
            />
            <Drawer.Screen 
              name="New Event"
              component={NewEvent}
            />
            <Drawer.Screen 
              name="CalendarView"
              component={CalendarView}
            />
            <Drawer.Screen 
              name="Trick"
              component={CarouselController}
              options={{headerShown: false}}
            />
          </Drawer.Navigator>
        </NavigationContainer>
        <Snackbar/>
        <NotificationHandler/> 
      </Provider>
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    backgroundColor: THEME.white,
    flex: 1,
    paddingTop: Constants.statusBarHeight
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  video: {
    flex: 1,
    alignSelf: 'stretch'
  }
});