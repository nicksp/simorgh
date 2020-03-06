import timemachine from 'timemachine';
/*
timemachine is a node module which overrides the system time for a repo. There are components on storybook with date and time which varies according to current date and time. This causes inconsistency across chromaticqa tests hence the use of this dependency.
*/

// Sets the date and time whilst leaving the clock ticking from that point onwards.
export const startTimeMachine = (tick = true) => {
  timemachine.config({
    dateString: 'Sunday, 16 February 2020 17:00:00 GMT',
    timestamp: 1581872400,
    tick,
  });
};

// Resets the bindings so that the time is reset to the actual system time
export const resetTimeMachine = () => {
  timemachine.reset();
};

// by default, importing the timemachine automatically overrides the system time and sets the tick to false.
// We only want to override system time once `startTimeMachine` is invoked.
// This will reset the timemachine so that system time continues normally..
resetTimeMachine();
