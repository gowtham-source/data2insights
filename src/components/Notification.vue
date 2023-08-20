<template>
  <div class="notifications">
    <div class="notif" v-for="(msg, index) in msgs" :key="index">
      {{ msg }}
    </div>
  </div>
</template>

<script setup>
// get msg as  props
import { watch } from "vue";
import { watchEffect } from "vue";
import { onMounted } from "vue";
import { defineProps } from "vue";
const props = defineProps(["msgs"]);

watch(
  () => props.msgs,
  (newVal) => {
    console.log(newVal);
    if (newVal.length) {
      // shift the notifcations and remove it after 3 seconds
      setTimeout(() => {
        console.log(props.msgs.pop(), "popped");
      }, 3000);
    }
  },
  { deep: true }
);

console.log(props.msgs);
</script>

<style lang="scss" scoped>
.notifications {
  position: fixed;
  top: 20px;
  right: calc(50% - 50px);
  transform: translateX(50%);
  z-index: 10;
  width: 400px;
  //   height: 500px;

  .notif {
    background-color: #2ebdff;
    color: white;
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 10px;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  }
}
</style>
