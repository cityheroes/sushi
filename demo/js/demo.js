var sushi = new Sushi();

var recipe = {
	filters: [
		{
			name: 'mismatch',
			path: 'user.name',
			match: 'Mirza Waheed'
		}
	],
	transformations: [
		// {
		// 	name: 'extract',
		// 	output: 'id',
		// 	path: 'id',
		// },
		// {
		// 	name: 'extract',
		// 	output: 'name',
		// 	path: ['user.name', 'text'],
		// 	separator: ' - ',
		// },
		{
			name: 'operationMap',
			operator: 'addition',
			output: 'total',
			path: ['user.friends_count', 'user.followers_count'],
		},
		{
			name: 'operationMap',
			operator: 'addition',
			output: 'total_2',
			path: ['user.followers_count'],
		},
		{
			name: 'operation',
			operator: 'multiplication',
			output: 'total_3',
			path: 'user.followers_count',
			operand: 5
		},
		// {
		// 	name: 'divide',
		// 	output: 'total_3',
		// 	path: ['user.friends_count', 'user.followers_count', ['user.entities.url.urls[0].indices[1]', 1]],
		// },
		// {
		// 	name: 'extract',
		// 	output: 'sup',
		// 	path: 'user.entities.url.urls[0].url',
		// },
		{
			name: 'extract',
			output: 'indices',
			path: 'user.entities.url.urls[0].indices[1]',
		},
		{
			name: 'extract',
			output: 'waleed indices',
			path: [['user.entities.url.urls[0].indices[1]', 'NOPE'], 'user.friends_count'],
		},
		{
			name: 'extract',
			output: 'Language Code',
			path: 'metadata.iso_language_code',
		},
		// {
		// 	name: 'extract',
		// 	output: 'name',
		// 	path: ['user.name', 'text'],
		// 	path: 'user.name',
		// }
	],
	aggregations: [
		{
			name: 'total',
			output: 'total',
			// path: 'user.friends_count',
			path: 'total',
		},
		{
			name: 'sum',
			output: 'small total',
			// path: 'user.friends_count',
			path: 'total',
		},
		{
			name: 'sumAndOperation',
			output: 'big total',
			path: ['total_2', 'total_3'],
			operator: 'multiplication',
			operand: 4
		},
		{
			name: 'count',
			output: 'count',
			// path: 'user.friends_count',
			path: 'indices',
		},
		{
			name: 'countCompare',
			output: 'count_pt',
			path: 'Language Code',
			match: 'pt'
		},
		{
			name: 'countCompare',
			output: 'count_es',
			path: 'Language Code',
			match: 'es'
		},
		{
			name: 'countCompare',
			output: 'count_en',
			path: 'Language Code',
			match: 'en'
		},
	]
};

sushi.addTransformation('waleed', function(item, transformation, helper) {
	return helper.extract(item, transformation.path, transformation.default) + ' Waleed!';
});

$.getJSON('../demo/js/data.json', function(data) {
	// ui.sourceData.JSONView(data);

	// ui.filterButton.on('click', { dataCollection: data, process: 'filters' }, executeProcess);
	// ui.transformButton.on('click', { dataCollection: data, process: 'transformations' }, executeProcess);
	// ui.aggregateButton.on('click', { dataCollection: data, process: 'aggregations' }, executeProcess);

	var result = sushi.roll(data, recipe);
	console.log(result);
	console.log(JSON.stringify(result));
	// console.log(JSON.stringify(data));
});