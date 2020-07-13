# Reqarr

Reqarr is a service that allows users to request media content. Built for integration with sonarr and radarr.

Application is built on Node.js with a Vue.js frontend.


## Installation and Startup

1. Reqarr requires nodejs. Get node at their [website](https://nodejs.org/en/download/) or install it using your package manager.
    * Recommended to install NPM, which includes nodejs with it
2. Download the latest release of reqarr and extract it.
3. From the extracted directory, start the application by using the command `node reqarr`
4. Reqarr should now be running at http://localhost:8787 


## Running Reqarr in the Background

Assuming you have installed npm:

1. Install pm2 globally: `sudo npm install -g pm2`
2. From the reqarr directory, start the app with pm2: `pm2 start reqarr.js`
    * Stop it with `pm2 stop reqarr`


## Updating

When you want to update Reqarr to a newer version follow these steps:

1. Stop the app
2. Download the latest release
3. Make a copy/backup of your current reqarr directory
4. Unzip the new release
5. Start Reqarr