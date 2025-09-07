function millisToMinutesAndSeconds(millis: number) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (+seconds < 10 ? "0" : "") + seconds;
  //  return `${minutes}:${+seconds < 10 ? 0 : seconds}`;
}

function countdown(ms: number): string {
  let totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  let result: string;

  console.log(`${minutes}:${seconds < 10 ? "0" : ""}${seconds}`);
  result = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

  const interval = setInterval(() => {
    if (totalSeconds > 0) {
      totalSeconds--;
      const mins = Math.floor(totalSeconds / 60);
      const secs = totalSeconds % 60;
      console.log(`>>>>>>${mins}:${secs < 10 ? "0" : ""}${secs}`);
      result = `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    } else {
      clearInterval(interval);
      console.log("Countdown finished!");
    }
  }, 1000);
  return result;
}

// Example usage
//countdown(120000); // Countdown from 2 minutes

export { countdown, millisToMinutesAndSeconds };
