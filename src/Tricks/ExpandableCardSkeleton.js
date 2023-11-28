import { StyleSheet, View } from "react-native";
import { THEME } from "../Constants";

export const ExpandableCardSkeleton = () => {
  return (
    <View style={[styles.card, styles.shadowProp]}>
    </View>
  )
}


const styles = StyleSheet.create({
  card: {
    borderRadius: 25,
    overflow: 'hidden',
    top: 40,
    backgroundColor: THEME.whiteMidtone,
    height: 300,
  },
  shadowProp: {
    elevation: 10,
    shadowColor: THEME.black,
  },
});
