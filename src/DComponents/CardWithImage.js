import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Animated, Easing, Image } from 'react-native';
import { connect } from 'react-redux';
import { Pressable } from 'react-native';
import {Dimensions} from 'react-native';
import { useSelector } from 'react-redux';
import { THEME } from '../Constants';

export default function CardWithImage(props) {
  const image = props.image.replace(/(\r\n|\n|\r)/gm, "")
  return (
    <View style={[styles.card, styles.shadowProp]}>
      <View style={styles.cardTop}>
        <Image style={styles.cardImg} source={{
          uri: image
        }}/>
      </View>
      <View>
        <Text style={[THEME.Typography.header1, styles.cardBottom]}>
            {props.title}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 25,
    overflow: 'hidden',
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 25,
    width: Dimensions.get('window').width / 2.36,
    elevation: 10,
    shadowColor: THEME.black,
    backgroundColor: THEME.white
  },
  cardTop: {
    backgroundColor: THEME.whiteMidtone
  },
  cardImg: {
    display: 'flex',
    height: 150,
    resizeMode: 'contain',
    width: 'auto'
  },
  cardBottom: {
    color: THEME.black,
    backgroundColor: THEME.whiteMidtone,
    paddingTop: 6,
    paddingRight: 16,
    paddingBottom: 16,
    paddingLeft: 16,
    textAlign: 'center',
    fontWeight: '500'
  },
});