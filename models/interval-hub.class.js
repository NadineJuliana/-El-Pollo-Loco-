/**
* @class IntervalHub
* @description Centralized management for all game intervals
*/
class IntervalHub {
  static allIntervals = [];

  /**
   * Starts and registers a new interval.
   * @param {Function} func Function executed on each interval tick
   * @param {number} timer Interval duration in milliseconds
   * @returns {number} Interval ID
   */
  static startInterval(func, timer) {
    const newInterval = setInterval(func, timer);
    IntervalHub.allIntervals.push(newInterval);
    return newInterval;
  }

  /**Stops all registered intervals.*/
  static stopAllIntervals() {
    IntervalHub.allIntervals.forEach(clearInterval);
    IntervalHub.allIntervals = [];
  }
}