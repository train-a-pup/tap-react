import React from 'react';
import { StyleSheet, View } from 'react-native';

const HorizontalLine = ({ color, width, pageWidth }) => {

  return (
    <View style={{alignItems: 'center', display: 'flex', justifyContent: 'center', width: '100%'}}>
      <View style={{width: pageWidth ? pageWidth : '90%'}}>
        <View
          style={{
            borderBottomColor: color,
            borderBottomWidth: width ? width : StyleSheet.hairlineWidth,
          }}
        />
      </View>
    </View>
  );
}


export default HorizontalLine;
