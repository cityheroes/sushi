
var sushi = new Sushi();

var recipe1 = {
	filters: [
		{
			name: 'mismatch',
			path: 'user.name',
			match: 'Mirza Waheed'
		}
	],
	mappers: [
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
	reducers: [
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

var recipe2 = {
	mappers: [
		{
			name: 'operationMap',
			operator: 'addition',
			output: 'supertotal',
			path: ['small total', 'big total'],
		},
		{
			name: 'operation',
			operator: 'multiplication',
			output: 'count_es x 5',
			path: 'count_es',
			operand: 5
		},
		{
			name: 'operation',
			operator: 'multiplication',
			output: 'count_en x 5',
			path: 'count_en',
			operand: 238
		},
	]
};

sushi.addMapper('waleed', function(item, mapper, helper) {
	return helper.extract(item, mapper.path, mapper.default) + ' Waleed!';
});

$(document).ready(function() {

	var dataContent = $('#content-data');
	var resultContent = $('#content-result');

	$.getJSON('./js/data2.json', function(data) {
		data = data.data;

		dataContent.html(JSON.stringify(data, null, 3));
		// ui.sourceData.JSONView(data);

		// ui.filterButton.on('click', { dataCollection: data, process: 'filters' }, executeProcess);
		// ui.transformButton.on('click', { dataCollection: data, process: 'mappers' }, executeProcess);
		// ui.aggregateButton.on('click', { dataCollection: data, process: 'reducers' }, executeProcess);

		var result1 = sushi.roll(data, recipe1);
		var result2 = sushi.roll(result1, recipe2);
		resultContent.html(
			JSON.stringify(result1, null, 3) + '\n\n' +
			JSON.stringify(result2, null, 3)
		);
	}, function(error) {
		console.warn(error);
	});
});