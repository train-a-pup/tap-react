import { Dimensions, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { selectorgetSnackbar } from "../Redux/TapSelector";
import { THEME } from "../Constants";
import { useEffect } from "react";
import { useState } from "react";

export default function Snackbar() {

  const snackbarData = useSelector(state => selectorgetSnackbar(state))

  const [showSnackbar, setShowSnackbar] = useState(true)

  useEffect(() => {
    setShowSnackbar(snackbarData.open)
    setTimeout(function() {
      setShowSnackbar(false)
    }, 2000)
  }, [snackbarData])

  return (
    <View style={styles.container}>
      {
        showSnackbar && 
        <View style={[styles.snackbarStyling, {backgroundColor: snackbarData.isError ? THEME.brand : THEME.success}]}>
          <Text style={{color: THEME.black, fontSize: 20}}>{snackbarData.message}</Text>
        </View>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  snackbarStyling: {
    width: Dimensions.get('window').width / 1.2,
    borderRadius: 2,
    zIndex: 1,
    textAlign: "center"
  },
  container: {
    position: "absolute", left: 0, right: 0, alignItems: "center",
    bottom: 30,
  }
});