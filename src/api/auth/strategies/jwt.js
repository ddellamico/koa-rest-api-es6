'use strict';

import config from '../config';
import User from '../../user/user.model';
import passportJwt from 'passport-jwt';
import _debug from 'debug';

const debug = _debug('krs:api.auth.jwt');

const opts = {};
opts.jwtFromRequest = passportJwt.ExtractJwt.fromAuthHeaderWithScheme('Bearer');
opts.secretOrKey = config.secret;

export default new passportJwt.Strategy(opts, async(jwt_payload, done) => { // eslint-disable-line
  try {
    const user = await User.findById(jwt_payload.id);
    if (!user) {
      debug('User not found ==> %s', jwt_payload.id);
      return done(null, false);
    }
    if (!user.active) {
      debug('User not active ==> %j', user);
      return done(null, false);
    }
    return done(null, user, { scope: '*' });
  } catch (error) {
    return done(error);
  }
});