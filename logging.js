const fs = require('node:fs');
const pino = require('pino');
var pretty = require('pino-pretty');

var streams = [
	{ stream: fs.createWriteStream('./log/log.jsonl') },
	{ stream: pretty() },
	{ level: 'debug', stream: fs.createWriteStream('./log/debug.stream.jsonl') },
	{ level: 'fatal', stream: fs.createWriteStream('./log/fatal.stream.jsonl') },
];
var logger = pino(
	{
		level: 'debug', // this MUST be set at the lowest level of the destinations
	},
	pino.multistream(streams)
);

module.exports = {
	logger
};