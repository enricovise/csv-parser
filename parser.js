/*global Clib, TheApplication(), ToNumber */

function CSVParser(aString)
{
	this.gotoRow = function(anInteger)
	{
		for (var i = 0; i <= anInteger && this.hasNextRow(); i++)
		{
			this.nextRow();
        }
	};
	
	this.provideNewline = function(aString)
	{
		return aString + (aString.match(/\n$/) ? "" : "\n");
    };

	this.nextRow = function()
	{
		this.row = this.provideNewline(this.rowPattern.exec(this.file)[0]);
		this.pattern.lastIndex = 0;
	};

	this.hasNextRow = function()
	{
		var lastIndexBackup = this.rowPattern.lastIndex;
		var row = this.rowPattern.exec(this.file)[0];
		this.rowPattern.lastIndex = lastIndexBackup;
		return row != "";
	};

	this.hasNextToken = function()
	{
		var lastIndexBackup = this.pattern.lastIndex;
		var found = this.pattern.test(this.row);
		this.pattern.lastIndex = lastIndexBackup;
		return found;
	};

	this.nextToken = function()
	{
		var result  = this.pattern.exec(this.row);
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

	this.getRowPattern = function()
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
		this.rowPattern = new RegExp(this.getRowPattern(), "g");
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
