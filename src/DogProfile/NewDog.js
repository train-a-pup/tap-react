import React, {useState, useEffect} from 'react';
import {SafeAreaView, StyleSheet, Text, View, TextInput, Platform, Image, KeyboardAvoidingView, Alert} from 'react-native';
import SearchableDropdown from 'react-native-searchable-dropdown';
import { dogList } from './DogsList';
import { ScrollView } from 'react-native';
import { THEME, aws_tap_api } from '../Constants';
import { createElement } from 'react';
import HorizontalLine from '../DComponents/HorizontalLine';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Dropdown from '../DComponents/Dropdown';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {TextInputValidation} from '../DComponents/TextInputValidation';
import IDCard from './IDCard';
import { useDispatch, useSelector } from 'react-redux';
import { getUserToken, selectorGetUser } from '../Redux/TapSelector';
import { BackHandler } from 'react-native';
import { getUser, setSnackBarActive } from '../Redux/DoggosActions';
import Header from '../DComponents/Header';
import { apiRemoveUser } from '../Redux/API';
import { logout } from '../Navigation/Login';

const NewDog = ({navigation}) => {

  const iconSize = 30
  const dispatch = useDispatch()

  const [dog, setDog] = useState({
    "weight": "35 - 65",
    "height": "18 - 23",
    "id": 23,
    "name": "Australian Shepherd",
    "country_code": "AU",
    "bred_for": "Sheep herding",
    "life_span": "12 - 16 years",
    "temperament": "Good-natured, Affectionate, Intelligent, Active, Protective"
  })
  const [birthday, setBirthday] = useState("")
  const [dobValid, setDobValid] = useState(false)
  const [gender, setGender] = useState(null)
  const [name, setName] = useState(null)
  const [weight, setWeight] = useState(0)
  const editUser = useSelector((state) => selectorGetUser(state))
  const userJwt = useSelector((state) => getUserToken(state))
  const [saveButtonEnabled, setSaveButtonEnabled] = useState(true)

  // check for edit profile
  useEffect(() => {
    if(editUser) {
      setBirthday(editUser.dob)
      setGender(editUser.gender)
      setName(editUser.name)
      setWeight(editUser.weight)
      dogList.forEach((dogObject) => {
        if(dogObject.name === editUser.breed) {
          setDog(dogObject)
          return
        }
      })
    }
  }, [editUser])

  const handleBackButtonClick = () => {
    if(editUser) {

      navigation.navigate('DogProfile');
    }
    return true;
  }
  
  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackButtonClick);
    };
  }, []);

  function handleValidation(value) {
    const { pattern } = '[0-9]{2}-[0-9]{2}-[0-9]{4}';
    if (!pattern) return true;
    // string pattern, one validation rule
    if (typeof pattern === 'string') {
      const condition = new RegExp(pattern, 'g');
      return condition.test(value);
    }
    // array patterns, multiple validation rules
    if (typeof pattern === 'object') {
      const conditions = pattern.map(rule => new RegExp(rule, 'g'));
      return conditions.map(condition => condition.test(value));
    }
  }

  const handleSubmit = () => {
    let valid = handleValidation(birthday)
    if((!dobValid && !valid) || !dog || !gender || !name || !weight) {
      dispatch(setSnackBarActive('Must Complete Form', true, true))
      return
    }
    let r = 'error'
    if (!userJwt) {
      return
    }
    console.log({
      token: userJwt,
      name: name,
      gender: gender,
      dob: birthday,
      breed: dog.name,
      weight: weight
    })
    fetch(aws_tap_api, {
      method: "POST",
      body: JSON.stringify({
        token: userJwt,
        name: name,
        gender: gender,
        dob: birthday,
        breed: dog.name,
        weight: weight
      })
    }).then((res) => {
      if(res.status && res.status === 502) {
        return
      }
      dispatch(getUser(userJwt))
      navigation.navigate('DogProfile')
    }).catch((e) => {
      console.log('error creating dog', JSON.stringify(e))
    })
  }

  const datePickerChange = (value, isValid) => {
    let newVal
    if(value.length > 2 && value.length < 5 && value.split('-').length !== 2) {
      newVal = value.substring(0, 2) + "-" + value.substring(2)
    }
    if(value.length > 5 && value.split('-').length !== 3) {
      newVal = value.substring(0, 5) + "-" + value.substring(5)
    }
    if (value.length == 2 && value.length > birthday.length) {
      newVal = value + '-'
    } else if (value.length == 5 && value.length > birthday.length) {
      newVal = value + '-'
    }
    if (newVal) {
      setBirthday(newVal)
    } else {
      setBirthday(value)
    }
    setDobValid(isValid)
  }

  const removeAccount = () => {
    if(!userJwt)
      return
    apiRemoveUser(userJwt).then((res) => {
      logout(userJwt)
      if(res.status === 502) {
        dispatch(setSnackBarActive('Could Not Delete Account, Please try again later', true, true))
        return
      }
      AsyncStorage.clear()
      navigation.navigate('Login')
    }).catch((e) => {
      console.log('error removing user', JSON.stringify(e))
      dispatch(setSnackBarActive('Could Not Delete Account, Please try again later', true, true))
    })
  }

  const removeAlert = () => {
    Alert.alert('Are you sure you want to remove your account?', '', [
      {
        text: 'Cancel',
        onPress: () => console.log('cancel pressed'),
        style: 'cancel'
      }, 
      {
        text: 'Remove',
        onPress: removeAccount
      }
    ])
  }

  return (
    // add image and gender
    <View style={styles.container}>
      {editUser ? <Header title={'Edit'} navigation={navigation} back backLocation={'DogProfile'}/> : <Header title={'New'}/>}
      {
        editUser ? 
        <IDCard
          name={name}
          dateOfBirth={birthday}
          breed={dog.name}
          gender={gender}
          weight={weight}
          edit
          editIcon = {'trash'}
          action={removeAlert}
        />
        :
        <IDCard
          name={name}
          dateOfBirth={birthday}
          breed={dog.name}
          gender={gender}
          weight={weight}
        />
      }
      <View style={styles.body}>
        <View style={styles.breedContainer}>
          <FontAwesome5 style={{paddingTop: 10, paddingRight: 9}} solid={true} name='address-card' size={iconSize-5} color={THEME.black}/>
          <ScrollView keyboardShouldPersistTaps='always' style={styles.dropdownSlector}>
            <SearchableDropdown
              onItemSelect={(item) => setDog(item)}
              containerStyle={{color: THEME.black}}
              onTextChange = {() => {}}
              textInputStyle={{
                height: 50,
                color: THEME.black,
                borderRadius: 5,
                backgroundColor: THEME.white,
                fontSize: 28,
                fontWeight: '600',
                margin: 'auto',
                width: '100%',
              }}
              itemStyle={{
                padding: 10,
                marginTop: 2,
                borderRadius: 2,
                backgroundColor: THEME.whiteMidtone,
                color: THEME.black
              }}
              itemTextStyle={{
                color: THEME.black
              }}
              items={dogList}
              defaultIndex={0}
              placeholder={dog.name}
              resPtValue={false}
              underlineColorAndroid="transparent"
            />
          </ScrollView>
        </View>
        <HorizontalLine color={THEME.black} width={1} pageWidth={'100%'}/>
        <View style={styles.inputContainer}>
          <FontAwesome5 style={{paddingTop: 10}} solid={true} name='signature' size={iconSize - 9} color={THEME.black}/>
          <TextInput
            style={styles.input}
            defaultValue={name}
            placeholder='Pups Name'
            onChangeText={(text)=>setName(text)}
          />
        </View>
        <HorizontalLine color={THEME.black} width={1} pageWidth={'100%'}/>
        <View style={styles.inputContainer}>
          <FontAwesome5 style={{paddingTop: 10}} solid={true} name='birthday-cake' size={iconSize} color={THEME.black}/>
          <TextInputValidation
            placeholder="MM-DD-YYYY"
            style={styles.input}
            onChangeText={datePickerChange}
            dateTime={birthday}
            pattern={[
              '[0-9]{2}-[0-9]{2}-[0-9]{4}'
            ]}
          />
        </View>
        <HorizontalLine color={THEME.black} width={1} pageWidth={'100%'}/>
        <View style={styles.inputContainer}>
          <FontAwesome5 style={{paddingTop: 10}} solid={true} name='weight' size={iconSize} color={THEME.black}/>
          <TextInput
            keyboardType='numeric'
            placeholder="Weight"
            defaultValue={weight}
            style={styles.input}
            onChangeText={(value) => setWeight(value)}
          />
        </View>
        <HorizontalLine color={THEME.black} width={1} pageWidth={'100%'}/>
        <View style={[styles.inputContainer, {paddingBottom: 50}]}>
          <FontAwesome5 style={{paddingTop: 10}} solid={true} name='dog' size={iconSize} color={THEME.black}/>
          <View style={{width: '100%'}}>
            <Dropdown onChange={(value) => setGender(value)} options={['Male', 'Female']} defaultValue={gender} label={'Gender'} backgroundColor={THEME.white} textStyle={styles.dropdownText}/>
          </View>
        </View>
        <View style={{padding: 12}}>
          <TouchableOpacity style={styles.buttonContainer} onPress={handleSubmit}>
            <Text style={{color: THEME.black, fontWeight: 600}}>SAVE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default NewDog;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    backgroundColor: THEME.white,
  },
  body: {
    flex: 1,
    paddingTop: 20,
    marginLeft: 20,
    marginRight: 20
  },
  dropdownSlector: {
    width: '100%'
  },
  input: {
    height: 40,
    borderRadius: 5,
    backgroundColor: THEME.white,
    fontSize: 22,
    color: THEME.black,
    fontWeight: '600',
    paddingLeft: 10,
    outlineStyle: 'none'
  },
  dropdownText: {
    paddingLeft: 10,
    backgroundColor: THEME.white,
    fontSize: 28,
    color: THEME.black,
    fontWeight: '600',
  },
  inputContainer: {
    margin: 12,
    flexDirection: 'row',
  },
  breedContainer: {
    margin: 12,
    flexDirection: 'row',
  },
  buttonContainer: {
    marginTop: 10,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    width: 250,
    borderRadius: 15,
    color: THEME.white,
    backgroundColor: THEME.brand,
    width: '100%',
  },
});