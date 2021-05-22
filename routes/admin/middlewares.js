const { validationResult } = require ('express-validator');

module.exports = {
  handleErrors(templateFunc, dataCb){
    return async (req, res, next) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        let data = {};
        if (dataCb) {
          data = await dataCb(req);
        }
        return res.send(templateFunc({ errors, ...data }));
      }

      next();
    };
  },
  //one has to be signed in in order to access admin panel
     requireAuth(req, res, next) {
       if (!req.session.userId) {
         return res.redirect('/signin');
       }
       next();
     }
};