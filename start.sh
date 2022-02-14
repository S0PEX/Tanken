forever stop --pidFile ./tanken.pid
git pull
tsc
forever start --pidFile ./tanken.pid ./dist/index.js