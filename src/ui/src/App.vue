<template>
  <div id="app">
    <md-toolbar id="toolbar" md-elevation="1">
      <div id="toolbar-logo" @click="$router.push('/')">
        <img id="logo-pic" src="./assets/logo.png">
        <h3 id="logo-name" class="md-title">Reqarr</h3>
      </div>
      <div id="toolbar-search">
          <input id="search-bar" type="text" placeholder="Search..." v-if="!isPhone && !isLogin">
      </div>
      <md-button to="/activity" v-if="!isLogin && !isPhone">ACTIVITY</md-button>
      <md-button to="/settings" class="md-icon-button" v-if="!isLogin"><md-icon>settings</md-icon></md-button>
    </md-toolbar>
    <router-view/>
    <div class="phone-viewport" v-if="isPhone && !isLogin">
      <md-bottom-bar class="md-accent" md-sync-route>
        <md-bottom-bar-item to="/" exact md-label="Search" md-icon="search"></md-bottom-bar-item>
        <md-bottom-bar-item to="/activity" md-label="Activity" md-icon="history"></md-bottom-bar-item>
      </md-bottom-bar>
    </div>
  </div>
</template>

<script>

export default {
  data: () => ({
    userinfo: ''
  }),
  computed: {
    isLogin() {
      return this.$route.path === '/login' || this.$route.path === '/register'; 
    },
    isPhone() {
      let w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      return (w < 768);
    }
  }
}
</script>

<style>
#app {
  text-align: center;
  color: white;
}

#toolbar-search {
  flex: 1 1 0%;
  text-align: center;
  margin: 0 auto;
  max-width: 500px;
  padding-left: 20px;
}

#toolbar {
  text-align: left;
}

#toolbar-logo {
  cursor: pointer;
  display: inline-flex;
}

#logo-name {
  line-height: 2.34em;
}

#logo-pic {
  padding: 5px;
  max-width: 45px;
  height: auto;
}

.md-bottom-bar > .md-ripple {
  display: flex;
  justify-content: center;
}

.phone-viewport {
  position: absolute;
  width: 100%;
  left: 0;
  bottom: 0;
}

#search-bar {
  min-height: 40px;
  height: 40px;
  width: 100%;
  background-color: #303030;
  border-radius: 5px;
  border: none; 
  color: white;
  padding-left: 15px;
  padding-right: 15px;
  font-size: 16px;
  font-family: 'Roboto', sans-serif;
}
#search-bar:focus {
  outline: none;
}
#search-bar::placeholder { 
  color: #b3b3b3;
  opacity: 1;
}
#search-bar:-ms-input-placeholder { 
  color: #b3b3b3;
}
#search-bar::-ms-input-placeholder { 
  color: #b3b3b3;
}
</style>
