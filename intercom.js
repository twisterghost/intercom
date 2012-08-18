// Define constants
var VERSION = "1.0.3.0";

// Define variables
var inputStream = parseInput;
var quitNow = false;
var plugin_text = "";
var commands = Array();
var showCommand = 0;
var tempUrl = "";
var parsers = [];
var plugins = [];

// Define constants
var ENTER_KEY = 13;
var UP_KEY = 38
var DOWN_KEY = 40
var WELCOME_MESSAGE = "Welcome to Intercom v." + VERSION;


/**
 * Things to do upon finishing page load.
 */
$(document).ready(function(){
  $('#input').focus();
  o(WELCOME_MESSAGE);

  // Round up addon plugins.
  for (i = 0; i < plugins.length; i++) {
    plugin_text += plugins[i] + "<br />";
  }
});

/**
 * Runs upon every time a key is pressed in #input.
 * Listening for enter key upon which it then runs the current parser
 */
function checkKey(e){
    if (e.keyCode == ENTER_KEY){
        var input = $('#input').val();
        $('#input').val('');
        if (input == "forcequit") {
            outputWithCarrot(input);
            output("Focequitting back to main input stream.");
            inputStream = parseInput;
        } else {
            commands.push(input);
            showCommand = commands.length;
            inputStream(input);
        }
    } else if (e.keyCode == UP_KEY) {
      // Up
      showCommand--;
      if (showCommand <= 0) {
        showCommand = 0;
      }
      $('#input').val(commands[showCommand]);
    } else if (e.keyCode == DOWN_KEY) {
      // Down
      showCommand++;
      if (showCommand >= commands.length) {
        $('#input').val('');
        showCommand = commands.length;
      } else {
        $('#input').val(commands[showCommand]);
      }
    } else {
    }
}

/**
 * Attempts to parse input for main functionality.
 */
function parseInput(input){
    output("&raquo;&nbsp;" + input);
    for (i = 0; i < parsers.length; i++) {
        parsers[i](input);
        if (quitNow) {
            quitNow = false;
            return;
        }
    }
    
    // More info
    if (input == "help" || input == "?") {
        outputHelp();
        return;
    } 
    // Built-in command info
    else if (input == "help -commands") {
        outputHelpCommands();
        return
    }
    // Clear screen
    else if (input == "clear") {
        clearScreen();
        return;
    }
    // Run infile
    else if (checkCommand(input, "ici")) {
      args = extractArguments(input);
      runInfile(args[1]);
      return;
    }
    
    // Open page
    else if (input.substring(0,5) == "open ") {
      if (input.substring(5,12) == "-nofix ") {
        url = input.substring(12);
        openPage(url, true, false);
        return;
      }
      url = input.substring(5);
      openPage(url, false, true);
      return;
    }
    
    // No command found, give error
    output("'" + input + "' is not a valid command or installed plugin." );
    quitNow = false;
}

/**
 * Outputs the help information and lists plugins
 */
function outputHelp() {
    output("Intercom help & documentation");
    output("<br />Intercom is a JavaScript-based web console built for " + 
          "plugins. Each instance of Intercom may have as many or as few " + 
          "plugins as desired.");
    output("Intercom is currently in development stages, please check " + 
          "http://i.amMichael.com for information on release.");
    output("<b>For the list of basic commands, type 'help -commands'</b>");
    output("<br />--------------------------<br />");
    output("This Intercom has the following plugins installed:<br />" + 
          plugin_text);
}

/**
 * Outputs help on built-in commands
 */
function outputHelpCommands() {
  output("Intercom basic commands");
  output("-----------------------");
  output("<b>help</b> - display help message");
  output("<b>clear</b> - clears the content of the screen");
  output("<b>open [URL]</b> - opens the given URL in the console");
}

function openPage(url, ignorehttp, fix) {
  if (fix) {
    if (url.substring(0,3) == "www") {
      output("Notice: requested address WAS " + url + ", adding 'http://' " + 
        "in front. Use open -nofix to stop this.");
      url = "http://" + url;
    }
    if (!ignorehttp && url.substring(0,4) != "http") {
      tempUrl = url;
      output("The requested URL to open is not a valid http request. " + 
            "Open anyway?");
      output("y/n/(a)dd http:// in front");
      setInputStream(openPageCheckUrl);
      return;
    }
  }
  output("<iframe src='" + url + "' width='100%' height='80%'>");
}

/**
 * Opens a page after taking modification commands
 */
function openPageCheckUrl(input) {
  if (input == "y" || input == "yes") {
    resetInputStream();
    openPage(tempUrl, true, true);
  } else if (input == "n" || input == "no") {
    resetInputStream();
    output("Action aborted.");
  } else if (input == "a") {
    resetInputStream();
    openPage("http://" + tempUrl);
  }
}

// Begin API functions

/*
 * Adds a plugin name to the list of installed plugins
 */
function identifyPlugin(title) {
  plugins.push(title);
}

/*
 * Adds a parser to the preparsing list
 */
function addParser(parser) {
  parsers.push(parser);
}
  
/**
 * Outputs the given text with the marker in front
 * DEPRECATED
 */
function outputWithCarrot(text) {
    $('#output').append("&raquo;&nbsp;" + text + "<br />");
    $(window).scrollTop($(document).height());
}

/**
 * Clears the output screen
 */
function clearScreen() {
    $('#output').html('');
}

/**
 * Serves as a null function
 */
function none(input) {
  // Blank!
}

/**
 * Displays the given text on the output of the console
 */
function output(text, style, carrot){
    // Style option
    style = typeof(style) != 'undefined' ? style : "";
    carrot = typeof(carrot) != 'undefined' ? carrot : false;
    if (carrot) {
      $('#output').append("&raquo;&nbsp;<span class='" + style + "'>" + text + 
          "</span><br />");    
    } else {
      $('#output').append("<span class='" + style + "'>" + text + 
          "</span><br />");
    }
    $(window).scrollTop($(document).height());
}

/**
 * Quick version of 'output'. Does not allow style or carrot.
 */
function o(text) {
  output(text);
}

/**
 * Ends parsing if called in a non-main parser
 */
function quitParse() {
    quitNow = true;
}

/**
 * Switches the input stream to a different parser
 */
function setInputStream(newStream) {
    inputStream = newStream;
}

/**
 * Set the input stream back to the main parser
 */
function resetInputStream() {
    inputStream = parseInput;
    quitNow = false;
}

/**
 * Does a post call to url with the given params array, outputs the return data
 */
function outputPostCall(url, params) {
  setInputStream(none);
  $.post(url, params, function(data) {
        output(data);
        resetInputStream();
      });
}

/**
 * Does a post call to url with the given params array, returns the
 * return data
 */
function returnPostCall(url, params) {
  setInputStream(none);
  $.post(url, params, function(data) {
        return data;
        resetInputStream();
      });
}

/**
 * Extracts the user defined flags in a given line of input.
 * Returns an associative array of flag=value, where value is true if the
 * flag is a boolean on/off.
 */
function extractFlags(input) {
  flags_array = Array();
  while (input.indexOf("-") != -1) {
    // Cut to the dash
    input = input.substring(input.indexOf("-") + 1);
    
    // Is there an = sign?
    isQuotedValue = input.indexOf('="');
    isSingleQuotedValue = input.indexOf("='");
    nextEquals = input.indexOf("=");
    nextSpace = input.indexOf(" ");
    
    if (nextSpace == -1) {
      nextSpace = input.length;
    }
    
    // If there is the =" pair and it is followed by a "
    if (isQuotedValue != -1 && 
        isQuotedValue < input.substring(isQuotedValue+2).indexOf('"')) {

      // Its a value pair
      key = input.substring(0, isQuotedValue);
      value = input.substring(isQuotedValue+2, (isQuotedValue+2) + 
          input.substring(isQuotedValue+2).indexOf('"'));
      flags_array[key] = value;
    
    } else if (isSingleQuotedValue != -1 && 
        isSingleQuotedValue < 
            input.substring(isSingleQuotedValue+2).indexOf("'")) {
      // Its a value pair
      key = input.substring(0, isSingleQuotedValue);
      value = input.substring(isSingleQuotedValue+2, (isSingleQuotedValue+2) + 
          input.substring(isSingleQuotedValue+2).indexOf("'"));
      flags_array[key] = value;
    
    } else if (nextEquals != -1 && nextEquals < nextSpace) {
      // Its a value pair

      key = input.substring(0, nextEquals);
      value = input.substring(nextEquals+1, nextSpace);
      flags_array[key] = value;
      
    } else {
      // Just a flag
      key = input.substring(0, nextSpace);
      flags_array[key] = true;
    }  
    
  }
  return flags_array;
}

/**
 * Given a flags object (see: extractFlags) and a flag, returns true if the
 * flag exists in the set of flags.
 */
function hasFlag(flags, find) {
  return find in flags;
}

/**
 * Returns the number of user defined flags
 */
function countFlags(flags) {
  return Object.keys(flags).length;
}

/**
 * Returns the value of a user defined flag
 */
function flagValue(flags, key) {
  if (hasFlag(flags, key)) {
    return flags[key];
  } else {
    return false;
  }
}

/**
 * Returns true if the input command matches command
 */
function checkCommand(input, command) {
  input = $.trim(input);
  matcherTrim = input.split(' ');
  matcherPart = matcherTrim[0];
  if (matcherPart == command) {
    return true;
  } else {
    return false;
  }
}

/**
 * Returns an array of arguments from the given input
 */
function extractArguments(input) {
  input = $.trim(input);
  matcherTrim = input.split(' ');
  returnArr = Array();
  for (argCount = 0; argCount < matcherTrim.length; argCount++) {
    if (matcherTrim[argCount].substring(0, 1) != "-") {
      returnArr.push(matcherTrim[argCount]);
    }
  }
  return returnArr;
}

/**
 * Includes the given filepath by writing the html
 */
function include(filepath) {
  document.write("<script type='text/javascript' src='" + filepath + "'>" + 
      "</script>");
}

/**
 * Runs a given command in the console
 */
function run(command) {
  console.log("Run: " + command);
  inputStream(command.toString());
}

/**
 * Loads and runs a given Infile.
 */
function runInfile(path) {

  $.get(path, function(fileContents) {
    if (fileContents == null) {
      o("The given path returned empty.");
      return;
    }
    
    fileContents = fileContents.split("\n");
    for (line in fileContents) {
      run(fileContents[line]);
    }
  });
}

/**
 * Prints debug information
 */
function debug() {
  output("DEBUG INFORMATION", "error");
  output("=================", "error");
  output("Version: " + VERSION, "error");
  output("Input stream: " + inputStream, "error");
  output("Command history: ", "error");
  for (command in commands) {
    output(commands[command], "error");
  }
  output("Active parsers:", "error");
  for (parser in parsers) {
    output(parsers[parser], "error");
    output("===========", "error");
  }
}

/**
 * Objects
 */
 
/**
 * HelpText object
 * 
 * Holds functions to generate a helptext string following the standard format.
 * This object is to be used by modules to keep a level of standards when 
 * writing helptext outputs.
 */
function HelpText() {
  this.intro = "";
  this.flags = "<b>Flags:</b><br />";
  this.commands = "<b>Commands:</b><br />";
  this.misc = "";
  this.getHelpText = function() {
    return this.intro + "<br />" + this.flags + "<br />" + this.commands + 
        "<br />" + this.misc;
  }
  this.addFlag = function(flag, desc) {
    this.flags += "-" + flag + " : " + desc + "<br />";
  }
  this.addCommand = function(command, desc) {
    this.commands += command + " : " + desc + "<br />";
  }
  this.addMisc = function(toAdd) {
    this.misc += toAdd;
  }
  this.setIntro = function(newIntro) {
    this.intro = newIntro;
  }
  this.toString = function() {
    return this.getHelpText();
  }
}
