'use strict';

var child_process = require('child_process');
var path = require('path');
var childD;

var convertSpeed = (speed) => Math.ceil(base_speed * speed);

var speakers = {
  speak: (text, speed, callback) => {
    var commands, pipedData;
    callback = (typeof callback !== 'function') ? (() => {}) : callback;

    if (!text) {
      throw new TypeError('missing text');
    }

    if (process.platform === 'linux') {
      commands = ['--pipe'];
      if (speed) {
        pipedData = '(Parameter.set \'Audio_Command "aplay -q -c 1 -t raw -f s16 -r $(($SR*' + convertSpeed(speed) + '/100)) $FILE") ';
      }
      pipedData += '(SayText \"' + text + '\")';

    } else {

      return process.nextTick(() => {
        callback(new Error('platform ' + process.platform+ ' not supported'));
      });

    }

    var options = undefined;
    childD = child_process.spawn(speaker, commands, options);

    childD.stdin.setEncoding('ascii');
    childD.stderr.setEncoding('ascii');

    if (pipedData) {
      childD.stdin.end(pipedData);
    }

    childD.stderr.once('data', (data) => {
      callback(new Error(data));
    });

    childD.addListener('exit', (code, signal) => {
      if (code === null || signal !== null) {
        return callback(new Error('say Error [code: ' + code + '] [signal: ' + signal + ']'));
      }
      childD = null;
      callback(null);
    });

  },
  stop: (callback) => {

    callback = (typeof callback !== 'function') ? (() => {}) : callback;

    if (!childD) {
      return callback(new Error('No speech to kill'));
    }

    if (process.platform === 'linux') {

      process.kill(childD.pid);

    } else {

      return process.nextTick(() => {
        callback(new Error('platform ' + process.platform+ ' not supported'));
      });

    }

    childD = null;
    callback(null);

  }
}

var to_export = null;
var to_export_message = "";

if(process.platform === 'linux') {

  var speaker = 'festival';
  var base_speed = 100;

  try {
    var dep = child_process.spawnSync("which", [speaker]).stdout.toString();
    if(!!dep && dep.includes(speaker)) {
      to_export = speakers;
    } else {
      to_export_message = to_export = "cant use say, missing dependancies, please install festival. try sudo apt-get install festival";
    }
  } catch(e) {
    to_export_message = to_export = "cant use say, a generic error on usign which command is occurred";
  }

} else {
  to_export_message = to_export = "cant use say , this feature is complatible only on linux platforms";
}

if(typeof to_export === typeof "string") {
  to_export = {
    speak: (text, speed, callback) => {
      callback = (typeof callback !== 'function') ? (() => {}) : callback;
      callback(to_export_message);
    },
    stop: (callback) => {
      callback = (typeof callback !== 'function') ? (() => {}) : callback;
      callback(to_export_message);
    }
  }

}

module.exports = to_export;
