https://bitbucket.org/tutorials/markdowndemo

# Log-Life #

Log Life is a logging library that provides you multiple log methods, string interpolations for messages, catching of main error and warning events.

### Usage example ###


```

#!javascript

const LogLife = require("./LogLife.class.js");

var ll = new LogLife();

ll.log("info", "Hi! I'm info log level");
ll.info("Hi! Also I'm info log level");

```