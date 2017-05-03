const Logger = require("./Logger.class.js");

var logger = new Logger({
  formatColors: {
    warn: "reverse.fg_magenta.bg_yellow"
  },
  logFunction: console.log,
  formatText: "%level %customDate - %content ",
  formatActions: {
    customDate: (options) => {
      return options.date.toISOString();
    }
  },
  labels: {
    warn: "[WARNING] "
  },
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

logger.addRankAction("debug", (data) => {
  console.log("PROVIDED A DEBUG");
})

logger.log("debug", "ciao [[reverse:sono]] il debug brutto, perchè nessuno mi vuole");

logger.log("info", "ciao info il piu bello di [[blink.underscore.fg_red:tutti]] perchè di solito tutti possono leggermi");
logger.log("info", "ciao info il piu bello di [[reverse:tutti]] perchè di solito tutti possono leggermi");

logger.log("warn", "ciao sono il warn bello, ma oggi potrebbe essere una brutta giornata");

logger.log("error", "ciao sono l'errore bello");
