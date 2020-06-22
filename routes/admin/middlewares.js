const { validationResult } = require('express-validator');

module.exports = {

	handleValidationErrors (templatePath) {

		return (req, res, next) => {
			const errors = validationResult(req);

		    if (!errors.isEmpty()) {
		    	return res.render(templatePath, {errors})
		    }

		    next();
		}
	}
}