"use strict"

/*jshint esversion: 6 */


class Logger {

  constructor (options = {
    level: "debug",
    formatColors: {},
    labels: {},
    formatText: ["content"],
    logFunction: console.warn,
    regexp: false,
    fileLog: {
      path: ".",
      level: {
        info: false,
        debug: false,
        error: false,
        warning: false
      }
    },
    fabulous: {
      formatColors: []
    }
  }) {

    var self = this;

    this.fs = require("fs");

    this.colors = {
      none: "",
      reset: "\x1b[0m",
      bright: "\x1b[1m",
      dim: "\x1b[2m",
      underscore: "\x1b[4m",
      blink: "\x1b[5m",
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
      bg_crimson: "\x1b[48m"
    };

    this.logFunction = options.logFunction || console.log;

    this.labels = {
      log: "[L]",
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

    this.formatText = options.formatText || "%level %date - %content";
    this.formatActions = options.formatActions ||  {};

    Object.assign(this.formatActions, {
      content: ({content}) => { return content },
      level: ({level}) => { return self.labels[level] || "" },
      date: ({date}) => { return date }
    });

    this.regexp = options.regexp || /\[\[*([^\]]+)\]\]/g;

    this.fileLog = options.fileLog || {
      path: ".",
      level: {
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

  }

  get availableColors() {
    return Reflect.ownKeys(this.colors);
  }

  fabulous(content) {

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

  print(content, color = "", level = false, options) {

    var self = this;
    var list = [];
    var item;
    var mainColor = self.colors.reset;

    while(item = this.regexp.exec(content)) {
      max--;
      if(max <= 0) { break }
      list.push(item);
    }

    content = {
      colored: content,
      unformatted: content
    };

    for(let c of color.split(".")) {
      mainColor = (typeof self.colors[c] !== typeof undefined) ? `${mainColor}${self.colors[c]}` : mainColor;
    }

    var max = 200;

    var elaborate = function(content, item) {

      let element = item[1].split(":");

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
      content.colored = self.fabulous(content.unformatted);
    }

    content.formatted = self.formatText;

    let result =  {
      content: content.colored,
      level: level,
      date: new Date()
    };

    for(let formatAction in self.formatActions) {

      if(self.formatText.includes(formatAction)) {

        let s = self.formatActions[formatAction](result)
        let re = new RegExp(`%${formatAction}`, 'g');
        content.formatted = content.formatted.replace(re, s);

      }

    }

    content.formatted = `${mainColor}${content.formatted}${self.colors.reset}`;
    delete content.colored;

    this.logFunction(content.formatted);

    result.content = content;

    return result;

  }

  log(level, content, options = {}) {

    if(Reflect.ownKeys(this.formatColors).includes(level) && typeof this[level] === typeof ( () => {} )) {
      this[level](content, options);
    }

  }
  info(content, options = {}) {

    let level = "info";
    if(!this.levelsDependencies.includes(level)) {
      return false;
    }

    content = this.print(content, options.formatColor || this.formatColors[level], level, options);

    if(this.actionsPerformer[level].length) {
      for(let action of this.actionsPerformer[level]) {
        action(content);
      }
    }

    if(!!this.fileLog.level[level]) {
      this.writeFile(level, content.content.formatted)
    }

  }
  warn(content, options = {}) {
    let level = "warn";
    if(!this.levelsDependencies.includes(level)) {
      return false;
    }

    content = this.print(content, options.formatColor || this.formatColors[level], level, options);

    if(this.actionsPerformer[level].length) {
      for(let action of this.actionsPerformer[level]) {
        action(content);
      }
    }
    if(!!this.fileLog.level[level]) {
      this.writeFile(level, content.content.formatted)
    }

  }
  error(content, options = {}) {

    let level = "error";
    if(!this.levelsDependencies.includes(level)) {
      return false;
    }

    content = this.print(content, options.formatColor || this.formatColors[level], level, options);

    if(this.actionsPerformer[level].length) {
      for(let action of this.actionsPerformer[level]) {
        action(content);
      }
    }
    if(!!this.fileLog.level[level]) {
      this.writeFile(level, content.content.formatted)
    }

  }
  debug(content, options = {}) {

    let level = "debug";
    if(!this.levelsDependencies.includes(level)) {
      return false;
    }

    content = this.print(content, options.formatColor || this.formatColors[level], level, options);

    if(this.actionsPerformer[level].length) {
      for(let action of this.actionsPerformer[level]) {
        action(content);
      }
    }
    if(!!this.fileLog.level[level]) {
      this.writeFile(level, content.content.formatted)
    }

  }

  writeFile(level, content) {
    this.fs.appendFileSync(`${this.fileLog.path}/${level}.log`, `${content}\n`);
  }

}

module.exports = Logger;
