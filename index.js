/*
* HTTP Cloud Function.
*
* @param {Object} req Cloud Function request context.
* @param {Object} res Cloud Function response context.
*/
exports.worldCupWebhook = function worldCupWebhook (req, res) {
  
  let params = req.body.queryResult.parameters;
  let country1 = 'Brasil';
  if (params['geo-country1']) {
    country1 = params['geo-country1'];
  }
  let ordinal = 1;
  if (params['ordinal']) {
    ordinal = params['ordinal'];    
  }
  
  var match = findMatch(country1, ordinal);
  if (match == null) {
    response = "Desculpe, não encontrei nenhum jogo."
  } else {
    response = match.date + ": " + match.team1 + " x " + match.team2;
  }

  res.setHeader('Content-Type', 'application/json'); //Requires application/json MIME type
  res.send(JSON.stringify({ "fulfillmentText": response }));
};

function load2018() {
  
  var matches = [];
  var teamBRA = new Team('Brasil');
  var teamSUI = new Team('Suiça');
  var teamCOS = new Team('Costa Rica');
  var teamSER = new Team('Sérvia');
  
  matches.push(new Match(9, teamBRA, teamSUI, '17/Jun'));
  matches.push(new Match(10, teamCOS, teamSER, '17/Jun'));
  matches.push(new Match(25, teamBRA, teamCOS, '22/Jun' ));
  matches.push(new Match(26, teamSER, teamSUI, '22/Jun'));
  matches.push(new Match(41, teamSER, teamBRA, '27/Jun' ));
  matches.push(new Match(42, teamSUI, teamCOS, '27/Jun'));

  return matches;
}

function Team (name) {
  this.name = name;
}

Team.prototype.toString = function() {
  return this.name;
}

function Match (id, team1, team2, date) {
  this.id = id;
  this.team1 = team1;
  this.team2 = team2;
  this.date = date;
}



function findMatch(country, ordinal) {

  var matches = load2018();
  var filteredMatches = matches.filter(match => match.team1.name.includes(country) 
                                             || match.team2.name.includes(country) 
                                             || country.includes(match.team1.name) 
                                             || country.includes(match.team2.name));
  if (filteredMatches.length >=  ordinal) {
    return filteredMatches[ordinal - 1];
  }
  return null;
}
