import { SafeAreaView, FlatList, Text, View, Image, StyleSheet, ScrollView } from "react-native";
import { Pressable } from 'react-native';
import Header from "../DComponents/Header";
import { THEME, AmazonLinks } from "../Constants.js";
import AmazonCard from "./AmazonCard";
import { useState } from "react";
import { DogSkeleton } from "./DogSkeleton";

export default function Amazon({navigation}) {
  
  const [loading, setLoading] = useState(false)


  const renderItem = ({item}) => (
    <AmazonCard title={item.name} link={item.link} description={item.description} image={item.image} price={"item.price"}></AmazonCard>
  )

  const displayLoading = () => {
    if (loading) {
      return (<DogSkeleton/>)
    }
    return (
        <ScrollView  style={[{ flex: 1 }, styles.cardContainer]}>

          <FlatList
            data={AmazonLinks}
            renderItem={renderItem}
            keyExtractor={item => item.name}
            numColumns={1}
          />
          <View style={{margin: 20, marginTop: 5}}>
            <Text>
              Train A Pup: Easy Dog Training is also a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites and apps to earn advertising fees by advertising and linking to Amazon.com.
            </Text>
          </View>
        </ScrollView>
    );
  }

  return (
    <>
      <Header navigation={navigation} title={'New Pup Needs'}/>
      {displayLoading()}
    </>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: THEME.white,
  },
});

// In the future this will be usefull
// https://affiliate-program.amazon.com/assoc_credentials/home