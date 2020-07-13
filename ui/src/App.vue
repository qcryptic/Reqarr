<template>
  <div id="app">
    <md-toolbar id="toolbar" md-elevation="1">
      <div id="logo" @click="$router.push('/')">
        <img id="logoPic" src="./assets/logo.png">
        <h3 id="logoName" class="md-title">Reqarr</h3>
      </div>
      <div id="space"></div>
      <!--<md-button to="/" v-if="!isLogin">SEARCH</md-button>-->
      <md-button to="/activity" v-if="!isLogin && !isPhone">ACTIVITY</md-button>
      <md-button to="/settings" class="md-icon-button" v-if="!isLogin">
        <md-icon>settings</md-icon>
      </md-button>
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

#space {
  flex: 1 1 0%;
}

#toolbar {
  text-align: left;
}

#logo {
  cursor: pointer;
  display: inline-flex;
}

#logoName {
  line-height: 2.34em;
}

#logoPic {
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
</style>
