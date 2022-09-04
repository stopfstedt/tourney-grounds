const { AsciiTable3 } = require('ascii-table3');

/**
 * Parses given team/players input into a data structure for further processing.
 * @param {string} input
 * @returns {{team1: {members: string[], name: string}, team2: {members: string[], name: string}}}
 * @throws Error
 */
const parse = function(input) {
  const teams = input.trim().split('|');
  if (1 === teams.length) {
    throw Error('Only one team provided. Please specify exactly two teams, separated by `|`.');
  } else if (3 <= teams.length) {
    throw Error('Too many teams provided. Please specify exactly two teams, separated by `|`.');
  }
  const team1 = teams[0].trim();
  const team2 = teams[1].trim();

  if (! team1.includes(':')) {
    new Error('Team name is missing. Please specify a name for the first team, followed by `:` and a list of players.');
  }
  if (! team2.includes(':')) {
    new Error('Team name is missing. Please specify a name for the second team, followed by `:` and a list of players.');
  }
  const teamName1 = team1.split(':')[0].trim();
  const teamName2 = team2.split(':')[0].trim();
  const teamMembers1 = team1.substring(team1.indexOf(':') + 1).trim().split(',').map(element => element.trim()).filter(element => element !== '');
  const teamMembers2 = team2.substring(team2.indexOf(':') + 1).trim().split(',').map(element => element.trim()).filter(element => element !== '');

  if (!team1.length) {
    throw Error(`${teamName1} has no players. Please provide a comma-separated list of players.`);
  }

  if (!team2.length) {
    throw Error(`${teamName2} has no players. Please provide a comma-separated list of players.`);
  }
  if (teamMembers1.length !== teamMembers2.length) {
    throw Error('Unequal player count. Please provide both teams with an equal number of players.')
  }

  return {
    team1: {
      name: teamName1,
      members: teamMembers1,
    },
    team2: {
      name: teamName2,
      members: teamMembers2,
    },
  }
}

/**
 * Randomizes the order of members in each team, thus "pairing" them up.
 * @param {{team1: {members: string[], name: string}, team2: {members: string[], name: string}}} teams
 * @returns {{team1: {members: string[], name: string}, team2: {members: string[], name: string}}}
 */
const pair = function(teams) {
  const randomize = function() {
    return Math.random() - 0.5;
  }
  teams.team1.members.sort(randomize);
  teams.team2.members.sort(randomize);
  return teams;
}

/**
 * Returns given pairings as ASCII formatted table.
 * @param {{team1: {members: string[], name: string}, team2: {members: string[], name: string}}} teams
 * @returns {string}
 */
const print = function(teams) {
  const tableData = [];
  for (let i = 0, n = teams.team1.members.length; i < n; i++) {
    tableData.push([teams.team1.members[i], teams.team2.members[i]]);
  }
  const table = new AsciiTable3()
    .setHeading(teams.team1.name, teams.team2.name)
    .addRowMatrix(tableData);

  return table.toString();
}

/**
 * Prints usage information.
 * @returns {string}
 */
const help = function() {
  const input = 'Team Lahey: Barb (GJ/Sun), Jim (Stark/Crossing), Treena (NW/KoW) | Team Collins: Phil (Lanni/Mummers), Jacob (Tyrell/Aloof), Thomas (Targ/HRD)';
  const output =  [];
  output.push('');
  output.push('**Usage:**')
  output.push('');
  output.push('`/pair-round team1: player1, player2, ... | team2: player3, player4, ...`');
  output.push('');
  output.push('**Example:**')
  output.push('');
  output.push('`/pair-round ' + input + '`');
  output.push('');
  output.push('```');
  output.push(print(pair(parse(input))))
  output.push('```');
  return output.join("\n");
}

module.exports = { print, parse, pair, help }
