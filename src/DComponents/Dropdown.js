import React, { FC, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { THEME } from '../Constants';
import HorizontalLine from './HorizontalLine';


const Dropdown = ({ label, options, onChange, backgroundColor, showIcon, textStyle, defaultValue }) => {
  const [visible, setVisible] = useState(false);

  const [textLabel, setTextLabel] = useState(label)

  const toggleDropdown = () => {
    setVisible(!visible);
  };

  useEffect(() => {
    if(defaultValue) {
      setTextLabel(defaultValue)
    }
  }, [])

  const optionClick = (option) => {
    if(onChange) {
      onChange(option)
    }
    setTextLabel(option)
    setVisible(false)
  }

  const renderDropdown = () => {
    if (visible) {
      return (
        <View style={styles.dropdown}>
          {options.map((option) => {
            return (
              <View style={{paddingTop: 10, paddingBottom: 10}} key={option}>
                <Pressable onPress={() => {optionClick(option)}}>
                  <Text style={styles.dropdownElement}>
                    {option}
                  </Text>
                  <HorizontalLine color={THEME.black}/>
                </Pressable>
              </View>
            )
          })}
        </View>
      );
    }
  };

  return (
    <TouchableOpacity
      style={[{backgroundColor: backgroundColor ? backgroundColor : THEME.white}, styles.button]}
      onPress={toggleDropdown}
    >
      {renderDropdown()}
      <Text style={[textStyle, styles.buttonText]}>{textLabel}</Text>
      {
        showIcon && 
        <Icon type='font-awesome' name='chevron-down' style={{paddingRight: 20}}/>
      }
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 45,
    width: '100%',
    zIndex: 1,
    borderRadius: 5,
  },
  buttonText: {
    flex: 1,
    // textAlign: 'center',
  },
  dropdown: {
    position: 'absolute',
    backgroundColor: THEME.whiteMidtone,
    width: '100%',
    top: 40,
    borderRadius: 5
  },
  dropdownElement: {
    textAlign: 'center',
    paddingRight: 40
  }
});

export default Dropdown;