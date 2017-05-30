

## Info
- Based on http://framework7.io/examples/split-view-panel/


## How to install
- npm install
- npm install gulp@3.9.1 -g

## How to develop:
- npm run watch
- open https://preview.c9users.io/aknip/simple-f7-template/src/index.html



## How it works:
- All source files are in /src
- npm run watch: runs webpack dev server, which compiles js into dev/js-bundled/
- gulp build: runs webpack, copies, minifies etc. everything into dist/


## How offline support works
- Offline support is activated during gulp build - not during development !
- gulp build generates manifest.appcache and includes <script> for appcache-nanny.js
- my-app.js initializes appcache-nanny (sets path to appcache-loader.html, refresh interval etc.)


## Gulp tasks
- gulp hello: test with console.log
- gulp useref: Analyzes HTML files for JS and CSS sources, concatenates and minifies them into dist/
- gulp build: runs webpack, copies, minifies etc. everything into dist/


## Notes
- Gulp for deployment to github pages / SSH / FTP / SFTP...
 https://github.com/morris/vinyl-ftp
 https://github.com/jwir3/gulp-ssh-deploy
 https://github.com/teambition/gulp-ssh
