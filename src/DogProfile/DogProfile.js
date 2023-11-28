import React, { useCallback, useEffect, useMemo } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, Pressable, SafeAreaView, FlatList, Dimensions, BackHandler } from 'react-native'
import { THEME } from '../Constants'
import { useState } from 'react'
import IDCard from './IDCard'
import { useDispatch, useSelector } from 'react-redux'
import { getUserToken, selectorGetUser } from '../Redux/TapSelector'
import { getUser } from '../Redux/DoggosActions'
import { images } from '../TAPConstantStyling/Images'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export default function DogProfile({navigation}) {
  const iconSize = 30

  const dispatch = useDispatch()
  const userJwt = useSelector((state) => getUserToken(state))
  const userData = useSelector((state) => selectorGetUser(state))
  const [user, setUser] = useState({})
  const [emptyEvents, setEmptyEvents] = useState(false)
  let width = Dimensions.get('window').width
  let height = Dimensions.get('window').height
  useEffect(() => {
    dispatch(getUser(userJwt))
  }, [userJwt])

  useEffect(() => {
    if (userData) {
      setUser(userData)
      if(userData?.events) {
        setEmptyEvents(Object.keys(userData?.events)?.length < 3)
      }
    } else {
      navigation.navigate('NewDog')
    }
  }, [userData])

  const allEvents = useMemo(() => {
    if(user?.events) {
      return Object.keys(user?.events)
    }
    return []
  }, [user?.events])

  const renderItem = useCallback(() => {
    let array = [{},{}, {}]
    let allEvents

    if(user?.events) {
      allEvents = Object.keys(user?.events)
    }
    return array.map((element, index) => {
      let event
      if(user.events) {
        event = user?.events[allEvents[index]]
      }
      if(!event) 
        return (
          <View key={`${index}`} style={{alignItems: "center", width: '100%'}}>
            <View style={styles.emptyEventContainer}>
            </View>
          </View>
        )
      return (
        <View key={`${index}`} style={{alignItems: "center", width: '100%'}}>
          <View style={styles.eventContainer}>
            <View style={styles.calendarCard}>
              <Text style={{color: THEME.black, fontWeight: 600, fontSize: 20}}>{new Date(event.date).toLocaleString('default', { month: 'short' })}</Text>
              <Text style={{color: THEME.black, fontWeight: 500, fontSize: 18}}>{new Date(event.date).getDate()}</Text>
            </View>
            <View style={{flexDirection: 'column'}}>
              <Text style={{color: THEME.black, fontWeight: 400, fontSize: 20}}>{event.title}</Text>
              <Text style={{color: THEME.black, fontWeight: 300, fontSize: 16}}>{new Date(event.date).toJSON().slice(0,10)}</Text>
            </View>
          </View>
        </View>
      )
    })
  })

  const editProfile = () => {
    navigation.navigate('NewDog')
  }

  return (

    <View style={styles.container}>
      <Image style={{ height: height, width: width, position: 'absolute', top:0, left:0, opacity: 0.07 }} source={{ uri: 'https://kleja.s3.us-west-1.amazonaws.com/black+paws.png' }} />
        <View>
          <IDCard
            name={user?.name}
            dateOfBirth={user?.dob}
            breed={user?.breed}
            gender={user?.gender}
            weight={user?.weight}
            edit={true}
            action={editProfile}
            editIcon = {'edit'}
            />
          <View style={{paddingTop: 25}}>
            <Text style={styles.name}>Upcoming Events</Text>
          </View>
        </View>
        <View style={{paddingTop: 20}}>
          {renderItem()}
        </View>
        {
          emptyEvents &&
          <View style={{backgroundColor: THEME.brand, alignItems: 'center', position: 'absolute', borderRadius: 50, bottom: '5%', right: 30, width: 60, height: 60}}>
            <FontAwesome5 onPress={() => navigation.navigate('New Event')} solid={true} name='calendar-plus' color={THEME.white} size={35} style={{paddingTop: 10}}/>
          </View>
        }
    </View>
  )
}

const styles = StyleSheet.create({
  name: {
    fontSize: 28,
    color: THEME.black,
    fontWeight: '600',
    alignSelf: 'center'
  },
  addEvent: {

  },
  backgroundImage: images.backgroundImage,
  emptyEventContainer: {
    height: 100,
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.25)',
    width: '90%',
    marginLeft: 24,
    marginRight: 24,
  },
  eventContainer: {
    height: 100,
    alignItems: 'center',
    marginBottom: 20,
    flexDirection: 'row',
    borderRadius: 15,
    backgroundColor: THEME.whiteMidtone,
    width: '90%',
    marginLeft: 24,
    marginRight: 24,
  },
  calendarCard: {
    backgroundColor: THEME.white,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    borderRadius: 7,
    marginRight: 10,
    marginLeft: 20,
  },
  calendarContainer: {
    width: '10%',
    paddingLeft: 10,
  },
  container: {
    backgroundColor: THEME.white,
    height: '100%'
  }
})