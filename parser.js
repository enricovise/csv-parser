function Token(aString)
{
	this.value = aString;
}

Token.prototype.normalize = function()
{
	return !this.value ? this : new Token(
		("\"" + this.value + "\"").replace(/""/g, "\"").match(/"(.*)"/)[1]);
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
		var token = this.nextToken();
	}
	return token.normalize();
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
	return new Token(this.pattern.exec(this.value)[1]);
};

Row.getPattern = function()
{
	return new RegExp(".*\n?", "g");
};






function CSVParser(fileString, separatorString)
{
	this.separator = separatorString;
	this.pattern = Row.getPattern();
	this.file = fileString;
}

CSVParser.prototype.gotoRow = function(anInteger)
{
	for (var i = 0; i <= anInteger && this.hasNextRow(); i++)
	{
		var row = this.nextRow();
	}
	return row.normalize();
};

CSVParser.prototype.nextRow = function()
{
	return new Row(this.pattern.exec(this.file)[0], this.separator);
};

CSVParser.prototype.hasNextRow = function()
{
	var lastIndexBackup = this.pattern.lastIndex;
	var row = this.nextRow();
	this.pattern.lastIndex = lastIndexBackup;
	return !row.isEmpty();
};
