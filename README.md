# LoggerLife - Beta version #

LoggerLife is a logging library for NodeJs that provides you multiple log methods, string interpolations for messages,
catching of main process error and warning events, file logging, log interception and callbacks launch.

* [Usage example](#usage-example)
* [Interpolations](#interpolations)
* [Available colors and styles](#available-colors-and-styles)
  * [Text styles](#text-styles)
  * [Foreground colors](#foreground-colors)
  * [Background colors](#background-colors)
* [Full Configuration example](#full-configuration-example)
* [Configurations](#configurations)
  * [Level](#level)
  * [FormatText and formatActions](#formattext-and-formatactions)
  * [FormatColors](#formatcolors)
  * [Labels](#labels)
  * [LogFunction](#logfunction)
  * [FileLog](#filelog)
  * [Handlers](#handlers)
  * [Interpolation](#interpolation)
  * [Fabulous](#fabulous)
* [Methods](#methods)
  * [Log](#log)
  * [Debug, info, warn and error](#debug-info-warn-and-error)
  * [Available options for log](#available-options-for-log)
* [Events](#events)
  * [AddRankAction](#addrankAction)
  * [AddLevelAction](#addlevelaction)

## Usage example ##

A simple usage:

```js

const LoggerLife = require("./LoggerLife.class.js");

var ll = new LoggerLife();

ll.log("info", "Hi! I'm info log level");
ll.info("Hi! Also I'm info log level");

ll.log("error", "Hi! I'm error log level");

```
Result will be

![Usage Example](http://i.imgur.com/rTF1psd.png)

## Interpolations ##

In case you want to change the color, underline or apply a bold
some portions of text you can do it by using the interpolation.
The string that has to be logged interpret the text between [[]].
the content inside of it is splitted if a ":" is found.
In this case, the part before ":" are the color style that has to be
applied to the part after ":"

```js

var ll = new LoggerLife();

ll.log("info", "Hi! I'm [[reverse:info]] log level"); // the info word will be color reversed
ll.log("error", "Hi! I'm [[bg_red.fg_white:error]] log level"); // the error word will be foreground color in white and background colored in red

```
Result will be

![Interpolations](http://i.imgur.com/F6RJuNW.png)

## Available colors and styles ##

### Text styles ###

* reset
* bright
* dim
* underscore
* reverse
* hidden

### Foreground colors ###

* fg_black
* fg_red
* fg_green
* fg_yellow
* fg_blue
* fg_magenta
* fg_cyan
* fg_white
* fg_crimson

### Background colors ###

* bg_black
* bg_red
* bg_green
* bg_yellow
* bg_blue
* bg_magenta
* bg_cyan
* bg_white

## Full Configuration example ##

An example of all configurations:

```js

var ll = new LoggerLife({
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
  interpolation: {
    separator: "||",
    regexp: false
  }
});

```

## Configurations ##

### Level ###

LoggerLife provides you 4 log-levels: **debug**, **info**, **warn**, **error**.
Debug is the highest log level, which means the other 3 levels will be logged
in addition to it. When info is specified also warn and error are logged,
but not debug. When warn is specified, in addition to it, only error is logged.
When error is specified as level only it is logged.

```js

var ll = new LoggerLife({
  level: "warn"
});

ll.log("warn", "this is warning"); //this will be logged
ll.log("error", "this is error"); //this will be logged

ll.log("debug", "this is debug"); //this will not be logged

```
Result will be

![Level](http://i.imgur.com/5VEFO1W.png)

### FormatText and formatActions ###

formatText provides you the possibility to fully customize
the logged text. Default interpolation methods are: **%level**, **%pid**, **%date** and **%content**.
You can add custom interpolation methods with formatActions.

```js

var ll = new LoggerLife({
  formatText: "%mainLabel - %customDate - %content", // default formatText is "%levelLabel %pidLabel %date - %content"
  formatActions: {
    mainLabel: (options) => { //options contains all the main informations about the log
      return `[${options.level.toUpperCase()}|${options.pid}]`;
    },
    customDate: (options) => {
      return + new Date(options.date);
    }
  }
});

ll.log("info", "this is info"); //this will log: [INFO|13660] - 1495720604797 - this is info

```
Result will be

![formatText and formatActions](http://i.imgur.com/CKDrE2g.png)

### FormatColors ###

Change the default color of the 4 log levels.

```js

var ll = new LoggerLife({
  formatColors: {
    debug: "fg_red",
    info: "fg_white.reverse",
    warn: "fg_yellow.bright",
    error: "bg_white.fg_red.underscore"
  }
});

ll.log("info", "this is info"); //this will log the text in fg black and bg white
ll.log("error", "this is error"); //this will log text with bg white, fg red underlined

```

Result will be

![formatColors](http://i.imgur.com/P1VU5yN.png)

### Labels ###

Change the default labels of the 4 log levels.

```js

var ll = new LoggerLife({
  labels: {
    debug: "[DEBUG]", // default is [D]
    info: "[INFO]", // default is [I]
    warn: "[WARN]", // default is [W]
    error: "[ERROR]" // default is [E]
  }
});

ll.log("info", "this is info"); //this will log: [INFO] [123456] - 1495720604797 - this is info
ll.log("error", "this is error"); //this will log: [ERROR] [123456] - 1495720604797 - this is error

```

Result will be

![labels](http://i.imgur.com/HBYDIeX.png)

### LogFunction ###

Change the log responsible function. Default is console.log

```js

let myLogFunction = (data) => console.log(`my custom function say ${data}`);

var ll = new LoggerLife({
  logFunction: myLogFunction
});

ll.log("info", "this is info"); //this will log: my custom function say [I] [123456] - 1495720604797 - this is info
ll.log("error", "this is error"); //this will log: my custom function say [E] [123456] - 1495720604797 - this is error

```

Result will be

![logFunction](http://i.imgur.com/zeh9TwX.png)

### FileLog ###

Setup the directory where to write the log files.
setup also which rank of log must be write into a log file.
Logs are generated into different files, one per rank.

```js

var ll = new LoggerLife({
  fileLog: {
    path: __dirname,
    rank: {
      info: false,
      debug: false,
      error: true, // every occurrence of log error is written into __dirname/error.log
      warn: false
    }
  }
});

```

### Handlers ###

The main process events can be logged via LoggerLife library.
These process events are **uncaughtException**, **unhandledRejection**, **warning** and **exit**.
Get a look at NodeJs documentation to know more about that.
Each of them can be configured with a loagAs key, that has to contain as value one of the
4 log rank.
If you pass a boolean true to the process event, this will use a default value.
Only on **uncaughtException** you can specify an exit value (with exitCode key). If you pass false as value to exitCode,
it will not exit as default system behavior (not recommend).

```js

var ll = new LoggerLife({
  handlers: {
    uncaughtException: {
      logAs: "error", // default is error
      exitCode: 1 //if error occurs, the script exit with value 1
    },
    unhandledRejection: true, // default logAs is error
    warning: {
      logAs: "warn" // default is warn
    },
    exit: {
      logAs: "info" // default is debug
    }
  }
});

```
### Interpolation ###

You can change the default ":" as  separator into interpolation on log string content
and you can pass to the system the regexp that match the content to be interpolate

```js

var ll = new LoggerLife({
  interpolation: {
    regexp: /{{*([^}]+)}}/g, //means check all text between "{{" and "}}"
    separator: "||"
  }
});

ll.log("error", "this is {{reverse||error}}");

```

Result will be

![interpolation](http://i.imgur.com/WrrkoQi.png)

### Fabulous ###

Do you need a touch of... fabulous?
You can pass an array of available styles to customize your fabulously fabulous
text, otherwise it will use default values.
Please, use it with careful, especially avoid production environment.
I know, it's hard to resist to such many fabulousness.

```js

var ll = new LoggerLife({
  fabulous: {
    formatColor: [
      "bright.fg_red",
      "bright.fg_yellow",
      "bright.fg_green",
      "bright.fg_cyan",
      "bright.fg_blue",
      "bright.fg_magenta"
    ]
  }
});

ll.log("info", "this is fabulous text!", { fabulous: true });

```

Result will be

![fabulous](http://i.imgur.com/4UjU6XD.png)

## Methods ##

```js

var ll = new LoggerLife();

ll.log("debug", "this is debug");
ll.info("this is info");

```

### Log ###

Log accept 3 parameters: level, content and options.

```js

var ll = new LoggerLife();

ll.log("debug", "this is debug");

ll.log("info", "this is info");
ll.log("info", "this is another info");

ll.log("warn", "this is warn");

ll.log("error", "this is error");
ll.log("error", "this is another error");

ll.log("info", "this is my last info", { fabulous: true });

```

Result will be

![log](http://i.imgur.com/nrh5bOr.png)

### Debug, info, warn and error ###

You can log by using the level as method,
by passing to it the 2 parameters content and options.

```js

var ll = new LoggerLife();

ll.debug("this is debug");

ll.info"this is info");
ll.info("this is another info");

ll.warn("this is warn");

ll.error("this is error");
ll.error("this is another error");

ll.info("this is my last info", { fabulous: true });

```

### Available options for log ###

You can pass options to the log methods: fabulous, say(only available with linux platforms) and formatColors.

```js

var ll = new LoggerLife();

ll.debug("this is debug", {
  fabulous: true // if passed, it will log as fabulous mode
});

ll.log("debug", "this is debug", {
  say: true // if passed as true, it will use the festival library to vocally reproduce the log
});
ll.log("debug", "this is debug", {
  say: "lorem" // if passed as string, it will use the festival library to vocally reproduce the string passed when the log is provided
});

ll.log("debug", "this is debug", {
  formatColors: "reverse" // if passed will change the style only for this log
});

```

Result will be

![Available options for log](http://i.imgur.com/eJMsol9.png)

## Events ##

Events are very useful to execute some arbitrary code every time a log level occurs.
You can add more then one event for each rank or level.

### AddRankAction ###

This event is attached to a specific log rank.It triggers every time a log that rank is performed.

```js

var ll = new LoggerLife();
var counter = 0;

ll.addRankAction("debug", (data) => {
  counter++;
});
ll.addRankAction("info", (data) => {
  counter++;
});
ll.addRankAction("debug", (data) => {
  counter++;
});

ll.debug("this is debug");
ll.info("this is info");
ll.error("this is error");
ll.debug("this is debug");

setTimeout(() => {
  ll.info(`counter is ${counter}`); // counter is 5
}, 1000)

```

Result will be

![addRankAction](http://i.imgur.com/4OSAmqI.png)

### AddLevelAction ###

Same as for addRankAction, but it triggers for every level below the one specified.

```js

var ll = new LoggerLife();
var counter = 0;

ll.addLevelAction("info", (data) => {
  counter++;
});

ll.debug("this is debug");
ll.info("this is info");
ll.error("this is error");
ll.debug("this is debug");

setTimeout(() => {
  ll.info(`counter is ${counter}`); // counter is 2
}, 1000)

```

Result will be

![addLevelAction](http://i.imgur.com/UmRDsdZ.png)
