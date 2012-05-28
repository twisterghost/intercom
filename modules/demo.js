// First, we identify our plugin with identifyPlugin(<plugin name>)
identifyPlugin("demo");

// This allows intercom to list our plugin when the user executes 'help'
// Then, we add our 'hook' parser to the parser list, which lets intercom run
// user input by our function when entered. This way, we can parse user input
// when it is meant for our module.
addParser(demo_hook);

// Here we declare a simple helptext variable which we will use later. It is 
// useful to have a helptext for a program which requires argumenrs or flags.
demo_helpText = "<strong>Welcome to the <i>intercom</i> demo.</strong><br />" + 
  "To run the demo parser, use 'demo run'";

// Other random variables
demo_step = 0;

// This is our hook function. This will be run whenever a user enters input.
// This function should look for initiating calls and act accordingly.
// Here, we have our hook print the helptext when there are no arguments,
// or enter the parser for the demo if the argument 'run' is included.
function demo_hook(input) {

  // Check the command. The command is what comes before the first space in a
  // input string. We check to see if it equals "demo".
  if (checkCommand(input, "demo")) {
  
    // quitParse() ends intercom's standard parse.
    quitParse();
    
    // Save the arguments and flags to variables
    demo_arguments = extractArguments(input);
    demo_flags = extractFlags(input);
    
    // No arguments -- display help
    if (demo_arguments.length == 1) {
      output(demo_helpText);
    }
    
    // Check for other args, if it equals "run" it will enter the demo_parser
    // input stream.
    else if (demo_arguments[1] == "run") {
      setInputStream(demo_parser);
      output("The Demo parser is now active! To quit, use the <i>forcequit</i>"+
        " command.<br />" + 
        "So now, try setting a flag! Type 'demo -f'");
    }
  }
}

// This is our custom input stream. It has to take a single paramater which
// intercom will use to send all user input directly to the input stream
// once set.
function demo_parser(input) {
  output(input);
  demo_arguments = extractArguments(input);
  demo_flags = extractFlags(input);
  
  // Last demo step
  if (demo_step == 2) {
    output("Your two arguments were:");
    output(demo_arguments[1]);
    output(demo_arguments[2]);
    output("That's the end of this quick demo, but there's so much more you" + 
      " can do!<br />With the right mix of JS, JSON and Ajax, intercom plugins"+ 
      " have endless possibilities.");
   output("Quitting the demo...");
   resetInputStream();
  }
  
  // Demo step 2
  if (demo_step == 1) {
    if (hasFlag(demo_flags, "f") && flagValue(demo_flags, "f") == "hello") {
      demo_step = 2;
      output("Awesome! Flags can be used to set options for a command.<br />" + 
        "You can also check for other arguments. Fill in the blanks:<br />" + 
        "'demo _____ _____'");
    } else {
      output("Sorta...type 'demo -f=hello'");
    }
  }
  
  // Demo step 1
  if (demo_step == 0) {
    if (hasFlag(demo_flags, "f")) {
      demo_step = 1;
      output("Great! You can also set flag values. Type 'demo -f=hello'");
    } else {
      output("Sorta...type 'demo -f'");
    }
  }
  
  
  
       
}
