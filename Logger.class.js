/*jshint esversion: 6 */

class Logger {

  constructor (options = {
    level: "debug",
    formatColors: {},
    labels: {},
    formatText: ["content"],
    logFunction: console.log,
    regexp: false
  }) {

    var self = this;

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

  print(content, color = "", level = false) {

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

    content.formatted = self.formatText;

    let options =  {
      content: content.colored,
      level: level,
      date: new Date()
    };

    for(let formatAction in self.formatActions) {

      if(self.formatText.includes(formatAction)) {

        let s = self.formatActions[formatAction](options)
        let re = new RegExp(`%${formatAction}`, 'g');
        content.formatted = content.formatted.replace(re, s);

      }

    }

    content.formatted = `${mainColor}${content.formatted}${self.colors.reset}`;
    delete content.colored;

    this.logFunction(content.formatted);

    options.content = content;

    return options;

  }

  log(level, content) {

    if(Reflect.ownKeys(this.formatColors).includes(level)) {
      this[level](content);
    }

  }
  info(content) {

    let level = "info";
    if(!this.levelsDependencies.includes(level)) {
      return false;
    }

    content = this.print(content, this.formatColors[level], level);

    if(this.actionsPerformer[level].length) {
      for(let action of this.actionsPerformer[level]) {
        action(content);
      }
    }

  }
  warn(content) {
    let level = "warn";
    if(!this.levelsDependencies.includes(level)) {
      return false;
    }

    content = this.print(content, this.formatColors[level], level);

    if(this.actionsPerformer[level].length) {
      for(let action of this.actionsPerformer[level]) {
        action(content);
      }
    }

  }
  error(content) {

    let level = "error";
    if(!this.levelsDependencies.includes(level)) {
      return false;
    }

    content = this.print(content, this.formatColors[level], level);

    if(this.actionsPerformer[level].length) {
      for(let action of this.actionsPerformer[level]) {
        action(content);
      }
    }

  }
  debug(content) {

    let level = "debug";
    if(!this.levelsDependencies.includes(level)) {
      return false;
    }

    content = this.print(content, this.formatColors[level], level);

    if(this.actionsPerformer[level].length) {
      for(let action of this.actionsPerformer[level]) {
        action(content);
      }
    }

  }

}

module.exports = Logger;
