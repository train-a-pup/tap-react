import { aws_api, aws_api_trick, aws_tap_api } from "../Constants"
import { isTesting } from "./ApiTesting"

export const apiGetTrick = (trickName, userJwt) => {
  if(isTesting.getTrick.testing) {
    return new Promise((resolve, reject) => {
      resolve(isTesting.getTrick.response.Items[0].trickData)
    });
  }
  return fetch(`${aws_api}/trick?trickName=${trickName}`, {
    headers: {
      Authorization: userJwt
    }
  }).then(res => res.json()).then(res => {
    return JSON.parse(res.data).Items[0].trickData
  }).catch((error) => {
    console.log('error fetching trick', error)
    throw new Error(error)
  })
}

export const apiRemoveUser = (userJwt) => {
  return fetch(`${aws_api}/userRemove`, {
    method: "POST",
    body: JSON.stringify({
      token: userJwt,
    })
  }).then(res => {console.log(res); res.json()}).then(res => {
    if(res?.message === "Internal server error" || res === "Internal server error") {
      throw new Error('could not remove user')
    }

    return "user removed"
  }).catch((error) => {
    throw new Error(error)
  })
}

export const apiGetUser = (userJwt) => {
  return fetch(`${aws_tap_api}`, {
    headers: {
      Authorization: userJwt
    }
  }).then(res => res.json()).then(res => {
    return JSON.parse(res.data).Items[0]
  }).catch((error) => {
    console.log('error fetching user', error)
    throw new Error(error)
  })
}

export const apiGetCardList = (userJwt) => {
  return fetch(`${aws_api}/tricks`, {
    headers: {
      Authorization: userJwt
    }
  }).then((res => res.json())).then(res => {
    return JSON.parse(res.data)
  }).catch((error) => {
    console.log('error fetching tricks', error)
    throw new Error(error)
  })
}