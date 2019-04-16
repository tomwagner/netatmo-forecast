
export interface Room {
  id: string
  name: string
  type: string
  module_ids: string[]
}

export enum ModuleType {
  NATherm1 = 'NATherm1', //thermostat
  NRV = 'NRV', // valve
  NAPlug = 'NAPlug', // relay
  NACamera = 'NACamera', // welcome camera
  NOC = 'NOC', // presence camera
}

export type LangCountryCode = string


export interface User {
  email: string
  language: LangCountryCode
  locale: LangCountryCode
  feel_like_algorithm: number
  unit_pressure: number
  unit_system: number
  unit_wind: number
  id: string
}

export interface Timetable {
  m_offset: number
  zone_id: number
}

export interface Room {
  room_id: string
  temp: number
}

export interface ZoneRoom {
  id: string
  therm_setpoint_temperature: number
}

export interface Zone {
  name: string
  id: number
  type: number
  rooms_temp: Room[]
  rooms: ZoneRoom[]
}

export interface Schedule {
  away_temp: number
  default: boolean
  hg_temp: number
  timetable: Timetable[]
  zones: Zone[]
  id: string
  type: string
}

export interface Module {
  id: string
  type: ModuleType
  name: string
  setup_date: number
  modules_bridged: string[]
  room_id: string
}

export interface Home {
  id: string
  name: string
  coordinates: [number, number]
  country: string
  timezone: string
  rooms: Room[]
  modules: Module[]
  therm_schedules: Schedule[]
  therm_setpoint_default_duration: number
  schedules: Schedule[]
  therm_mode: string
}

export enum RoomMode {
  schedule = 'schedule',
  away = 'away',
  hg = 'hg'
}

export type UnixTimeStamp = number

export enum ResponseStatus {
  ok = "ok"
}
