const LogLife = require("./LogLife.class.js");

var ll = new LogLife({
  /*
  * [String]level: available levels are debug, info, warn and error.
  * They accepts a string of available color concatenations (with "." as separator)
  */
  level: "debug",
  /*
  * [String]formatText: the console logged message.
  * you can customize it with the interpolation of the 3 major variables:
  * %level, %date and %content.
  * You can also use customInterpolations like in the example %customDate
  */
  formatText: "%levelLabel %pidLabel %customDate - %content ",
  /*
  * [Object]formatActions: it accepts an object populated with (non-void)functions.
  * It is used to add custom actions that can be used into formatText
  */
  formatActions: {
    customDate: (options) => {
      return options.date.toISOString();
    }
  },
  /*
  * [Object]formatColors: available keys of formatColors are:
  * debug, info, warn and error.
  * They accepts a string of available color concatenations (with "." as separator)
  */
  formatColors: {
    error: "bright.fg_red"
  },
  /*
  * [Object]labels: available keys of labels are:
  * debug, info, warn and error.
  * They accepts an arbitrary string to print on console as level when %level into formatText is requested
  */
  labels: {
    warn: "[WARNING] "
  },
  /*
  * [Function]logFunction: accept an arbitrary function.
  * it is used to log on console. Default: console.log
  */
  logFunction: console.log,
  /*
  * [Object]fileLog: available keys of fileLog are:
  * path and level.
  * path is where has to be saved the log,
  * level contains all the 4 levels warn, error, info and debug; for each one of them
  * you spcify if you want to log on file or not
  */
  fileLog: {
    path: __dirname,
    rank: {
      info: false,
      debug: false,
      error: false,
      warn: false
    }
  },
  /*
  * Handlers
  */
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
  /*
  * interpolation settings
  */
  interpolation: {
    separator: "||",
    regexp: false // an example /{{*([^}]+)}}/g means check all text between "{{" and "}}"
  },
  /*
  * You think that fabulos mode is not enough fabulously-fabulos?
  * you can set your own color palette!
  * [Object]fabulous:
  * contains the key [Array]formatColors.
  * you can specify an array colors configurations to use into fabulos mode
  */
  fabulous: {
    formatColor: [
      "bright.fg_red",
      "reset.fg_red",
      "dim.fg_red",
      "dim.fg_yellow",
      "reset.fg_yellow",
      "bright.fg_yellow",
      "bright.fg_green",
      "reset.fg_green",
      "dim.fg_green",
      "dim.fg_cyan",
      "reset.fg_cyan",
      "bright.fg_cyan",
      "bright.fg_blue",
      "reset.fg_blue",
      "dim.fg_blue",
      "dim.fg_magenta",
      "reset.fg_magenta",
      "bright.fg_magenta"
    ]
  }

});

/*
* addRankAction([String]rank, [Function]callback):
* specify for a certain rank a callback to execute every time the specific rank is logged
*/
ll.addRankAction("debug", (data) => {
  setTimeout(function() {
    console.log(`Provided a ${data.level} log`);
  }, 100);
});

/*
* addLevelAction([String]level, [Function]callback):
* specify for a certain level a callback to execute every time the level is logged
*/
ll.addLevelAction("info", (data) => {
  setTimeout(function() {
    console.log(`Provided a ${data.level} log`);
  }, 100);
});

/*
* log as this, with ll.log("level", "content")
*/
ll.log("debug", "Hello! I'm [[underscore||Debug]] and i am very useful");
ll.log("warn", "Hello! I'm [[reverse.bg_yellow||warn]] [[and i am very useful]]");

/*
* log as this, with ll.LEVEL("content")
*/
ll.info("Hello! I'm [[reverse.bg_yellow||Info]] and i am [[underscore:very useful]]");
ll.error("Hello! I'm [[reverse.bg_yellow||error]] and i am [[underscore.reverse.dim||very useful]]");

/*
* working on local and do you want a vocal feedback?
*/
ll.error("Hello! I'm [[reverse.bg_yellow||error]] and i am [[underscore.reverse.dim||very useful]]", {
  say: true
});

/*
* working on local and do you want a custom vocal feedback for a specific log message?
*/
ll.error("very bad Error", {
  say: "error"
});

/*
* finally, the most beautiful and useless way to log
*/
ll.log("debug", "[[blink:force a specific log to change color]]", {
  formatColors: "reverse"
});

/*
* finally, the most beautiful and useless way to log
*/
ll.log("debug", "Hello! I'm [[underscore||Fabulous Debug]] and i am the very best", {
  fabulous: true
});
