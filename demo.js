identifyPlugin("demo");
addParser(demo_hook);

function demo_hook(input) {
  if (checkCommand(input, "demo")) {
    quitParse();
    demo_arguments = extractArguments(input);
    demo_flags = extractFlags(input);
    
    // No arguments -- display help
    if (demo_arguments.length == 1) {
      output("This is where help would output.");
    }
    // Check for other args
    
    else if (demo_arguments[1] == "enter") {
      if (hasFlag(demo_flags, "o")) {
        output("Override demo parser: " + flagValue(demo_flags, "o"));
      } else {
        output("Entering demo parser.");
        setInputStream(demo_main);
      }
    }
  }
}

function demo_main(input) {
  demo_arguments = extractArguments(input);
  output(demo_arguments);
}
