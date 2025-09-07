function startCountdown(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds < 1 ? totalSeconds + "0" : totalSeconds % 60;

  //  console.log(`${minutes} minutes and ${seconds} seconds remaining.`);
  return `${minutes}:${seconds}`;
}

// Example usage
//startCountdown(120000); // 2 minutes

export default startCountdown;
