import { ref, onUnmounted } from "vue";

export function useMinSecCountdown(timeRemaining) {
  const minutes = ref(0);
  const seconds = ref(0);
  let interval;

  const calculateTimeLeft = () => {
    if (timeRemaining < 0) {
      clearInterval(interval);
      minutes.value = 0;
      seconds.value = 0;
      return;
    }
    minutes.value = Math.floor((timeRemaining / 1000 / 60) % 60);
    seconds.value = Math.floor((timeRemaining / 1000) % 60);
  };

  interval = setInterval(calculateTimeLeft, 1000);
  calculateTimeLeft();

  onUnmounted(() => {
    clearInterval(interval);
  });

  return { minutes, seconds };
}
