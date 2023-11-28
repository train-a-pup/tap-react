import { StyleSheet, Text, View, Animated, Easing, Dimensions, Pressable } from 'react-native';
import ExpandableCard from '../DComponents/ExpandableCard';
import { changeActiveCard } from '../Redux/DoggosActions';
import { useSelector, useDispatch } from 'react-redux';
import { getActiveCard, getTrickData } from '../Redux/TapSelector';
import { THEME } from '../Constants';
import Header from '../DComponents/Header';
import { useEffect } from 'react';
import { ExpandableCardSkeleton } from './ExpandableCardSkeleton';
import * as React from 'react';
import Carousel from 'react-native-reanimated-carousel';

export default function CarouselController({navigation}) {
  const dispatch = useDispatch()
  const activeCard = useSelector(state => getActiveCard(state))
  const trickData = useSelector(state => getTrickData(state))
  const width = Dimensions.get('window').width;

  const backLocation = 'Tricks'

  useEffect(() => {
    if(trickData && trickData[0]?.status === 400) {
      navigation.navigate(backLocation)
    }
  }, [trickData])


  return (
    <View style={{flex: 1, backgroundColor: THEME.white}}>
      <Header title={trickData?.trickName} back backLocation={backLocation} navigation={navigation}/>
      <View style={styles.cardContainer}>
        {(trickData.data && trickData.data[0] !== undefined) ?
            <Carousel
              loop={false}
              width={width}
              height={600}
              mode='parallax'
              modeConfig={{
                parallaxScrollingScale: 0.9,
                parallaxScrollingOffset: 110,
              }}
              autoPlay={false}
              data={[...new Array(trickData.data.length).keys()]}
              scrollAnimationDuration={1000}
              onSnapToItem={(index) => console.log('current index:', index)}
              renderItem={({ index, item }) => (
                <Pressable
                  onPress={() => {
                    if(activeCard === trickData.data[index].title) {
                      dispatch(changeActiveCard(""))
                    } else {
                      dispatch(changeActiveCard(trickData.data[index].title))
                    }
                  }}
                >
                  <ExpandableCard item={trickData.data[index]}/>
                </Pressable>
              )}
          /> :
          <Pressable
            onPress={() => {}}
          >
            <Carousel
              loop={false}
              width={width}
              height={600}
              mode='parallax'
              modeConfig={{
                parallaxScrollingScale: 0.9,
                parallaxScrollingOffset: 110,
              }}
              autoPlay={false}
              data={[...new Array(1).keys()]}
              
              scrollAnimationDuration={1000}
              onSnapToItem={(index) => console.log('current index:', index)}
              renderItem={({ index, item }) => (
                <ExpandableCardSkeleton/>
              )}
            />
          </Pressable>
        }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    position: 'relative', /* for iOS */
    marginLeft: 'auto',
    marginRight: 'auto',  }
});