const { authSecret } = require('../.env');
const passport = require('passport');
const passportJwt = require('passport-jwt');
const { Strategy, ExtractJwt } = passportJwt;


module.exports = app => {
    const params = {
        secretOrKey: authSecret,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    }

    /* Payload é o objeto que passa no arquivo auth.js */
    const strategy = new Strategy(params, (payload, done) => {

        app.db('users')
            .where({ id: payload.id })
            .first()
            .then(user => done(null, user ? { ...payload } : false))
            .catch(error => done(err, false))
    })

    passport.use(strategy);

    return {
        /* O atributo 'session' com valor 'false' indica que não queremos nenhum parâmetro
        como exceção. O passport irá autenticar conforme os atributos passados no header que foram
        recolhidos na função  ExtractJwt.fromAuthHeaderAsBearerToken()*/
        authenticate: () => passport.authenticate('jwt', { session: false })
    }
}