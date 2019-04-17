import fetch from 'isomorphic-fetch'
import { BASE_URL } from './constants'

interface Props {
  username: string
  password: string
  client_id: string
  client_secret: string
  scope?: string
  grant_type?: string
}

interface Response {
  access_token: string
  refresh_token: string
  scope: string[]
  expires_in: number
  expire_in: number
}

const authenticate = async (props: Props): Promise<Response> => {
  const body = new URLSearchParams()
  const defaultProps = { ...props, grant_type: 'password' }
  Object.keys(defaultProps).map((key) => body.append(key, defaultProps[key]))

  return fetch(`${BASE_URL}/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  }).then((response) => response.json())
}

export default authenticate
