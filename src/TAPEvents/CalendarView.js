import { Calendar } from 'react-native-calendars';
import { View } from 'react-native';
import React, { useEffect } from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { THEME } from '../Constants';
import { useMemo } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectorGetUser } from '../Redux/TapSelector';

export const CalendarView = ({onClose, currentDate}) => {
  const user = useSelector((state) => selectorGetUser(state))
  const [selectedDay, setSelectedDay] = useState({})
  const [selectedMonth, setSelectedMonth] = useState({})

  const updatedEventsPretty = useMemo(() => {
    let eventsPretty = {}
    Object.keys(user.events).forEach(key => {
      let event = user.events[key]
      let eventDate = new Date(event.date)
      let year = eventDate.getFullYear()
      let month = eventDate.getMonth()
      let formattedDate = new Date(eventDate).toISOString().split('T')[0]
      if(!eventsPretty[year]) {
        eventsPretty[year] = {}
      }
      if(!eventsPretty[year][month]) {
        eventsPretty[year][month] = {}
      }
      if(!eventsPretty[year][month][formattedDate])
        eventsPretty[year][month][formattedDate] = {marked: true}
    });
    return eventsPretty
  }, [user])
  
  useEffect(() => {
    let dayObj = {}
    dayObj[new Date(currentDate).toISOString().split('T')[0]] = {
      selected: true, selectedColor: THEME.brand
    }
    setSelectedMonth(updatedEventsPretty[new Date().getFullYear()][new Date().getMonth()])
    setSelectedDay(dayObj)
  }, [])

  const changeSelectedDay = (day) => {
    let dayObj = {}
    let date = new Date(day.dateString)
    dayObj[date.toISOString().split('T')[0]] = {
      selected: true, selectedColor: THEME.brand
    }
    setSelectedDay(dayObj)
    date = date.setDate(date.getDate() + 1)
    onClose(date)
  }

  const changeSelectedMonth = (month) => {
    setSelectedMonth(updatedEventsPretty[new Date().getFullYear()][new Date(month.dateString).getMonth()])
  }

  return (
      <View style={{flex: 1, zIndex: 2 }}>
        <Calendar
          markedDates={{
            ...selectedMonth, ...selectedDay
          }}
          // Handler which gets executed on day press. Default = undefined
          onDayPress={day => {
            changeSelectedDay(day)
          }}
          // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
          // monthFormat={'yyyy MM'}
          // Handler which gets executed when visible month changes in calendar. Default = undefined
          onMonthChange={month => {
            changeSelectedMonth(month)
          }}
          // Hide month navigation arrows. Default = false
          hideArrows={false}
          // Do not show days of other months in month page. Default = false
          hideExtraDays={true}
          // If hideArrows=false and hideExtraDays=false do not swich month when tapping on greyed out
          // day from another month that is visible in calendar page. Default = false
          disableMonthChange={true}
          // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
          firstDay={1}
          renderArrow={(direction) => direction === 'left' ? 
            <FontAwesome5 solid name='angle-left' size={40} color={THEME.brand}/> : 
            <FontAwesome5 solid name='angle-right' size={40} color={THEME.brand}/>
          }
        />
      </View>
  );
}
