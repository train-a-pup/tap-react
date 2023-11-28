import React, {useCallback, useMemo, useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {Agenda, Calendar} from 'react-native-calendars';
import { THEME } from '../Constants.js';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectorGetUser } from '../Redux/TapSelector.js';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { FlatList } from 'react-native-gesture-handler';
import { CalendarView } from './CalendarView.js';
import Animated, { LightSpeedInLeft } from 'react-native-reanimated';
import { LightSpeedOutRight } from 'react-native-reanimated';
import { Layout } from 'react-native-reanimated';


export default function AgendaScreen({navigation}){
  const dispatch = useDispatch()

  const [items, setItems] = useState({})
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0])
  const [renderCalendar, setRenderCalendar] = useState(false)
  const user = useSelector((state) => selectorGetUser(state))


  const RenderCard = (event) => {
    return (
      <View style={styles.InfoContainer}>
        <View style={{flexDirection: 'column'}}>
          <Text style={{color: THEME.black, fontWeight: 400, fontSize: 20}}>{event?.name}</Text>
          <Text style={{color: THEME.black, fontWeight: 300, fontSize: 16}}>{new Date(event?.start).toJSON().slice(0,10)}</Text>
        </View>
      </View>
    )
  }

  const RenderItem = useCallback((reservation, isFirst) => {
    let style = {}
    if(new Date(currentDate).getDate() === new Date(reservation.date).getDate()) {
      style.color = THEME.brand
      style.backgroundColor = THEME.brand
    }

    let text = {}
    if(new Date(currentDate).getDate() === new Date(reservation.date).getDate()) {
      text.color = THEME.white
    }
    return (
      <View style={styles.eventContainer}>
        <View style={[styles.calendarCard, style]}>
          <Text style={[{color: THEME.black, fontWeight: 'bold', fontSize: 20}, text]}>{new Date(reservation?.date).toLocaleString('default', { month: 'short' })}</Text>
          <Text style={[{color: THEME.black, fontWeight: 'bold', fontSize: 25}, text]}>{new Date(reservation?.date).getDate()}</Text>
        </View>
        <FlatList
          data = {reservation.events}
          renderItem={({item}) => RenderCard(item)}
          keyExtractor={item => item.id}
        />
      </View>
    )
  }, [])

  const dateOffset = (intialDate, date) => {
    return Math.ceil(Math.abs(new Date(intialDate) - new Date(date)) / (1000 * 3600 * 24)) > 3
  }

  const itemsCopy = useMemo(() => {
    let copy = []
    
    if(!user || !user.events)
      return copy

    let dateCopy = {}

    let startDate = new Date(currentDate)
    startDate.setDate(startDate.getDate() - 3)
    for (let index = 0; index < 6; index++) {
      const date = new Date(startDate).toISOString().split('T')[0]
      dateCopy[date] = []
      startDate.setDate(startDate.getDate() + 1)
    }

    for(const key in user?.events) {
      let event = user.events[key]
      const date = new Date(event.date).toISOString().split('T')[0]

      if(dateOffset(currentDate, date)) {
        continue
      }

      if(!dateCopy[date]) {
        dateCopy[date] = []
      }
      dateCopy[date].push({
        name: event.title,
        height: Math.max(50, 159),
        start: event.date,
        end: event.date,
        id: key
      })
    }

    Object.keys(dateCopy).forEach((key) => {
      copy.push({
        date: key,
        events: dateCopy[key]
      })
    })

    return copy
  }, [user, currentDate])

  const onClose = (date) => {
    setRenderCalendar(!renderCalendar)
    setCurrentDate(date)
  }
//,{color: THEME.black, fontWeight: 'bold', fontSize: 30, margin: 'auto'}
  return (
    <View style={styles.container}>
      <View style={styles.eventContainer}>
        <FontAwesome5 solid name='stream' size={40} color={THEME.brand} onPress={() => {setRenderCalendar(!renderCalendar)}}/>
      </View>
      <View style={styles.textStyle}>
        <Text style={{color: THEME.black, fontWeight: 'bold', fontSize: 30, margin: 'auto'}}>{new Date(currentDate).toLocaleString('default', { month: 'long' })} {new Date(currentDate).getDate()}</Text>
      </View>
      {renderCalendar && <CalendarView onClose={onClose} currentDate={currentDate}/>}
      <FlatList
        data={itemsCopy}
        renderItem={({item}) => RenderItem(item)}
        keyExtractor={item => item.date}
      />
      <TouchableOpacity onPress={() => {navigation.navigate('New Event')}} style={styles.circleButton}>
        <View style={styles.svgStyle}>
          <FontAwesome5 solid={true} name='plus' size={40} color={THEME.white}/>
        </View>
      </TouchableOpacity>
    </View>
  );
  //inside of Agenda go to renderReservations 
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: THEME.white,
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30,
    backgroundColor: THEME.whiteMidtone,
  },
  container: {
    flex: 1,
    backgroundColor: THEME.white,
    paddingTop: '5%'
  },
  textStyle: {
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    alignItems: 'center',
    zIndex: 0,
    marginTop: 20,
    zIndex: 0
  },
  svgStyle: {
    paddingLeft: 17,
    paddingTop: 13
  },
  circleButton: {
    position: 'absolute',
    bottom: '3%',
    right: '4%',
    width: 70,
    height: 70,
    fontSize: 24,
    color: 'white',
    backgroundColor: THEME.brand,
    borderRadius: 50,
  },
  eventContainer: {
    marginBottom: 20,
    flexDirection: 'row',
    width: '90%',
    marginLeft: 24,
    marginRight: 24,
    zIndex: 1
  },
  calendarCard: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    borderRadius: 7,
  },
  InfoContainer: {
    height: 'auto',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 15,
    backgroundColor: THEME.whiteDark,
    width: '90%',
    padding: 10,
    paddingTop: 0,
    marginBottom: 10,
    marginLeft: 20,
  }
});