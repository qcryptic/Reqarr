<template>
  <div class="md-layout md-alignment-center">
    <div id="login-window" class="md-layout-item">
      <md-card style="border-radius: 8px;">
        <md-card-header>
          <div class="md-title">{{action}}</div>
        </md-card-header>
        <md-card-content>
          <md-field>
            <label>Username</label>
            <md-input v-model="user"></md-input>
          </md-field>
          <md-field>
            <label>Password</label>
            <md-input v-model="pass"></md-input>
          </md-field>
          <md-field v-if="isRegister">
            <label>Key</label>
            <md-input v-model="key"></md-input>
          </md-field>
          <md-card-actions>
            <md-button>{{action}}</md-button>
          </md-card-actions>
        </md-card-content>
      </md-card>  
      <p v-if="!isRegister">Not registered? Contact the owner.</p>
      <p v-if="isRegister">Don't have a registration key? Contact the owner.</p>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      action: (this.$route.path === '/register') ? 'Register' : 'Login'
    }
  },
  computed: {
    isRegister () {
      return this.$route.path === '/register';
    }
  }
}
</script>

<style scoped>
#login-window {
  background: none;
  width: 90%;
  height: calc(70vh - 64px);
  max-width: 400px;
  padding: 10px;
  margin: 0;
  position: absolute;
  top: 50%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
}

p {
  color: white;
}
</style>