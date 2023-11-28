import { SafeAreaView, FlatList, Text, View, Image, StyleSheet, ImageBackground, Dimensions } from "react-native";
import { Pressable } from 'react-native';
import CardWithImage from "./CardWithImage.js";
import { testJSON } from "./test.js";
import Header from "./Header.js";
import { useDispatch, useSelector } from "react-redux";
import { changeActiveTrick, getCardList, getTrick } from "../Redux/DoggosActions.js";
import { THEME } from "../Constants.js";
import { images } from "../TAPConstantStyling/Images.js";
import { useEffect } from "react";
import { getActiveCard, getUserToken, selectorGetCardList } from "../Redux/TapSelector.js";

export default function CardList({navigation}) {

  const dispatch = useDispatch()
  let width = Dimensions.get('window').width
  let height = Dimensions.get('window').height
  let shouldShow = 1

  const cards = useSelector(state => selectorGetCardList(state))
  const userJwt = useSelector(state => getUserToken(state))

  useEffect(() => {
    dispatch(getCardList(userJwt))
    shouldShow = 1
  }, [])


  const renderItem = ({item}) => {
    return (
      <Pressable 
        onPress={()=> {
          dispatch(getTrick(item.trickName.toLowerCase(), userJwt))
          navigation.navigate("Trick")
        }}
      >
        <CardWithImage title={item.trickName} image={item.Image} />
      </Pressable> 
    )  
  }

  const renderCards = () => {
    return (
      <FlatList
        data={cards}
        renderItem={renderItem}
        keyExtractor={item => item.trickName}
        numColumns={2}
        style={{ flex: 1 }}
        contentContainerStyle={{ }}
      />
    )
  }

  return (
    <>
      <Header navigation={navigation} title={'Tricks'}/>
      <SafeAreaView style={{ flex: 1, backgroundColor: THEME.white }}>
        <Image style={{ height: height, width: width, position: 'absolute', top:0, left:0, opacity: 0.07 }} source={{ uri: 'https://kleja.s3.us-west-1.amazonaws.com/black+paws.png' }} />
        {renderCards()}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: THEME.white,
  },
  card: {
    borderRadius: 5,
    height: 250,
    margin: 20,
    marginTop: 10,
    marginBottom: 25,
    width: 320,
    elevation: 10,
    shadowColor: THEME.black,
    backgroundColor: THEME.white
  },
});