https://bitbucket.org/tutorials/markdowndemo

# Log-Life #

Log Life is a logging library that provides you multiple log methods, string interpolations for messages, catching of main error and warning events, file logging, log interception and launch callbacks.

## Usage example ##

A simple usage:

```
#!javascript

const LogLife = require("./LogLife.class.js");

var ll = new LogLife();

ll.log("info", "Hi! I'm info log level"); // output(in green): Hi! I'm info log level 
ll.info("Hi! Also I'm info log level"); // output(in green): Hi! I'm info log level

ll.log("error", "Hi! I'm info error level"); // output(in red): Hi! I'm error log level
```

## Full Configuration example ##

An example of all configurations:

```
#!javascript

var ll = new LogLife({
  level: "debug",
  formatText: "%level %customDate - %content",
  formatActions: {
    customDate: (options) => {
      return options.date.toISOString();
    }
  },
  formatColors: {
    error: "bg_white.fg_red"
  },
  labels: {
    warn: "[!WARNING!] "
  },
  logFunction: console.log,
  fileLog: {
    path: __dirname,
    level: {
      info: false,
      debug: false,
      error: false,
      warn: false
    }
  },
  handlers: {
    uncaughtException: {
      logAs: "error",
      exitCode: 1
    },
    unhandledRejection: {
      logAs: "error"
    },
    warning: {
      logAs: "warn"
    },
    exit: {
      logAs: "debug"
    }
  },
  fabulous: {
    formatColor: [
      "bright.fg_red",
      "reset.fg_red",
      "dim.fg_red"
    ]
  },
  regexp: false
});

```