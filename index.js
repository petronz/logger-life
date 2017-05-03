var Logger = require("./Logger.class.js");
var logger = new Logger({
  formatColors: {
    warn: "reverse.fg_magenta.bg_yellow"
  },
  logFunction: console.log,
  formatSeparator: " ",
  formatText: [
    "level",
    (options) => {
      return options.date.toISOString();
    },
    "content" ],
  labels: {
    warn: "[WARNING] "
  }
});

logger.log("debug", "ciao sono il debug brutto, perchè nessuno mi vuole");

logger.log("info", "ciao info il piu bello di [[fg_red:tutti]] perchè di solito tutti possono leggermi");

// logger.log("warn", "ciao sono il warn bello, ma oggi potrebbe essere una brutta giornata");
//
// logger.log("error", "ciao sono l'errore bello");

"%timestamp / %error_level_extended / %content"
