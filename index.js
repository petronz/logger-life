const Logger = require("./Logger.class.js");

var logger = new Logger({
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
  formatText: "%level %customDate - %content ",
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
    warn: "reverse.fg_magenta.bg_white",
    error: "bg_white.fg_red"
  },
  /*
  * [Function]logFunction: accept an arbitrary function.
  * it is used to log on console. Default: console.log
  */
  logFunction: console.log,
  /*
  * [Object]labels: available keys of labels are:
  * debug, info, warn and error.
  * They accepts an arbitrary string to print on console as level when %level into formatText is requested
  */
  labels: {
    warn: "[WARNING] "
  },
  /*
  * [Object]fileLog: available keys of fileLog are:
  * path and level.
  * path is where has to be saved the log,
  * level contains all the 4 levels warn, error, info and debug; for each one of them
  * you spcify if you want to log on file or not
  */
  fileLog: {
    path: __dirname,
    level: {
      info: false,
      debug: false,
      error: false,
      warn: false
    }
  }
});

/*
* addRankAction([String]rank, [Function]callback):
* specify for a certain rank a callback to execute every time the specific rank is logged
*/
logger.addRankAction("debug", (data) => {
  console.log(`Provided a debug log, it has ${data.content.formatted}`);
});

/*
* addLevelAction([String]level, [Function]callback):
* specify for a certain level a callback to execute every time the level is logged
*/
logger.addLevelAction("info", (data) => {
  console.log(`Provided a ${data.level} log, it has ${data.content.formatted}`);
});

logger.log("debug", "Hello! I'm [[underscore:Debug]] and i am very useful");

logger.info("Hello! I'm [[reverse.bg_yellow:Info]] and i am [[underscore:very useful]]");

logger.log("warn", "Hello! I'm [[reverse.bg_yellow:warn]] [[and i am very useful]]");

logger.error("Hello! I'm [[reverse.bg_yellow:error]] and i am [[underscore.reverse.dim:very useful]]");
