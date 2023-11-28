import React, { memo } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { THEME } from '../Constants';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { selectorGetUser } from '../Redux/TapSelector';

/**
 * @param {} edit show edit
 * @param {} editIcon the icon from fontawsome
 * @param {} action action for edit
 */
const IDCard = memo(props => {
  return (
    <View style={styles.identificationCard}>
      {
        props.edit &&
        <View style={{
          position: 'absolute',
          right: '4%',
          top: '4%',
          backgroundColor: THEME.brand,
          borderRadius: 20,
          width: 35,
          height: 35
        }}>
          <TouchableOpacity onPress={props.action} style={{paddingLeft: 7, paddingTop: 5}}>
            <FontAwesome5 solid={true} name={props.editIcon} color={THEME.white} size={20}/>
          </TouchableOpacity>
        </View>
      }
      <Image style={styles.image} source={{uri: 'https://kleja.s3.us-west-1.amazonaws.com/tricks/Sit.png'}} />
      <View style={styles.content}>
        <View style={styles.field}>
          <Text style={styles.label}>Name: </Text>
          <Text style={styles.value}>{props.name}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Gender: </Text>
          <Text style={styles.value}>{props.gender}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Breed: </Text>
          <Text style={styles.value} numberOfLines={1}>{props.breed}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>DOB: </Text>
          <Text style={styles.value}>{props.dateOfBirth}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Weight: </Text>
          <Text style={styles.value}>{props.weight}</Text>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  identificationCard: {
    backgroundColor: THEME.whiteMidtone,
    borderRadius: 10,
    borderWidth: 4,
    borderColor: THEME.whiteMidtone,
    padding: 10,
    width: '80%',
    height: 150,
    flexDirection: 'row',
    alignItems: 'stretch',
    alignSelf: 'center',
    marginTop: '5%',
  },
  image: {
    flex: 1,
    height: undefined,
    width: undefined,
    resizeMode: 'contain',
    borderRadius: 15,
    paddingLeft: 10,
    backgroundColor: THEME.white
  },
  content: {
    flex: 2,
    marginLeft: 10,
    resizeMode: 'contain',
  },
  field: {
    flexDirection: 'row',
    marginBottom: 7,
  },
  label: {
    fontWeight: 'bold',
    color: THEME.black
  },
  value: {
    color: THEME.black
  },
});

export default IDCard;