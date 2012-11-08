var ACS = require('acs').ACS;
var logger = require('acs').logger;

function signup(req, res) {
	var data = {
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		email: req.body.email,
		password: req.body.password,
		password_confirmation: req.body.password_confirmation,
    session_id: req.session.user.session_id
	};
	
	ACS.Users.create(data, function(data) {
		if(data.success) {
			var user = data.users[0];
			if(user.first_name && user.last_name) {
				user.name = user.first_name + ' ' + user.last_name;
			} else {
				user.name = user.username;
			}
			req.session.user = user;
			res.redirect('/');
			logger.info('Created user: ' + user.name);
		} else {
			req.session.msg = data.message;
	    res.render('signup', {
	      layout: 'application',
	      req: req
	    });
		}
	}, req, res);
}

function profile(req, res) {
  req.session.controller = "users";
  ACS.Users.showMe(function(e) {
    if(e.success && e.success === true){
      logger.info('users#showMe: ' + JSON.stringify(e));
      res.render('users/profile', {
		    req: req,
		    obj: e,
		    layout: 'layout/application'
		  });
    }else{
      logger.debug('Error: ' + JSON.stringify(e));
      req.session.msg = e.message;
      res.redirect('/');
    }
  }, req, res);
}

function _update(req, res) {
  req.session.controller = "users";
	var data = {
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		email: req.body.email,
		username: req.body.username,
		tags: req.body.tags,
		password: req.body.password,
		password_confirmation: req.body.password_confirmation,
    session_id: req.session.user.session_id
	};

  ACS.Users.update(data, function(e) {
    if(e.success && e.success === true){
      logger.info('users#update: ' + JSON.stringify(e));
      req.session.msg = "Successfully updated the user profile.";
      res.redirect('/');
    }else{
      logger.debug('Error: ' + JSON.stringify(e));
      req.session.msg = e.message;
      res.redirect('/profile');
    }
  }, req, res);
}