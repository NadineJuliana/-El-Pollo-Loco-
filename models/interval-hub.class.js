class IntervalHub {
  static allIntervals = [];

  static startInterval(func, timer) {
    const newInterval = setInterval(func, timer);
    IntervalHub.allIntervals.push(newInterval);
    return newInterval;
  }

  static stopAllIntervals() {
    IntervalHub.allIntervals.forEach(clearInterval);
    IntervalHub.allIntervals = [];
  }
}
