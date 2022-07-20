export const domain = process.env.REACT_APP_DOMAIN
export const apiDomain = process.env.REACT_APP_API_DOMAIN
export const appID = process.env.REACT_APP_APPID

export const authToken = () =>
  ({ Authorization: 'Bearer ' + JSON.parse(localStorage.getItem(appID + '.auth') ?? '{}')?.state?.authToken ?? '' })
