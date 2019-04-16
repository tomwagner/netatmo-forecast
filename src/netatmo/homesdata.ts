import fetch from 'isomorphic-fetch';
import { BASE_URL } from './constants';
import { Home, User } from './types';

interface Props {
  home_id?: string;
  gateway_types?: string;
}

interface Error {}

export interface Response {
  body: {
    homes: Home[];
    user: User;
  },
  status: string,
  time_exec: number,
  time_server: number,
}

const homesdata = async (auth: string, props?: Props): Promise<Response> => {
  return fetch(`${BASE_URL}/api/homesdata`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${auth}`,
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body: JSON.stringify(props)
  })
    .then(response => response.json())
    .catch(error => {
      throw new Error(error);
    });
};

export default homesdata;
