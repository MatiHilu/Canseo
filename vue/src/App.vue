<template>
  <div>
    <router-view/>
    <footerr/>
  </div>
</template>

<script>
import footerr from "@/components/Footer.vue";
export default {
  name: 'App',
  components: {
    footerr,
  },
};
</script>