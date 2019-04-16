import fetch from 'isomorphic-fetch';
import { BASE_URL } from './constants';

interface Props {
  home_id: string;
  device_types?: string;
}

interface Home {}
interface Error {}

export interface Response {
  home: Home[];
  errors: Error[];
}

const homestatus = async (auth: string, props?: Props): Promise<Response> => {
  return fetch(`${BASE_URL}/api/homestatus`, {
    method: 'POST',
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

export default homestatus;
