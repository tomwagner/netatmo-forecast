import * as R from "ramda";
import * as netatmo from ".";
import { Response as HomesDataResponse } from "./homesdata";
import { Response as HomeStatusResponse } from "./homestatus";
import { Module, Room, RoomMode, UnixTimeStamp } from "./types";

export const getModules = R.path(['body', 'homes', 0, 'modules']) as (
  homesData: HomesDataResponse
) => Module[];

export const getRooms = R.path(['body', 'home', 'rooms']) as (
  homeStatus: HomeStatusResponse
) => Room[];

export const enableScheduleMode = async (
  token: string,
  home_id: string,
  endtime?: UnixTimeStamp
) =>
  netatmo.setthermmode(token, {
    home_id,
    mode: RoomMode.schedule,
    endtime
  });

export const enableAwayMode = async (
  token: string,
  home_id: string,
  endtime?: UnixTimeStamp
) =>
  netatmo.setthermmode(token, {
    home_id,
    mode: RoomMode.away,
    endtime
  });


export const isAwaySchedule = async (token, home_id: string, end_time: number): Promise<boolean> => {
  try {
    const homesdata = await netatmo.homesdata(token.access_token, {
      home_id
    });

    const thermostatModule = getModules(homesdata).find(
      module => module.name === 'Thermostat'
    );

    if (thermostatModule) {
      const homestatus = await netatmo.homestatus(token.access_token, {
        home_id
      });
      const room: any = getRooms(homestatus).find(
        room => room.id === thermostatModule.room_id
      );
      if (room) {
        return room.therm_setpoint_mode === RoomMode.away && room.therm_setpoint_end_time !== end_time;
      }
    }
    return false;
  } catch (error) {
    return false;
  }
};