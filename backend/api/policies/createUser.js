'use strict';

/**
 * Policy to set necessary create data to body.
 *
 * @param   {Request}   request     Request object
 * @param   {Response}  response    Response object
 * @param   {Function}  next        Callback function
 */

function alphanum(value){
  if( /[^a-zA-Z0-9]/.test( value ) ) {
    return false;
  }
  return true;
}

module.exports = function addDataCreate(request, response, next) {
  sails.log.verbose(__filename + ':' + __line + ' [Policy.createUser() called]');

  var password = request.body.passports.password
  var confirmation = request.body.password_confirmation

  console.log('[Policy.createUser()] -> password : ' + password);
  console.log('[Policy.createUser()] -> confirmation : ' + confirmation);

  if(!password) {
    var error = new Error();

    error.raw = [
      {
        err : {
          invalidAttributes : {
            "password" : [{
              message : 'The password field is required.'
            }]
          }
        }
      }
    ]

    error.status = 400;

    return next(error);
  }

  if(password.length < 6) {
    var error = new Error();

    error.raw = [
      {
        err : {
          invalidAttributes : {
            "password" : [{
              message : 'The password must be at least 6 characters long.'
            }]
          }
        }
      }
    ]

    error.status = 400;

    return next(error);
  }

  if(!alphanum(password)) {
    var error = new Error();

    error.raw = [
      {
        err : {
          invalidAttributes : {
            "password" : [{
              message : 'Only alphanumeric characters are accepted.'
            }]
          }
        }
      }
    ]

    error.status = 400;

    return next(error);
  }

  if(password != confirmation) {
    var error = new Error();

    error.invalidAttributes = {
      "password_confirmation" : [{
        message : 'Password and password confirmation don\'t match.'
      }]
    }
    error.status = 400;

    return next(error);
  }else{
    next();
  }
};
