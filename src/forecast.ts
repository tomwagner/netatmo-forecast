import moment, { Moment } from 'moment';
import R from 'ramda';
import * as config from './config';
import { Forecast, Hourly } from './forecast.types';

export const getSunriseTime = R.path(['daily', 'data', '0', 'sunriseTime']) as (
  forecast: Forecast
) => number;

export const getHourlyForecast = R.pathOr([], ['hourly', 'data']) as (
  forecast: Forecast
) => Hourly[];

export const getStartAndEndTime = (
  time: Moment,
  slidingWindowTime: number
): [Moment, Moment] => [
  moment(time).subtract(slidingWindowTime, 'hours'),
  moment(time).add(slidingWindowTime, 'hours')
];

/**
 * Returns number 0-1 representing cloud cover in forecasted area
 * @param forecast
 * @param startTime
 * @param endTime
 */
export const getAvgCloudCover = (
  forecast: Forecast,
  startTime: Moment,
  endTime: Moment
): number => {
  const nextHoursForecast = getHourlyForecast(forecast).filter(
    f =>
      moment(moment.unix(f.time)).isSameOrAfter(startTime) &&
      moment(moment.unix(f.time)).isSameOrBefore(endTime)
  );
  return (
    nextHoursForecast.reduce((sum, x) => {
      console.log(
        'Cloud coverage',
        x.cloudCover,
        moment.unix(x.time).format(config.humanCurrentTime)
      );
      return sum + x.cloudCover;
    }, 0) / nextHoursForecast.length
  );
};
