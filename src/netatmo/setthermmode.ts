import fetch from 'isomorphic-fetch';
import { BASE_URL } from './constants';
import { ResponseStatus, RoomMode, UnixTimeStamp } from './types';

export interface Props {
  home_id: string;
  mode: RoomMode;
  endtime?: UnixTimeStamp;
}

interface Response {
  status: ResponseStatus
  time_exec: number
  time_server: UnixTimeStamp
}

const setthermmode = async (auth: string, props?: Props): Promise<Response> => {
  return fetch(`${BASE_URL}/api/setthermmode`, {
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

export default setthermmode;
