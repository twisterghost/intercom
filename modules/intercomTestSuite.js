identifyPlugin("test");
addParser(test_hook);

test_version = "1.0.0.0";

// Generate helptext with the HelpText object
test_helpText = new HelpText();

// Flags
test_helpText.addFlag("c", "Command line intercom Parser");

// Commands
test_helpText.addCommand("dump", "Dump debug information");

// Information
test_helpText.setIntro("This module is a standard tool designed to help test " +
    "and debug Intercom modules.<br />Version: " + test_version);

function test_hook(input) {
  
  if (checkCommand(input, "test")) {
    test_args = extractArguments(input);
    test_flags = extractFlags(input);
    
    if (hasFlag(test_flags, "c")) {
      setInputStream(test_commands);
      output("Entering command line execution. Enter 'quit' to exit.");
    } else if (test_args[1] == "dump") {
      debug();
    } else {
      output(test_helpText.getHelpText());
    }
    
    quitParse();
  }


}

function test_commands(input) {
  if (input == "quit") {
    output(input);
    resetInputStream();
    output("Quitting command line execution and resetting input stream.");
  } else {
    output(input, "", true);
    eval(input);
  }
}
