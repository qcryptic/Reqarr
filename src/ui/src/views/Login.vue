<template>
  <div class="md-layout md-alignment-center">
    <div id="login-window" class="md-layout-item">
      <md-card style="border-radius: 8px;">
        <md-card-header style="padding-bottom: 8px;">
          <div class="md-title">{{action}}</div>
        </md-card-header>
        <div id="login-error-msg"><b>{{errorMsg}}</b></div>
        <md-card-content style="padding-top: 8px;">
          <form novalidate @submit.prevent="validate" onsubmit="return false">
            <md-field>
              <label>Username</label>
              <md-input v-model="username" maxlength="30"></md-input>
            </md-field>
            <md-field>
              <label>Password</label>
              <md-input v-model="password" type="password" maxlength="64"></md-input>
            </md-field>
            <md-field v-if="!isLogin">
              <label>Key</label>
              <md-input v-model="key" maxlength="32"></md-input>
            </md-field>
            <md-card-actions>
              <md-button type="submit" :disabled="submitted">{{action}}</md-button>
            </md-card-actions>
          </form>
        </md-card-content>
      </md-card>  
      <p v-if="isLogin">Not registered? Contact the owner.</p>
      <p v-if="!isLogin">Don't have a registration key? Contact the owner.</p>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      action: '',
      isLogin: true,
      username: '',
      password: '',
      key: '',
      errorMsg: '',
      submitted: false
    }
  },
  created: function() {
    if (this.$route.path === '/register') {
      this.action = 'Register';
      this.isLogin = false;
      if (this.$route.query.key) {
        this.key = this.$route.query.key;
      }
    } 
    else {
      this.action = 'Login';
    }
  },
  methods: {
    submit: function() {
      this.errorMsg = '';
      this.submitted = true;
      var body = {'username':this.username, 'password':this.password};
      if (this.isLogin) {
        this.doPost('/login', body);
      }
      else {
        body.key = this.key;
        this.doPost('/register', body)
      }
    },
    doPost: function(path, body) {
      this.$http.post(path, body)
          .then((res) => { 
            if (res.data !== 'ok') 
              this.errorMsg = res.data;
            else 
              this.$router.push({ name: 'Search' }); 
            this.submitted = false;  
          })
          .catch((err) => { this.errorMsg = err.response.data; this.submitted = false; });
    },
    validate: function() {
      console.log('here')
      var error = '';
      if (!/^[a-zA-Z0-9]{2,30}$/.test(this.username)) 
        error = 'Invalid username - should be 2-30 characters'
      else if (!/^.{1,64}$/.test(this.password)) 
        error = 'Invalid password - should be 1-64 characters'
      else if (!this.isLogin && !/^[a-z0-9]{32}$/.test(this.key))
        error = 'Invalid key' 
      console.log(error)  
      if (error === '') {
        return this.submit();
      }
      else {
        this.errorMsg = error;
      }
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

#login-error-msg {
  padding: 0; 
  height: 1em; 
  color: #d02f2f;
}
</style>