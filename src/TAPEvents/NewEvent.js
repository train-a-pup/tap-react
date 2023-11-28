import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Pressable, SafeAreaView, Platform, TextInput, Dimensions} from 'react-native';
import { THEME, aws_tap_api } from '../Constants.js';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import Dropdown from '../DComponents/Dropdown.js';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../Redux/DoggosActions.js';
import { getUserToken } from '../Redux/TapSelector.js';
import Header from '../DComponents/Header.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NewEvent({navigation}) {

  const dispatch = useDispatch()

  const [text, onTextChange] = useState('')
  const [daySelected, setDaySelected] = useState(false)
  const [showPicker, setShowPicker] = useState(false)
  const [repeats, setRepeats] = useState(null)
  const [date, setDate] = useState(new Date());
  const userJwt = useSelector((state) => getUserToken(state))

  const toggleDatePicker = () => {
    setDaySelected(false)
    setShowPicker(true)
  }

  const androidChangeDate = (event) => {
    if(daySelected) {
      let time = new Date(event.nativeEvent.timestamp)
      let newDate = new Date(date)
      newDate.setHours(time.getHours())
      newDate.setMinutes(time.getMinutes())
      setDate(newDate)
      setDaySelected(false)
      setShowPicker(false)
    } else {
      setDate(new Date(event.nativeEvent.timestamp))
      setDaySelected(true)
    }
  }


  const platformDateTime = () => {
    if(Platform.OS === 'android') {
      return (
        <View style={styles.dateTimeContainer}>
          <Text style={styles.inputTitle}>Start</Text>
          <TouchableOpacity style={styles.inputTitle} onPress={toggleDatePicker}>
            <Text>{`${date.toLocaleDateString()} ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`}</Text>
          </TouchableOpacity>
          {showPicker && (daySelected ? 
            <RNDateTimePicker
              mode="time"
              value={date}
              display='spinner'
              onChange={androidChangeDate}
            />
            : 
            <RNDateTimePicker
              mode="date"
              display='spinner'
              value={date}
              onChange={androidChangeDate}
            />
          )}
        </View>
      )
    } else if (Platform.OS === 'ios') {
      return (
        <View style={styles.inputContainer}>
          <Text style={styles.inputTitle}>Start</Text>
          <RNDateTimePicker
            mode="datetime"
            value={date}
            // onChange={onChange}
          />
        </View>
      )
    }
  }

  const onDropdownChange = (repeatOption) => {
    setRepeats(repeatOption)
  }

  const save = () => {
    let event = {
      date: date,
      repeats: repeats,
      title: text
    }
    console.log(JSON.stringify({
      "type": "userNotification",
      "dueDate": new Date(date).toISOString(),
      "functionParams": {
        "userAuth": userJwt,
        "repeats": repeats
      }
    }))

    const postEventWithToken = async () => {
      const pushToken = await AsyncStorage.getItem("pushToken");
      const params = {
        "title": event.title,
        token: userJwt,
        body: '',
        "date": new Date(date).getTime(),
        "repeats": repeats,

      }

      if (pushToken) {
        params.pushToken = pushToken
      }

      fetch(`${aws_tap_api}/events`, {
        method: "POST",
        body: JSON.stringify(params)
      }).then(res => res.json()).then(res => {
        dispatch(getUser(userJwt))
        if(res.startDate) {
          navigation.navigate('Events')
        }
      }).catch((error) => {
        console.log('error fetching trick', error)
        return null
      })
    };
    postEventWithToken();
  }

  return (
    <>
      <Header navigation={navigation} back title={'New Event'} backLocation={'Events'}/>
      <SafeAreaView style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder='Title'
            onChangeText={onTextChange}
          />
        </View>

        {platformDateTime()}

        <View style={styles.dropdown}>
          <Dropdown
            label={'Repeats'}
            options={['never', 'daily', 'weekly', 'monthly', 'yearly']}
            onChange={onDropdownChange}
            backgroundColor={THEME.whiteMidtone}
            textStyle={{paddingLeft: 10}}
          />
        </View>

        <View style={styles.saveContainer}>
          <TouchableOpacity onPress={save}>
            <View style={styles.save}>
              <Text style={styles.saveText}>Save</Text>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.white,
    padding: '8%'
  },
  input: {
    height: 40,
    padding: 10,
    borderRadius: 5,
    backgroundColor: THEME.whiteMidtone,
    alignContent: 'center'
  },
  inputContainer: {
    margin: 12,
  },
  dropdown: {
    margin: 12,
    borderRadius: 5,
  },
  dateTimeContainer: {
    margin: 12,
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: THEME.whiteMidtone,
    height: 45,
    borderRadius: 5
  },
  inputTitle: {
    flex: 1,
    paddingTop: '4%',
    paddingLeft: 10,
  },
  save: {
    height: 45,
    backgroundColor: THEME.brand,
    margin: 12,
    textAlign: 'center',
    borderRadius: 5,
  },
  saveContainer: {
    position: 'absolute',
    top: Dimensions.get('window').height - Dimensions.get('window').height/5,
    height: 40,
    left: 0, 
    width: Dimensions.get('window').width,
  },
  saveText: {
    textAlign: 'center',
    fontWeight: 600,
    color: THEME.white,
    fontSize: 24,
    paddingTop: '2%',
  }
});