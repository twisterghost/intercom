
var VERSION="1.0.2.0";var inputStream=parseInput;var quitNow=false;var plugin_text="";var commands=Array();var showCommand=0;var tempUrl="";var parsers=[];var plugins=[];$(document).ready(function(){$('#input').focus();output("Welcome to Intercom v."+VERSION);for(i=0;i<plugins.length;i++){plugin_text+=plugins[i]+"<br />";}});function checkKey(e){if(e.keyCode==13){var input=$('#input').val();$('#input').val('');if(input=="forcequit"){outputWithCarrot(input);output("Focequitting back to main input stream.");inputStream=parseInput;}else{commands.push(input);showCommand=commands.length;inputStream(input);}}else if(e.keyCode==38){showCommand--;if(showCommand<=0){showCommand=0;}
$('#input').val(commands[showCommand]);}else if(e.keyCode==40){showCommand++;if(showCommand>=commands.length){$('#input').val('');showCommand=commands.length;}else{$('#input').val(commands[showCommand]);}}else{}}
function parseInput(input){output("&raquo;&nbsp;"+input);for(i=0;i<parsers.length;i++){parsers[i](input);if(quitNow){quitNow=false;return;}}
if(input=="help"||input=="?"){outputHelp();return;}
else if(input=="help -commands"){outputHelpCommands();return}
else if(input=="clear"){clearScreen();return;}
else if(input.substring(0,5)=="open "){if(input.substring(5,12)=="-nofix "){url=input.substring(12);openPage(url,true,false);return;}
url=input.substring(5);openPage(url,false,true);return;}
output("'"+input+"' is not a valid command or installed plugin.");quitNow=false;}
function outputHelp(){output("Intercom help & documentation");output("<br />Intercom is a JavaScript-based web console built for "+"plugins. Each instance of Intercom may have as many or as few "+"plugins as desired.");output("Intercom is currently in development stages, please check "+"http://i.amMichael.com for information on release.");output("<b>For the list of basic commands, type 'help -commands'</b>");output("<br />--------------------------<br />");output("This Intercom has the following plugins installed:<br />"+
plugin_text);}
function outputHelpCommands(){output("Intercom basic commands");output("-----------------------");output("<b>help</b> - display help message");output("<b>clear</b> - clears the content of the screen");output("<b>open [URL]</b> - opens the given URL in the console");}
function openPage(url,ignorehttp,fix){if(fix){if(url.substring(0,3)=="www"){output("Notice: requested address WAS "+url+", adding 'http://' "+"in front. Use open -nofix to stop this.");url="http://"+url;}
if(!ignorehttp&&url.substring(0,4)!="http"){tempUrl=url;output("The requested URL to open is not a valid http request. "+"Open anyway?");output("y/n/(a)dd http:// in front");setInputStream(openPageCheckUrl);return;}}
output("<iframe src='"+url+"' width='100%' height='80%'>");}
function openPageCheckUrl(input){if(input=="y"||input=="yes"){resetInputStream();openPage(tempUrl,true,true);}else if(input=="n"||input=="no"){resetInputStream();output("Action aborted.");}else if(input=="a"){resetInputStream();openPage("http://"+tempUrl);}}
function identifyPlugin(title){plugins.push(title);}
function addParser(parser){parsers.push(parser);}
function outputWithCarrot(text){$('#output').append("&raquo;&nbsp;"+text+"<br />");$(window).scrollTop($(document).height());}
function clearScreen(){$('#output').html('');}
function none(input){}
function output(text,style,carrot){style=typeof(style)!='undefined'?style:"";carrot=typeof(carrot)!='undefined'?carrot:false;if(carrot){$('#output').append("&raquo;&nbsp;<span class='"+style+"'>"+text+"</span><br />");}else{$('#output').append("<span class='"+style+"'>"+text+"</span><br />");}
$(window).scrollTop($(document).height());}
function quitParse(){quitNow=true;}
function setInputStream(newStream){inputStream=newStream;}
function resetInputStream(){inputStream=parseInput;quitNow=false;}
function outputPostCall(url,params){setInputStream(none);$.post(url,params,function(data){output(data);resetInputStream();});}
function returnPostCall(url,params){setInputStream(none);$.post(url,params,function(data){return data;resetInputStream();});}
function extractFlags(input){flags_array=Array();while(input.indexOf("-")!=-1){input=input.substring(input.indexOf("-")+1);isQuotedValue=input.indexOf('="');isSingleQuotedValue=input.indexOf("='");nextEquals=input.indexOf("=");nextSpace=input.indexOf(" ");if(nextSpace==-1){nextSpace=input.length;}
if(isQuotedValue!=-1&&isQuotedValue<input.substring(isQuotedValue+2).indexOf('"')){key=input.substring(0,isQuotedValue);value=input.substring(isQuotedValue+2,(isQuotedValue+2)+
input.substring(isQuotedValue+2).indexOf('"'));flags_array[key]=value;}else if(isSingleQuotedValue!=-1&&isSingleQuotedValue<input.substring(isSingleQuotedValue+2).indexOf("'")){key=input.substring(0,isSingleQuotedValue);value=input.substring(isSingleQuotedValue+2,(isSingleQuotedValue+2)+
input.substring(isSingleQuotedValue+2).indexOf("'"));flags_array[key]=value;}else if(nextEquals!=-1&&nextEquals<nextSpace){key=input.substring(0,nextEquals);value=input.substring(nextEquals+1,nextSpace);flags_array[key]=value;}else{key=input.substring(0,nextSpace);flags_array[key]=true;}}
return flags_array;}
function hasFlag(flags,find){return find in flags;}
function countFlags(flags){return Object.keys(flags).length;}
function flagValue(flags,key){if(hasFlag(flags,key)){return flags[key];}else{return false;}}
function checkCommand(input,command){input=$.trim(input);matcherTrim=input.split(' ');matcherPart=matcherTrim[0];if(matcherPart==command){return true;}else{return false;}}
function extractArguments(input){input=$.trim(input);matcherTrim=input.split(' ');returnArr=Array();for(argCount=0;argCount<matcherTrim.length;argCount++){if(matcherTrim[argCount].substring(0,1)!="-"){returnArr.push(matcherTrim[argCount]);}}
return returnArr;}
function include(filepath){document.write("<script type='text/javascript' src='"+filepath+"'>"+"</script>");}
function run(command){parseInput(command);}
function debug(){output("DEBUG INFORMATION","error");output("=================","error");output("Version: "+VERSION,"error");output("Input stream: "+inputStream,"error");output("Command history: ","error");for(command in commands){output(commands[command],"error");}
output("Active parsers:","error");for(parser in parsers){output(parsers[parser],"error");output("===========","error");}}
function HelpText(){this.intro="";this.flags="<b>Flags:</b><br />";this.commands="<b>Commands:</b><br />";this.misc="";this.getHelpText=function(){return this.intro+"<br />"+this.flags+"<br />"+this.commands+"<br />"+this.misc;}
this.addFlag=function(flag,desc){this.flags+="-"+flag+" : "+desc+"<br />";}
this.addCommand=function(command,desc){this.commands+=command+" : "+desc+"<br />";}
this.addMisc=function(toAdd){this.misc+=toAdd;}
this.setIntro=function(newIntro){this.intro=newIntro;}}
