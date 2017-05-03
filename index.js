var Logger = require("./Logger.class.js");
var Logger = new Logger({
  level: "debug"
});

Logger.log("warn", "this is warning");
Logger.log("error", "this is error");
Logger.log("info", "this is info");
Logger.log("debug", "this is debug");

// Logger.warn("something to warn!");
// Logger.info("something to info!");
// Logger.error("something to error!");
// Logger.debug("something to debug!");
