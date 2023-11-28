import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Button, Platform, Dimensions, TouchableOpacity, Pressable, Linking } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AuthSession from 'expo-auth-session';
import { useDispatch } from 'react-redux';
import { getUser, setUserToken } from '../Redux/DoggosActions';
import { THEME } from '../Constants';


export default function Login({navigation}) {
  const dispatch = useDispatch()
  const height = Dimensions.get('window').height
  const width = Dimensions.get('window').width

  const [userInfo, setUserInfo] = useState();
  const [auth, setAuth] = useState();
  const [requireRefresh, setRequireRefresh] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "ANDROID_ID",
    iosClientId: "IOS_ID",
    expoClientId: "WEB_ID", // should be the web-client-id
  });
  
  useEffect(() => {
    if (response?.type === "success") {
      setAuth(response.authentication);

      const persistAuth = async () => {
        await AsyncStorage.setItem("auth", JSON.stringify(response.authentication));
      };
      persistAuth();
    }
  }, [response]);

  useEffect(() => {
    const getPersistedAuth = async () => {
      const jsonValue = await AsyncStorage.getItem("auth");
      if (jsonValue != null) {
        const authFromJson = JSON.parse(jsonValue);
        setAuth(authFromJson);

        setRequireRefresh(!AuthSession.TokenResponse.isTokenFresh({
          expiresIn: authFromJson.expiresIn,
          issuedAt: authFromJson.issuedAt
        }));
      }
    };
    getPersistedAuth();
  }, []);

  const getUserData = async () => {
    let userInfoResponse = await fetch("https://www.googleapis.com/userinfo/v2/me", {
      headers: { Authorization: `Bearer ${auth.accessToken}` }
    });

    userInfoResponse.json().then(data => {
      setUserInfo(data);
      dispatch(setUserToken(auth.accessToken))
      dispatch(getUser(auth.accessToken))
      navigation.navigate('Home')
    });
  };

  const showUserData = () => {
    if (userInfo) {
      return (
        <View style={styles.userInfo}>
          <Image source={{ uri: userInfo.picture }} style={styles.profilePic} />
          <Text>Welcome {userInfo.name}</Text>
          <Text>{userInfo.email}</Text>
        </View>
      );
    }
  };
  const getClientId = () => {
    if (Platform.OS === "ios") {
      return "IOS_ID"
    } else if (Platform.OS === "android") {
      return "ANDROID_ID"
    } else {
      console.log('not supported')
    }
  }

  const refreshToken = async () => {
    const clientId = getClientId();
    const tokenResult = await AuthSession.refreshAsync({
      clientId: clientId,
      refreshToken: auth.refreshToken
    }, {
      tokenEndpoint: "https://www.googleapis.com/oauth2/v4/token"
    });

    tokenResult.refreshToken = auth.refreshToken;

    setAuth(tokenResult);
    await AsyncStorage.setItem("auth", JSON.stringify(tokenResult));
    setRequireRefresh(false);
  };

  if (requireRefresh) {
    AsyncStorage.removeItem("auth").then(() => {
      setAuth()
      setUserInfo()
    })
  }


  useEffect(() => {
    if(auth) {
      getUserData()
    }
  }, [auth])


  return (
    <View style={styles.container}>
      <Image style={{ height: height, width: width, position: 'absolute', top:0, left:0, opacity: 0.07 }} source={{ uri: 'https://kleja.s3.us-west-1.amazonaws.com/black+paws.png' }} />
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => {
          try {
            promptAsync({useProxy: false, showInRecents: true})
          } catch (error) {
            console.log('error logging in ', error)
          }
        }}
      >
        <Text style={[THEME.Typography.header2, styles.loginText]}>Login with Google</Text>
      </TouchableOpacity>
      <Text style={{bottom: 0, position: 'absolute', margin: 35}}>By logging in / signing up, you agree to our 
        <Pressable onPress={()=>Linking.openURL('https://kleja.s3.us-west-1.amazonaws.com/privacy/Privacy+Policy.pdf')}><Text style={{color: THEME.brand}}> Privacy Policy</Text></Pressable> and
        <Pressable onPress={()=>Linking.openURL('https://kleja.s3.us-west-1.amazonaws.com/privacy/Terms+Of+Service.pdf')}><Text style={{color: THEME.brand}}>Terms</Text></Pressable>  
      </Text>
      <StatusBar style="auto" />
    </View>
  )
}


export const logout = async (token) => {
  await AuthSession.revokeAsync({
    token: token
  }, {
    revocationEndpoint: "https://oauth2.googleapis.com/revoke"
  });

  await AsyncStorage.removeItem("auth");
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.white,
    alignItems: "center",
    justifyContent: "center",
  },
  loginButton:{
    marginRight: 40,
    marginLeft: 40,
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: THEME.brand,
    borderRadius: 10,
  },
  loginText:{
    color: THEME.white,
    textAlign: 'center',
    fontWeight: 'bold',
    paddingLeft: 10,
    paddingRight: 10
  }
});