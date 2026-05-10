/* =========================
* Interval Hub
* Centralized management for all game intervals
* ========================= */
 class IntervalHub {
    static allIntervals = [];

  // Starts and registers a new interval.
    static startInterval(func, timer) {
      const newInterval = setInterval(func, timer);
      IntervalHub.allIntervals.push(newInterval);
      return newInterval;
    }

  // Stops all registered intervals.
    static stopAllIntervals() {
      IntervalHub.allIntervals.forEach(clearInterval);
      IntervalHub.allIntervals = [];
    }
  }