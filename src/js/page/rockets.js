var rockets = require('../../../data/rockets.json');

rockets.forEach(function (rocket){  
  page({ 
    path: 'rockets/'+rocket.path.toLowerCase(), 
    rocket: rocket 
  });
});