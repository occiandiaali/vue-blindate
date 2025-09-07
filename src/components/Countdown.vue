<template>
  <div class="countdown">
    <div class="countdown__remaining">{{ minutes }}:{{ seconds }}</div>
  </div>
</template>

<script setup>
import { useTemplateRef } from "vue";
import { useMinSecCountdown } from "../composables/useMinSecCountdown";

const timeLeft = useTemplateRef(0);
const props = defineProps(["time"]);

timeLeft.value = props.time;

const { minutes, seconds } = useMinSecCountdown(timeLeft);
</script>

<style lang="css" scoped>
.countdown {
  text-align: center;
  font-size: 2rem;
}
</style>
