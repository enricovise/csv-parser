function Token(aString)
{
	this.value = !aString ? "" : 
		("\"" + aString + "\"").replace(/""/g, "\"").match(/"(.*)"/)[1];
}

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

Token.getPattern = function(aString)
{
	var unquoted = "[^\"]*?";
	var even_number_of_quotes = "(?:\"\")*";
	var quoted = "\"" + ".*?[^\"]" + even_number_of_quotes + "\"";
	var tail = "(?:\n|" + aString + ")";
	return new RegExp("(" + unquoted + "|" + quoted + ")" + tail, "g");
};





function Row(valueString, separatorString)
{
	this.value = valueString;
	this.separator = separatorString;
	this.pattern = Token.getPattern(separatorString);
}

Row.prototype.normalize = function()
{
	return new Row(this.value + (this.value.match(/\n$/) ? "" : "\n"),
	               this.separator);
};

Row.prototype.isEmpty = function()
{
	return this.value == "";
};

Row.prototype.gotoToken = function(anInteger)
{
	for (var i = 0; i <= anInteger && this.hasNextToken(); i++)
	{
		this.nextToken();
	}
};

Row.prototype.hasNextToken = function()
{
	var lastIndexBackup = this.pattern.lastIndex;
	var found = this.pattern.test(this.value);
	this.pattern.lastIndex = lastIndexBackup;
	return found;
};

Row.prototype.nextToken = function()
{
	this.token = new Token(this.pattern.exec(this.value)[1]);
};

Row.getPattern = function()
{
	return new RegExp(".*\n?", "g");
};






function CSVParser(fileString, separatorString)
{
	this.initialize(fileString, separatorString);
}

CSVParser.prototype.gotoRow = function(anInteger)
{
	for (var i = 0; i <= anInteger && this.hasNextRow(); i++)
	{
		this.nextRow();
	}
};

CSVParser.prototype.getNextRow = function()
{
	return new Row(this.pattern.exec(this.file)[0], this.separator);
};

CSVParser.prototype.nextRow = function()
{
	this.row = this.getNextRow().normalize();
};

CSVParser.prototype.hasNextRow = function()
{
	var lastIndexBackup = this.pattern.lastIndex;
	var row = this.getNextRow();
	this.pattern.lastIndex = lastIndexBackup;
	return !row.isEmpty();
};

CSVParser.prototype.initialize = function(fileString, separatorString)
{
	this.separator = separatorString;
	this.pattern = Row.getPattern();
	this.file = fileString;
};


// TEST CASES
// Sironi, Mario;x
// "Verdi; Wagner";x
// "Ettore ""Ted"" De Grazia";x
// "Carlo ""Magno"";Bismarck";x
// "Filippo il Bello; Giovanna la ""Pazza""";x
// "Felipe l'""Hermoso"";Juana la ""Loca""";x
