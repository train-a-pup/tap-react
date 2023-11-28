import { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function PushNotifications() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  function init() {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token))

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification)
    })

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response)
    })

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    }
  }


  async function schedulePushNotification(title, body, time, repeats) {
    let trigger = {}
  
    switch (repeats) {
      case 'never':
        trigger = new Date(time)
        break;
      case 'daily':
        trigger = {
          seconds: 5,
          repeats: true
        }
        break;
      case 'weekly':
        let weekDay = new Date(time).getDay()
        trigger = {
          weekDay: weekDay, 
          hour: 12, 
          minute: 0,
          repeats: true
        }
        break;
      case 'monthly':
        
        break;
      case 'yearly':
        
        break;
      default:
        break;
    }

    let r = await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
      },
      trigger: trigger,
    });
  }
  
  const addOneMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const day = date.getDate()
    const newMonth = month + 1
    const nextMonthLastDay = new Date(year, newMonth, 0).getDate()
  
    const newDay = day > nextMonthLastDay ? nextMonthLastDay : day
  
    const newYear = newMonth > 11 ? year + 1 : year
    const finalMonth = newMonth > 11 ? 0 : newMonth;
  
    const newDate = new Date()
    newDate.setMonth(newMonth)
    newDate.setDate(newDay)
    newDate.setYear(newYear)
  
    return newDate
  }
  
  async function registerForPushNotificationsAsync() {
    let token;
  
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    return token;
  }

  return {
    init,
    schedulePushNotification
  }
}
