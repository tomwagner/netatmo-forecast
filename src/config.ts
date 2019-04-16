import dotenv from 'dotenv';

// Load environment variables from .env file in root
dotenv.config();
export const humanCurrentTime = 'DD.MM. - HH:mm:ss';

// 2 hours bef. SUN_RISE ... SUN_RISE .... NOON .... EVENING
// 2 hours bef. SUN_RISE ... SUN_RISE .. 10 .. NOON .... EVENING -- check timewindow between SUN rise

// number of hours for checking around sun raise
export const SLIDING_WINDOW_TIME = 3;
// cloud rhreshold when it's decied to truth/false
export const CLOUD_COVER_THRESHOLD = 0.35;

export const netatmo = {
  home_id: process.env.NETATMO_HOME_ID || '',
  client_id: process.env.NETATMO_CLIENT_ID || '',
  client_secret: process.env.NETATMO_CLIENT_SECRET || '',
  username: process.env.NETATMO_USERNAME || '',
  password: process.env.NETATMO_PASSWORD || '',
  scope: 'read_station read_thermostat write_thermostat'
};

export const forecast = {
  access_token: process.env.DARK_SKY_TOKEN || '',
  lat: parseInt(process.env.LATITUDE_DECIMAL || '49.0'),
  lng: parseInt(process.env.LONGITUDE_DECIMAL || '15.0'),
  lang: 'en',
  units: 'si'
};
