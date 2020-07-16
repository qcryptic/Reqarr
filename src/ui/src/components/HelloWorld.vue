<template>
  <div>
    <h1 class="hello">{{ msg }}</h1>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>


<style scoped>
h1.hello::selection {
  background: #B200FF; /* WebKit/Blink Browsers */
}
::-moz-selection {
  background: #ffffff; /* Gecko Browsers */
}
</style>
