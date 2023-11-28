import { StyleSheet, Text, View, Animated, Easing, Image, Linking } from 'react-native';
import {Dimensions} from 'react-native';
import { THEME } from '../Constants';
import HorizontalLine from '../DComponents/HorizontalLine';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { selectorGetUser } from '../Redux/TapSelector';

export default function AmazonCard(props) {
  const user = useSelector(state => selectorGetUser(state))
  return (
    <View style={{flexDirection: 'column'}} key={props.name}>
      <View style={{flexDirection:"row", width: '100%', paddingBottom: 30, padding: 15}}>
        <View style={{borderRadius: 25, width: 150}}>
          <Image style={styles.cardImg} source={{
            uri: props?.image ? props.image : 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/324479/yeti.png'
          }}/>
        </View>
        <View style={styles.columnInformation}>
          <View style={{flexDirection:"row", paddingBottom: 4}}>  
            <View>
              <Text style={{color: THEME.black, fontWeight: 500}}>{props.title}</Text>
            </View>
          </View>
          <View style={{width: 20, paddingBottom: 4}}>
            <HorizontalLine width={2} color={THEME.whiteDark}/>
          </View>
          <View style={{ justifyContent: 'space-between', flex: 1, flexDirection: 'row'}}>
            <Text style={{ lineWeight: 1.6, flexShrink: 1, fontWeight: 250, color: THEME.black}}>{props.description.replaceAll('${DOGS_NAME}', user?.name).replaceAll('${PRONOUN}', user?.name)}</Text>
          </View>
          {
            props.link &&
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.amazonButton} onPress={() => {Linking.openURL(props.link)}}>
                <Text style={{color: THEME.white, fontSize: 12}}>View On Amazon</Text>
              </TouchableOpacity>
            </View>
          }
        </View>
      </View>
      <HorizontalLine color={THEME.whiteDark} width={2}/>
    </View>
  );
}

const styles = StyleSheet.create({
  columnInformation: {
    flexDirection: "column",
    width: Dimensions.get('window').width - 180,
    paddingLeft: 15,
  },
  buttonContainer: {
    position: 'absolute',
    left: 15,
    top: '80%',
    bottom: '0%',
    borderRadius: 1,
    alignItems: "center"
  },
  amazonButton: {
    backgroundColor: THEME.brand,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  cardTop: {
    backgroundColor: THEME.white
  },
  cardImg: {
    height: 150,
    width: 150,
    backgroundColor: THEME.brand,
    resizeMode: 'contain',
    borderRadius: 25,
  },
  cardBottom: {
    color: THEME.black,
    backgroundColor: THEME.white,
    paddingTop: 6,
    paddingRight: 16,
    paddingBottom: 16,
    paddingLeft: 16,
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '400'
  },
});