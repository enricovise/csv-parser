/*global Clib, TheApplication(), ToNumber */

function CSVParser(aString)
{
	this.provideNewline = function(aString)
	{
		return aString + (aString.match(/\n$/) ? "" : "\n");
    };

	this.nextLine = function()
	{
		this.line = this.provideNewline(this.linePattern.exec(this.file)[0]);
		this.pattern.lastIndex = 0;
	};

	this.hasNextLine = function()
	{
		var lastIndexBackup = this.linePattern.lastIndex;
		var line = this.linePattern.exec(this.file)[0];
		this.linePattern.lastIndex = lastIndexBackup;
		return line != "";
	};

	this.hasNextToken = function()
	{
		var lastIndexBackup = this.pattern.lastIndex;
		var found = this.pattern.test(this.line);
		this.pattern.lastIndex = lastIndexBackup;
		return found;
	};

	this.nextToken = function()
	{
		var result  = this.pattern.exec(this.line);
		this.token = result[2] || result[1];
	};

	this.openFile = function(aString)
	{
		this.file=document.getElementById("text").innerHTML;
	};

	this.getSeparator = function()
	{
		return ";";
	};

	this.getLinePattern = function()
	{
		return ".*\n?";
	};

	this.getTokenPattern = function()
	{
		var unquoted = "([^\"]*?)";
		var even_number_of_quotes = "(?:\"\")*";
		var quoted = "\"(" + ".*?[^\"]" + even_number_of_quotes + ")\"";
		var tail = "(?:\n|" + this.separator + ")";
		return "(?:" + unquoted + "|" + quoted + ")" + tail;
	};
	
	this.initialize = function(aString)
	{
		this.separator = this.getSeparator();
		this.pattern = new RegExp(this.getTokenPattern(), "g");
		this.linePattern = new RegExp(this.getLinePattern(), "g");
		this.openFile(aString);
	};
	
	this.initialize(aString);
}

// TEST CASES
// Sironi, Mario;x
// "Verdi; Wagner";x
// "Ettore ""Ted"" De Grazia";x
// "Carlo ""Magno"";Bismarck";x
// "Filippo il Bello; Giovanna la ""Pazza""";x
// "Felipe l'""Hermoso"";Juana la ""Loca""";x
