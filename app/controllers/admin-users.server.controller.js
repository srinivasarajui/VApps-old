'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    _ = require('lodash');

/**
 * Get the error message from error object
 */
var getErrorMessage = function(err) {

    var message = '';

    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = 'Username already exists';
                break;
            default:
                message = 'Something went wrong';
        }
    } else {
        for (var errName in err.errors) {
            if (err.errors[errName].message) message = err.errors[errName].message;
        }
    }
    return message;
};


/**
 * Create a Admin user
 */
exports.create = function(req, res) {

    var user = new User(req.body);
    user.user = req.user;
    // Add missing user fields
    user.provider = 'local';
    user.displayName = user.firstName + ' ' + user.lastName;
    if(!user.roles)
    {
        user.roles = ['user']
    }
    user.save(function(err) {
        if (err) {
            return res.send(400, {
                message: getErrorMessage(err)
            });
        } else {
            // Remove sensitive data before login
            user.password = undefined;
            user.salt = undefined;
            res.jsonp(user);
        }
    });
};

/**
 * Show the current Admin user
 */
exports.read = function(req, res) {
    res.jsonp(req.user);
};

/**
 * Update a Admin user
 */
exports.update = function(req, res) {

    var user = req.user;

    user = _.extend(user, req.body);
    // Add missing user fields
    user.provider = 'local';
    user.displayName = user.firstName + ' ' + user.lastName;
    user.save(function(err) {
        if (err) {
            return res.send(400, {
                message: getErrorMessage(err)
            });
        } else {
            // Remove sensitive data before login
            user.password = undefined;
            user.salt = undefined;
            res.jsonp(user);
        }
    });
};

/**
 * Delete an Admin user
 */
exports.delete = function(req, res) {

    var user = req.user;
    //Marking Deleted Items
    user = _.extend(user, req.body);
    user.Deleted = true;
    user.DeletedOn = Date.now(); //TODO Stamp System date
    user.DeletedBy = req.user;
    user.save(function(err) {
        if (err) {

            return res.send(400, {
                message: getErrorMessage(err)
            });
        } else {
            // Remove sensitive data before login
            user.password = undefined;
            user.salt = undefined;
            res.jsonp(user);
        }
    });
    /*project.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(project);
		}
	});*/
};

/**
 * List of Admin users
 */
exports.list = function(req, res) {

    User.find({
        Deleted: false
    }).exec(function(err, users) {

        if (err) {
            return res.send(400, {
                message: getErrorMessage(err)
            });
        } else {
            res.jsonp(users);
        }
    });
};



/**
 * User authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {

    /*
	Removed as All users are authorised to see all the projects
	if (req.project.user.id !== req.user.id) {
		return res.send(403, 'User is not authorized');
	}*/
    console.log(req.user.roles);
    
    if(!_.find(req.user.roles,function(role) {
  return role === 'ADMIN';
}))
    {
        return res.send(403, 'User is not authorized');
    }
    next();
};

/**
 * userByID middleware
 */
exports.userByID = function(req, res, next, id) {

    User.findById(id).exec(function(err, user) {
        if (err) return next(err);
        if (!user) return next(new Error('Failed to load Project ' + id));
        req.user = user;
        next();
    });
};

