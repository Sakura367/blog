module.exports.index = function(req, res){
  res.render('index');
};

module.exports.details = function (req, res) {
  var choice = req.params.choice;
  res.render('details/' + choice);
};
