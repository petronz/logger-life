"use strict";

/*jshint esversion: 6 */

/*
* Here goes privates functions and variables
*/
const privates = {

  print: function(content, color = "", level = false, options) {

    var self = this;
    var list = [];
    var item;
    var mainColor = self.colors.reset;

    while(item = this.interpolation.regexp.exec(content)) {
      max--;
      if(max <= 0) { break }
      list.push(item);
    }

    content = {
      colored: content,
      unformatted: content
    };

    if(options.formatColors) {
      color = options.formatColors;
    }

    for(let c of color.split(".")) {
      mainColor = (typeof self.colors[c] !== typeof undefined) ? `${mainColor}${self.colors[c]}` : mainColor;
    }

    var max = 200;

    var elaborate = function(content, item) {

      let element = item[1].split(self.interpolation.separator);

      element = {
        colors: (element.length > 1) ? element[0] : "",
        phrase: (element.length > 1) ? element[1] : element[0]
      }

      let result = { unformatted: content.unformatted.replace(`${item[0]}`, `${element.phrase}`) }

      for(let color of element.colors.split(".")) {
        element.phrase = (typeof self.colors[color] !== typeof undefined) ? `${self.colors[color]}${element.phrase}` : element.phrase;
      }
      result.colored = content.colored.replace(`${item[0]}`, `${element.phrase}${mainColor}`);

      return result;

    }
    for(item of list) {
      content = elaborate(content, item);
    }
    if(options.fabulous) {
      content.colored = privates.fabulous.call(self, content.unformatted);
    }

    self.formatText = (typeof self.formatText === typeof "string") ? self.formatText : "%levelLabel %pidLabel %date - %content";
    content.formatted = self.formatText;

    let result =  {
      content: content.colored,
      level: level,
      date: new Date(),
      pid: process.pid,
      tags: self.tags
    };
    for(let formatAction in self.formatActions) {

      if(self.formatText.includes(formatAction)) {

        let s = self.formatActions[formatAction](result);
        let re = new RegExp(`%${formatAction}`, 'g');
        content.formatted = content.formatted.replace(re, s);

      }

    }

    content.formatted = `${mainColor}${content.formatted}${self.colors.reset}`;
    delete content.colored;

    this.logFunction(content.formatted);

    result.content = content;

    return result;

  },
  _say: require(`${__dirname}/say.js`),
  _fs: require('fs'),
  say: function(text, queue, force = false) {

    var self = this;

    if(!queue.length || force) {

      if(!force) {
        queue.push(text);
      }
      this._say.speak(text, 1.2, function(err) {
        if (err){
          return console.error(err);
        }
        queue.shift();
        if(!!queue.length) {
          self.say(queue[0], queue, true);
        }
      });

    } else if(!force) {
      queue.push(text);
    }

  },
  fabulous: function(content) {

    var result = "";
    var mainColor = this.colors.reset;
    var exitSafe = content.length;
    var counter = 0;

    for(let i = 0; i <= content.length - 1; i++) {

      if(counter > exitSafe) {
        console.warn("fabulous has something wrong, exit");
        break;
      }

      let color = "";

      if(content[i] == " ") {

        let c1 = content.slice(0, i);
        let c2 = content.slice(i, content.length).replace(" ", "");
        i--;
        content = c1+c2;
        result += " ";

      } else {

        for(let c of this.fabulizer[i%this.fabulizer.length].split(".")) {
          color += this.colors[c];
        }
        result += `${color}${content[i]}`;

      }
      counter++;

    }

    return `${this.colors.reset}${result}`;

  },
  setupHandlers: function(handlers) {

    if(typeof handlers === typeof undefined) {
      return false;
    }

    for(let name in handlers) {
      let fn = this.handlers[name].constructor(handlers[name].logAs || undefined, handlers[name].exitCode)
      process.on(name, fn);
    }

    return true;

  },
  writeFile: function(level, content, options = {}) {

    if(!!options.fullPath) {

      var logFilePath = options.fullPath;

    } else {

      let path = !!options.path ? options.path : this.fileLog.path;
      let fileName = !!options.fileName ? options.fileName : level;
      let extension = !!options.extension ? options.extension : "log";

      var logFilePath = `${path}/${fileName}.${extension}`;

    }

    privates._fs.appendFileSync(logFilePath, `${content}\n`);

  },
  is_object: function(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
  },
  deep_merge: function(target, ...sources) {

    if(!sources.length) return target;
    const source = sources.shift();
    if(this.is_object(target) && this.is_object(source)) {
      for(const key in source) {
        if(this.is_object(source[key])) {
          if (!target[key]) Object.assign(target, { [key]: {} });
          this.deep_merge(target[key], source[key]);
        } else {
          Object.assign(target, { [key]: source[key] });
        }
      }
    }
    return this.deep_merge(target, ...sources);
  }

};

/*
* LoggerLife class
*/
class LoggerLife {

  constructor (options = {
    level: "debug",
    formatColors: {},
    labels: {},
    formatText: "%levelLabel %pidLabel %date %tags- %content",
    logFunction: console.log,
    fileLog: {
      path: ".",
      rank: {
        info: false,
        debug: false,
        error: false,
        warning: false
      }
    },
    tags: [],
    tags_max_pad: 30,
    fabulous: {
      formatColors: []
    }
  }) {

    var self = this;

    this.id = ("00000"+Math.floor((Math.random()*10000))).slice(-5);

    this._options = options;

    this.colors = {
      none: "",
      reset: "\x1b[0m",
      bright: "\x1b[1m",
      dim: "\x1b[2m",
      underscore: "\x1b[4m",
      reverse: "\x1b[7m",
      hidden: "\x1b[8m",
      fg_black: "\x1b[30m",
      fg_red: "\x1b[31m",
      fg_green: "\x1b[32m",
      fg_yellow: "\x1b[33m",
      fg_blue: "\x1b[34m",
      fg_magenta: "\x1b[35m",
      fg_cyan: "\x1b[36m",
      fg_white: "\x1b[37m",
      fg_crimson: "\x1b[38m",
      bg_black: "\x1b[40m",
      bg_red: "\x1b[41m",
      bg_green: "\x1b[42m",
      bg_yellow: "\x1b[43m",
      bg_blue: "\x1b[44m",
      bg_magenta: "\x1b[45m",
      bg_cyan: "\x1b[46m",
      bg_white: "\x1b[47m",
    };

    this.logFunction = options.logFunction || console.log;

    this.labels = {
      warn: "[W]",
      info: "[I]",
      error: "[E]",
      debug: "[D]"
    };

    for(let label in options.labels) {
      if(typeof this.labels[label] !== typeof undefined) {
        this.labels[label] = options.labels[label];
      }
    }

    this.formatColors = {
      warn: "fg_yellow",
      info: "fg_green",
      error: "fg_red",
      debug: "dim"
    }

    for(let level in options.formatColors) {
      if(typeof this.formatColors[level] !== typeof undefined) {
        this.formatColors[level] = options.formatColors[level];
      }
    }

    /*need to be ordered*/
    this.levelsDependencies = [
      "debug",
      "info",
      "warn",
      "error"
    ];

    if(!!options.level && typeof this.levelsDependencies.includes(options.level) != typeof undefined) {
      let i = this.levelsDependencies.indexOf(options.level);
      this.levelsDependencies = this.levelsDependencies.splice(i, this.levelsDependencies.length);
    }

    this.actionsPerformer = {
      debug: [],
      warn: [],
      error: [],
      info: []
    };

    this.tags = options.tags || [];

    this.max_pad = options.tags_max_pad;

    if(options.tags_max_pad === false) {
      this.max_pad = false;
    } else if(!options.tags_max_pad || typeof options.tags_max_pad === typeof 0) {
      this.max_pad = options.tags_max_pad || 30;
    } else {
      this.max_pad = 30;
    }

    if(this.max_pad !== false) {
      let t = "";
      while(this.max_pad-- >= 0) t += " ";
      this.max_pad = t;
    }

    this.formatText = options.formatText || "%levelLabel %pidLabel %date %tags- %content";
    this.formatActions = options.formatActions ||  {};

    Object.assign(this.formatActions, {
      content: ({content}) => { return content },
      levelLabel: ({level}) => { return self.labels[level] || "" },
      date: ({date}) => { return date },
      pidLabel: ({pid}) => { return `[PID:${pid}]` },
      tags: ({tags}) => {
        // if(!tags.length) return "";
        tags = tags.map(tag => `[${tag.toString().trim().toUpperCase()}]`).join(" ");
        return (this.max_pad === false || tags.length >= this.max_pad.length) ?
          tags+" " :
          (this.max_pad + tags).slice(-1*this.max_pad.length)+" ";
      },
    });

    this.fileLog = options.fileLog || {
      path: ".",
      rank: {
        info: false,
        debug: false,
        error: false,
        warning: false
      }
    };

    this.fabulizer = (!!options.fabulous && Array.isArray(options.fabulous.formatColor)) ? options.fabulous.formatColor : [
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
    ];

    this.handlers = {
      uncaughtException: {
        constructor: (logType = "error", exitCode = 1) => {
          return (data) => {
            self.log(logType, `stack: ${data.stack}`);
            if(exitCode !== false) {
              process.exit((typeof exitCode === typeof 0) ? exitCode : 1);
            }
          }
        }
      },
      unhandledRejection: {
        constructor: (logType = "error") => {
          return (reason, promise) => {
            self.log(logType, `Unhandled Rejection at: Promise ${promise} reason: ${reason}`);
          }
        }
      },
      warning: {
        constructor: (logType = "warn") => {
          return (data) => {
            self.log(logType, `name: ${data.name}`);
            self.log(logType, `message: ${data.message}`);
            self.log(logType, `stack: ${data.stack}`);
          }
        }
      },
      exit: {
        constructor: (logType = "debug") => {
          return (code) => {
            self.log(logType, `exit with message code ${code}`);
          }
        }
      }
    }

    privates.setupHandlers.call(this, options.handlers);

    this._sayQueue = [];

    this.interpolation = {
      regexp: false,
      separator: ":"
    };
    for(let interpolation in options.interpolation) {
      if(typeof this.interpolation[interpolation] !== typeof undefined) {
        this.interpolation[interpolation] = options.interpolation[interpolation];
      }
    }
    this.interpolation.regexp = (!!this.interpolation.regexp) ? this.interpolation.regexp : /\[\[*([^\]]+)\]\]/g;

  }

  get availableColors() {
    return Reflect.ownKeys(this.colors);
  }

  clone(new_options = {}) {
    return new LoggerLife(privates.deep_merge(Object.assign({}, this._options), new_options));
  }

  addTag(tag) {
    if(Array.isArray(tag)) {
      this.tags = tag.map(t => t.toString()).concat(this.tags);
    } else if(!this.tags.includes(tag.toString())) {
      this.tags.unshift(tag.toString());
    }
    return this;
  }
  removeTag(tag) {
    if(Array.isArray(tag)) {
      for(let t of tag) {
        if(typeof t === typeof 0 && typeof this.tags[t] !== typeof undefined) {
          this.tags.splice(t, 1);
        } else if(this.tags.includes(t)) {
          this.tags.splice(this.tags.indexOf(t), 1);
        }
      }
    } else if(typeof tag === typeof 0 && typeof this.tags[tag] !== typeof undefined) {
      this.tags.splice(tag, 1);
    } else if(this.tags.includes(tag)) {
      this.tags.splice(this.tags.indexOf(tag), 1);
    }
    return this;
  }
  emptyTags() {
    this.tags = [];
    return this;
  }
  getTags() {
    return this.tags;
  }

  addLevelAction(level, action) {

    var levelsDependencies = this.levelsDependencies;

    if(this.levelsDependencies.includes(level)) {

      for(let i = this.levelsDependencies.indexOf(level); i <= this.levelsDependencies.length - 1; i++) {
        let l = this.levelsDependencies[i];
        this.actionsPerformer[l].push(action);
      }

    }

  }

  addRankAction(level, action) {

    if(this.levelsDependencies.includes(level)) {
      this.actionsPerformer[level].push(action);
    }

  }

  log(level, content, options = {}) {

    if(!this.levelsDependencies.includes(level)) {
      return false;
    }

    content = privates.print.call(this, content, options.formatColor || this.formatColors[level], level, options);

    if(this.actionsPerformer[level].length) {
      for(let action of this.actionsPerformer[level]) {
        action(content);
      }
    }

    if(!!this.fileLog.rank && !!this.fileLog.rank[level]) {

      if(typeof this.fileLog.rank[level] === typeof true) {

        privates.writeFile.call(this, level, content.content.formatted);

      } else if(typeof this.fileLog.rank[level] === typeof "string") {

        privates.writeFile.call(this, this.fileLog.rank[level], content.content.formatted);

      } else if(Array.isArray(this.fileLog.rank[level])) {

        for(let log of this.fileLog.rank[level]) {
          privates.writeFile.call(this, level, content.content.formatted, log);
        }

      }

    } else if(typeof this.fileLog === typeof "string") {

      privates.writeFile.call(this, level, content.content.formatted, {
        fullPath: this.fileLog
      });

    }

    if(options.say === true) {
      privates.say(content.content.unformatted, this._sayQueue)
    } else if(!!options.say && typeof options.say == typeof "string") {
      privates.say(options.say, this._sayQueue)
    }

  }

  info(content, options = {}) {

    let level = "info";
    if(!this.levelsDependencies.includes(level)) {
      return false;
    }
    this.log(level, content, options);

  }

  warn(content, options = {}) {

    let level = "warn";
    if(!this.levelsDependencies.includes(level)) {
      return false;
    }

    this.log(level, content, options);

  }

  error(content, options = {}) {

    let level = "error";
    if(!this.levelsDependencies.includes(level)) {
      return false;
    }

    this.log(level, content, options);

  }

  debug(content, options = {}) {

    let level = "debug";
    if(!this.levelsDependencies.includes(level)) {
      return false;
    }

    this.log(level, content, options);

  }

}

module.exports = LoggerLife;
