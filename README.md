# LogLife #

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

## Interpolations ##

In case you want to change the color, underline or apply a bold
some portions of text you can do it by using the interpolation.
The string that has to be logged interpret the text between [[]].
the content inside of it is splitted if a ":" is found.
In this case, the part before ":" are the color style that has to be
applied to the part after ":"

```
#!javascript

var ll = new LogLife();

ll.log("info", "Hi! I'm [[reverse:info]] log level"); // the info word will be color reversed
ll.log("error", "Hi! I'm [[bg_red.fg_white:error]] log level"); // the error word will be foreground color in white and background colored in red

```

## Available colors and styles ##

#### text styles ####

* reset
* bright
* dim
* underscore
* reverse
* hidden

#### foreground colors ####

* fg_black
* fg_red
* fg_green
* fg_yellow
* fg_blue
* fg_magenta
* fg_cyan
* fg_white
* fg_crimson

#### backgrund colors ####

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
  interpolation: {
    separator: "||",
    regexp: false
  }
});

```

## Configuration explanation ##

### Level ###

LogLife provides you 4 log-levels: **debug**, **info**, **warn**, **error**.

```
#!javascript

var ll = new LogLife({
  level: "warn"
});

ll.log("warn", "this is warning"); //this will be logged
ll.log("error", "this is error"); //this will be logged

ll.log("debug", "this is debug"); //this will not be logged

```
### formatText and formatActions ###

formatText provides you the possibility to fully customize
the logged text. Default interpolation methods are: **%level**, **%pid**, **%date** and **%content**.
You can add custom interpolation methods with formatActions.

```
#!javascript

var ll = new LogLife({
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
### formatColors ###

Change the default color of the 4 log levels.

```
#!javascript

var ll = new LogLife({
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

### labels ###

Change the default labels of the 4 log levels.

```
#!javascript

var ll = new LogLife({
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

### logFunction ###

Change the log responsible function. Default is console.log

```
#!javascript

let myLogFunction = (data) => console.log(`my custom function say ${data}`);

var ll = new LogLife({
  logFunction: myLogFunction
});

ll.log("info", "this is info"); //this will log: my custom function say [I] [123456] - 1495720604797 - this is info
ll.log("error", "this is error"); //this will log: my custom function say [E] [123456] - 1495720604797 - this is error

```

### fileLog ###

Setup the directory where to write the log files.
setup also which rank of log must be write into a log file.
Logs are generated into different files, one per rank.

```
#!javascript

var ll = new LogLife({
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

### handlers ###

The main process events can be logged via LogLife library.
These process events are **uncaughtException**, **unhandledRejection**, **warning** and **exit**.
Get a look at NodeJs documentation to know more about that.
Each of them can be configured with a loagAs key, that has to contain as value one of the
4 log rank.
If you pass a boolean true to the process event, this will use a default value.
Only on **uncaughtException** you can specify an exit value (with exitCode key). If you pass false as value to exitCode,
it will not exit as default system behavior (not recommend).

```
#!javascript

var ll = new LogLife({
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
### interpolation ###

You can change the default ":" as  separator into interpolation on log string content
and you can pass to the system the regexp that match the content to be interpolate

```
#!javascript

var ll = new LogLife({
  interpolation: {
    regexp: /{{*([^}]+)}}/g, //means check all text between "{{" and "}}"
    separator: "||"
  }
});

ll.log("error", "this is {{reverse||error}}");

```

### fabulous ###

Do you need a touch of... fabulous?
You can pass an array of available styles to customize your fabulously fabulous
text, otherwise it will use default values.
Please, use it with careful, especially avoid production environment.
I know, it's hard to resist to such many fabulousness.

```
#!javascript

var ll = new LogLife({
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
