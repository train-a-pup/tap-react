import { faCancel, faCheck } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { useState } from "react"
import { THEME } from "../Constants"
import { StyleSheet } from "react-native"
import { TextInput } from "react-native"
import { View } from "react-native"
import { Text } from "react-native"
import { TouchableOpacity } from "react-native"

/**
 * 
 * @param {*} props 
 * title
 * onSubmit
 * editObject override text input for some other form of input
 * @returns element that when click will become editable
 */
export default function InlineEdit(props) {

  const [edit, setEdit] = useState(false)
  const [title, setTitle] = useState(props.title)

  const onTouchablePress = () => {
    setEdit(!edit)
  }

  const renderElement = () => {
    if(edit) {
      return (
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.inputText, styles.input]}
            placeholder={title}
          />
          <TouchableOpacity style={[styles.input, styles.buttonIcons]} onPress={onTouchablePress}>
            <FontAwesomeIcon icon={faCancel}/>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.input, styles.buttonIcons, styles.check]} onPress={onTouchablePress}>
            <FontAwesomeIcon icon={faCheck}/>
          </TouchableOpacity>
        </View>
      )
    } else {
      return (
        <TouchableOpacity onPress={onTouchablePress}>
          <Text style={styles.inputText}>{props.title}</Text>
        </TouchableOpacity>
      )
    }
  }

  return renderElement()
}
const styles = StyleSheet.create({
  inputContainer: {
    margin: 12,
    flexDirection: 'row'
  },
  input: {
    height: 40,
    padding: 10,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    backgroundColor: THEME.whiteMidtone,
    alignContent: 'center',
    textAlign: 'center',
    outlineStyle: 'none'
  },
  inputText: {
    fontSize: 28,
    color: '#696969',
    fontWeight: '600',
  },
  buttonIcons: {
    marginTop: 5,
    position: 'absolute',
    right: 0,
  },
  check: {
    marginRight: 40,
    zIndex: 5
  }
})