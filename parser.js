function Token(aString)
{
	this.value = aString;
	this.normalize();
}

Token.prototype.normalize = function()
{
	this.value = ("\"" + this.value + "\"").replace(/""/g, "\"").match(
			                                                      /"(.*)"/)[1];
};

Token.prototype.asString = function()
{
	return this.value;
};

Token.prototype.asInteger = function()
{
	return parseInt(this.value, 10);
};

Token.prototype.asDouble = function()
{
	return parseFloat(this.value);
};

Token.prototype.asDate = function()
{
	return new Date(this.value);
};


function CSVParser(aString)
{
	this.initialize(aString);
}

CSVParser.prototype.gotoRow = function(anInteger)
{
	for (var i = 0; i <= anInteger && this.hasNextRow(); i++)
	{
		this.nextRow();
	}
};

CSVParser.prototype.gotoToken = function(anInteger)
{
	for (var i = 0; i <= anInteger && this.hasNextToken(); i++)
	{
		this.nextToken();
	}
};

CSVParser.prototype.provideNewline = function(aString)
{
	return aString + (aString.match(/\n$/) ? "" : "\n");
};

CSVParser.prototype.nextRow = function()
{
	this.row = this.provideNewline(this.rowPattern.exec(this.file)[0]);
	this.pattern.lastIndex = 0;
};

CSVParser.prototype.hasNextRow = function()
{
	var lastIndexBackup = this.rowPattern.lastIndex;
	var row = this.rowPattern.exec(this.file)[0];
	this.rowPattern.lastIndex = lastIndexBackup;
	return row != "";
};

CSVParser.prototype.hasNextToken = function()
{
	var lastIndexBackup = this.pattern.lastIndex;
	var found = this.pattern.test(this.row);
	this.pattern.lastIndex = lastIndexBackup;
	return found;
};

CSVParser.prototype.nextToken = function()
{
	this.token = new Token(this.pattern.exec(this.row)[1]);
};

CSVParser.prototype.openFile = function(aString)
{
	this.file=document.getElementById("text").innerHTML;
};

CSVParser.prototype.getSeparator = function()
{
	return ";";
};

CSVParser.prototype.getRowPattern = function()
{
	return ".*\n?";
};

CSVParser.prototype.getTokenPattern = function()
{
	var unquoted = "[^\"]*?";
	var even_number_of_quotes = "(?:\"\")*";
	var quoted = "\"" + ".*?[^\"]" + even_number_of_quotes + "\"";
	var tail = "(?:\n|" + this.separator + ")";
	return "(" + unquoted + "|" + quoted + ")" + tail;
};

CSVParser.prototype.initialize = function(aString)
{
	this.separator = this.getSeparator();
	this.pattern = new RegExp(this.getTokenPattern(), "g");
	this.rowPattern = new RegExp(this.getRowPattern(), "g");
	this.openFile(aString);
};


// TEST CASES
// Sironi, Mario;x
// "Verdi; Wagner";x
// "Ettore ""Ted"" De Grazia";x
// "Carlo ""Magno"";Bismarck";x
// "Filippo il Bello; Giovanna la ""Pazza""";x
// "Felipe l'""Hermoso"";Juana la ""Loca""";x
