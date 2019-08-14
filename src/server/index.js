import restify from 'restify';
import restifyErrors from 'restify-errors';
import debugLib from 'debug';

import Sushi from '../Sushi';

const debug = debugLib('sushi-server');
let sushi = new Sushi({
	verbose: true
});

const port = 8080;
const server = restify.createServer();

server.use(restify.plugins.bodyParser());

server.post('/cook', (req, res, next) => {
	let data = req.body.data,
		recipe = req.body.recipe;

	if (!data || !recipe) {
		let error = new restifyErrors.BadRequestError('Invalid request, missing \'data\' and/or \'recipe\'.');
		return next(error);
	}

	let result = sushi.cook(data, recipe);
	debug(JSON.stringify(result, null, 3));
	return res.send(200, result);
});

server.listen(port, function() {
	debug('%s listening at %s', server.name, server.url);
});
