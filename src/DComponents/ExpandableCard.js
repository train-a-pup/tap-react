import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Animated, Easing, Image, Dimensions } from 'react-native';
import { connect, useSelector } from 'react-redux';
import { getActiveCard, selectorGetUser } from '../Redux/TapSelector';
import { THEME } from '../Constants';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useRef } from 'react';
import { Video, ResizeMode } from 'expo-av';
import HorizontalLine from './HorizontalLine';

export default function ExpandableCard(props) {
  const [visible, setVisible] = useState(false)
  const activeCard = useSelector(state => getActiveCard(state))
  const user = useSelector((state) => selectorGetUser(state))
  let animation = new Animated.Value(0);
  const [description, setDescription] = useState("Hello")
  const videoRef = useRef(null)
  const intervalTime = 1500

  useEffect(() => {
    setDescription(props?.item?.description?.replaceAll('${DOGS_NAME}', user?.name))
  }, [props.item.description, user])

  useEffect(() => {
    Animated.timing(animation, {
      toValue: visible ? 138 : 0,
      duration: 1000,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true
    }).start()
  }, [visible])

  useEffect(() => {
    if(activeCard === props?.item?.title) {
      setVisible(!visible)
    } else {
      setVisible(false)
    }
  }, [activeCard])

  useEffect(() => {

    const intervalId = setInterval(async () => {
      if(videoRef.current) {
        await videoRef.current.replayAsync()
      }
    }, intervalTime)

    return () => {
      clearInterval(intervalId)
    }
  }, [])

  const spin = animation.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg']
  })

  const animatedStyle = {
    transform: [
      {
        rotate: spin
      }
    ]
  }

  const renderMedia = () => {
    if(props?.item?.image) {
      if(props?.item?.image.includes('mp4')) {
        return (
          <Video
            ref={videoRef}
            style={styles.video}
            source={{
              uri: props?.item?.image,
            }}
            isMuted
            resizeMode="cover"
            shouldPlay={false}
            onLoad={() => {videoRef?.current?.playAsync()}}
          />
        )
      } else {
        return (
          <Image style={styles.cardImg} source={
            {uri: props?.item?.image}
          }/>
        )
      }
    }
    return (
      <Image style={styles.cardImg} source={
        {uri: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/324479/yeti.png'}
      }/>
    )
  }

  return (
    <View style={[styles.card, styles.shadowProp]}>
      <View style={styles.cardTop}>
        {renderMedia()}
      </View>
      <View style={[styles.triangle]}>
        <View style={styles.circleButton}>
          <Animated.View style={animatedStyle}>
            <FontAwesome5 solid={true} name='plus' size={60} style={styles.plusIcon}/>
          </Animated.View>
        </View>
      </View>
      <HorizontalLine width={2} color={THEME.whiteDark} pageWidth={'100%'}/>
      {visible && 
        <View style={styles.cardMiddle}>
          <Text>
            {description}
          </Text>
        </View>
      }
      <View>
        <Text style={styles.cardBottom}>
          {props?.item?.title?.charAt(0).toUpperCase() + props?.item?.title?.slice(1)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  video: {
    height: 0.7 * Dimensions.get('window').width,
    width: 0.7 * Dimensions.get('window').width,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  card: {
    borderRadius: 25,
    overflow: 'hidden',
    width: 0.8 * Dimensions.get('window').width,
    marginLeft: 'auto',
    marginRight: 'auto',
    top: 60
  },
  cardTop: {
    backgroundColor: THEME.whiteMidtone,
    paddingBottom: 48,
    paddingTop: 0
  },
  cardImg: {
    display: 'flex',
    height: 0.7 * Dimensions.get('window').width,
    resizeMode: 'contain',
    width: 'auto'
  },
  triangle: {
    marginTop: 0,
    marginRight: 'auto',
    marginBottom: -35,
    marginLeft: 'auto',
    zIndex: 20,
    elevation: 20,
    shadowColor: THEME.black,
  },
  circleButton: {
    position: 'absolute',
    bottom: 0,
    right: 70,
    width: 70,
    height: 70,
    fontSize: 24,
    backgroundColor: THEME.brand,
    borderRadius: 50,
  },
  plusIcon: {
    width: 70,
    height: 70,
    paddingLeft: 8,
    paddingTop: 3,
    color: THEME.white,
    borderRadius: 50,
  },
  cardMiddle: {
    backgroundColor: THEME.whiteDark,
    paddingTop: 38,
    paddingRight: 16,
    paddingBottom: 16,
    paddingLeft: 16
  },
  cardBottom: {
    backgroundColor: THEME.whiteMidtone,
    paddingTop: 16,
    paddingRight: 16,
    paddingBottom: 16,
    paddingLeft: 16,
    textAlign: 'center',
    fontSize: 40,
    fontWeight: '200'
  },
  shadowProp: {
    elevation: 10,
    shadowColor: THEME.black,
  },
});
