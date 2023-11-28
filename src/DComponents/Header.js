import { StyleSheet, Text, View, Animated, Easing, Image, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import { Pressable } from 'react-native';
import { THEME } from '../Constants';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const imageSize = 50
export default function Header({navigation, title, back, backLocation}) {
// between 1 and 2

  const renderBack = () => {
    if(back) {
      return (
        <FontAwesome5 solid={true} onPress={() => navigation.navigate(backLocation)} name='angle-left' color={THEME.brand} size={50} style={{marginLeft: 25, zIndex: 1}}/>
      )
    }

    return
  }

  const renderText = () => {
    if(back) {
      return (
        <View style={styles.textStyle}>
          <Text style={[THEME.Typography.header1, styles.tricksStyle]}>
            {title}
          </Text>
        </View>
      )
    }

    return (
      <Text style={[THEME.Typography.header1, styles.tricksStyle]}>
        {title}
      </Text>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderBack()}
      {renderText()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME.white,
    justifyContent: 'center',
  },
  tricksStyle: {
    paddingRight: 16,
    paddingLeft: 16,
    textAlign: 'center'
  },
  textStyle: {
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    justifyContent: 'center', 
    alignItems: 'center',
    zIndex: 0
  }
});
