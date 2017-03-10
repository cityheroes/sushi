
var sushi = new Sushi();

var recipe1 = {
	filters: [
		{
			name: 'mismatch',
			src: 'user.name',
			match: 'Mirza Waheed'
		}
	],
	mappers: [
		// {
		// 	name: 'extract',
		// 	dest: 'id',
		// 	src: 'id',
		// },
		// {
		// 	name: 'extract',
		// 	dest: 'name',
		// 	src: ['user.name', 'text'],
		// 	separator: ' - ',
		// },
		{
			name: 'operationMap',
			operator: 'addition',
			dest: 'total',
			src: ['user.friends_count', 'user.followers_count'],
		},
		{
			name: 'operationMap',
			operator: 'addition',
			dest: 'total_2',
			src: ['user.followers_count'],
		},
		{
			name: 'operation',
			operator: 'multiplication',
			dest: 'total_3',
			src: 'user.followers_count',
			operand: 5
		},
		// {
		// 	name: 'divide',
		// 	dest: 'total_3',
		// 	src: ['user.friends_count', 'user.followers_count', ['user.entities.url.urls[0].indices[1]', 1]],
		// },
		// {
		// 	name: 'extract',
		// 	dest: 'sup',
		// 	src: 'user.entities.url.urls[0].url',
		// },
		{
			name: 'extract',
			dest: 'indices',
			src: 'user.entities.url.urls[0].indices[1]',
		},
		{
			name: 'extract',
			dest: 'waleed indices',
			src: [['user.entities.url.urls[0].indices[1]', 'NOPE'], 'user.friends_count'],
		},
		{
			name: 'extract',
			dest: 'Language Code',
			src: 'metadata.iso_language_code',
		},
		// {
		// 	name: 'extract',
		// 	dest: 'name',
		// 	src: ['user.name', 'text'],
		// 	src: 'user.name',
		// }
	],
	reducers: [
		{
			name: 'total',
			dest: 'total',
			// src: 'user.friends_count',
			src: 'total',
		},
		{
			name: 'sum',
			dest: 'small total',
			// src: 'user.friends_count',
			src: 'total',
		},
		{
			name: 'sumAndOperation',
			dest: 'big total',
			src: ['total_2', 'total_3'],
			operator: 'multiplication',
			operand: 4
		},
		{
			name: 'count',
			dest: 'count',
			// src: 'user.friends_count',
			src: 'indices',
		},
		{
			name: 'countCompare',
			dest: 'count_pt',
			src: 'Language Code',
			match: 'pt'
		},
		{
			name: 'countCompare',
			dest: 'count_es',
			src: 'Language Code',
			match: 'es'
		},
		{
			name: 'countCompare',
			dest: 'count_en',
			src: 'Language Code',
			match: 'en'
		},
	]
};

var recipe2 = {
	mappers: [
		{
			name: 'operationMap',
			operator: 'addition',
			dest: 'supertotal',
			src: ['small total', 'big total'],
		},
		{
			name: 'operation',
			operator: 'multiplication',
			dest: 'count_es x 5',
			src: 'count_es',
			operand: 5
		},
		{
			name: 'operation',
			operator: 'multiplication',
			dest: 'count_en x 5',
			src: 'count_en',
			operand: 238
		},
	]
};

recipe3 = [
	{
		filters: [
			{
				name: 'match',
				src: 'mission.id',
				match: '871'
			}
		]
	},
	{
		overturn: {
			pivot: 'custom'
		},
		pickers: [
			{
				name: 'contains',
				matches: ['DOCUMENTATION & SOFT SKILLS -', 'SSHE -', 'SWT / FB COMPETENCE -', 'DAQ / MPFM COMPETENCE -']
			}
		],
		mappers: [
			// {
			// 	name: 'translate',
			// 	translations: {
			// 		'A': 1,
			// 		'B': 2,
			// 		'C': 3,
			// 		'D': 4,
			// 		'E': 5,
			// 		'F': 6,
			// 		'N/A': 0
			// 	},
			// 	src: ['']
			// }
		]
	}
];

recipe4 = [
	{
		filters: [
			{
				name: 'match',
				src: 'mission.id',
				match: '961'
			}
		]
	},
	{
		overturn: {
			pivot: 'custom'
		}
	}
];

sushi.addMapper('waleed', function(item, mapper, helper) {
	return helper.extract(item, mapper.path, mapper.default) + ' Waleed!';
});

$(document).ready(function() {

	var dataContent = $('#content-data');
	var resultContent = $('#content-result');

	$.getJSON('./js/data2.json', function(data) {
		data = data.data;

		dataContent.html(
			data.length + '\n\n' +
			JSON.stringify(data, null, 3)
		);
		// ui.sourceData.JSONView(data);

		// ui.filterButton.on('click', { dataCollection: data, process: 'filters' }, executeProcess);
		// ui.transformButton.on('click', { dataCollection: data, process: 'mappers' }, executeProcess);
		// ui.aggregateButton.on('click', { dataCollection: data, process: 'reducers' }, executeProcess);

		// var result1 = sushi.cook(data, recipe1);
		// var result2 = sushi.cook(result1, recipe2);
		var result3 = sushi.cook(data, recipe3);
		var result4 = sushi.cook(data, recipe4);
		resultContent.html(
			result3.length + '\n\n' +
			JSON.stringify(result3, null, 3) + '\n\n' +
			result4.length + '\n\n' +
			JSON.stringify(result4, null, 3) + '\n\n'
			// JSON.stringify(result1, null, 3) + '\n\n' +
			// JSON.stringify(result2, null, 3)
		);
	}, function(error) {
		console.warn(error);
	});
});