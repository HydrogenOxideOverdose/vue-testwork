<template>
  <div id="app">
    <ProductManager />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ProductManager from '@/views/ProductManager.vue';

@Component({
  components: {
    ProductManager
  }
})
export default class App extends Vue {}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Arial', sans-serif;
  background-color: #f5f5f5;
}

#app {
  padding: 20px;
}
</style>