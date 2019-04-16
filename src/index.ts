import DarkSky from 'dark-sky';
import moment, { Moment } from 'moment';
import * as config from './config';
import { getAvgCloudCover, getStartAndEndTime, getSunriseTime } from './forecast';
import { Forecast } from './forecast.types';
import * as netatmo from './netatmo';
import { enableAwayMode, isAwaySchedule } from './netatmo/helpers';

const darkSky = new DarkSky(config.forecast.access_token);

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const setupNextCheck = (currentTime: Moment): Promise<void> => {
  const nextHour = moment(currentTime).add(1, 'hour');
  console.log('Next Check: ', nextHour.format(config.humanCurrentTime));
  console.log('========================================================');
  return sleep(nextHour.diff(moment.now())).then(checkCloudiness);
};

const checkCloudiness = async () => {
  const currentTime = moment(moment.now());

  try {
    const token = await netatmo.auth(config.netatmo);

    if (await isAwaySchedule(token, config.netatmo.home_id))
      throw new Error('Away mode enabled, no control needed');

    const forecast: Forecast = await darkSky
      .latitude(config.forecast.lat)
      .longitude(config.forecast.lng)
      .time(
        moment(currentTime)
          .utc()
          .startOf('day')
          .format()
      )
      .units(config.forecast.units)
      .language(config.forecast.lang)
      .get();

    const sunriseTime = moment.unix(getSunriseTime(forecast));

    console.log('Sunrise time', sunriseTime.format(config.humanCurrentTime));

    const [startTime, endTime] = getStartAndEndTime(
      sunriseTime.startOf('hour'),
      config.SLIDING_WINDOW_TIME
    );

    console.log('Start Time', startTime.format(config.humanCurrentTime));
    console.log('End Time', endTime.format(config.humanCurrentTime));

    const avg = getAvgCloudCover(
      forecast,
      sunriseTime,
      moment(sunriseTime).add(3, 'hours')
    );
    console.log('Average CloudCover', avg);

    if (currentTime.isAfter(startTime) && currentTime.isBefore(endTime)) {
      if (avg <= config.CLOUD_COVER_THRESHOLD) {
        enableAwayMode(token.access_token, config.netatmo.home_id, endTime.unix());
      }
    } else {
      setupNextCheck(currentTime);
    }
  } catch (error) {
    console.log('error', error);
    setupNextCheck(currentTime);
  }
};

checkCloudiness();
