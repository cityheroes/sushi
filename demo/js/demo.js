
var sushi = new Sushi();

var result23 = [
	{
		overturn: {
			pivot: 'custom'
		},
		pick: {
			paths: ['parent.created'],
			keys: ['DAQ / MPFM COMPETENCE -']
		},
		mappers: [
			{
				name: 'translate',
				convertions: {
					'A': 5,
					'B': 4,
					'C': 3,
					'D': 2,
					'E': 1,
					'N/A': 0,
				}
			}
		],
		selectors: [
			{
				name: 'average',
				keys: ['DAQ / MPFM COMPETENCE -'],
				dest: 'DAQ / MPFM COMPETENCE',
			},
			{
				name: 'extract',
				path: 'parent.created',
				dest: 'created',
			}
		]
	},
	{
		mappers: [
			{
				name: 'classify',
				convertions: {
					5: 'A - Excellent',
					4: 'B - Good',
					3: 'C - Satisfactory',
					2: 'D - Deficient',
					1: 'E - Not Acceptable',
					0: 'N / A'
				},
			}
		]
	},
	{
		filters: [
			{
				name: 'mismatch',
				path: 'DAQ / MPFM COMPETENCE',
				match: 'N / A'
			}
		]
	}
];

var recipe3 = [
	{
		overturn: {
			pivot: 'custom'
		},
		pick: {
			paths: ['parent.id'],
			keys: ['DOCUMENTATION & SOFT SKILLS -*']
		},
		mappers: [
			{
				name: 'translate',
				convertions: {
					'A': 5,
					'B': 4,
					'C': 3,
					'D': 2,
					'E': 1,
					'N/A': 0,
				},
				keys: ['DOCUMENTATION & SOFT SKILLS -*'],
			}
		],
		// selectors: [
		// 	{
		// 		name: 'average',
		// 		keys: ['DOCUMENTATION & SOFT SKILLS -*'],
		// 		dest: 'DOCUMENTATION & SOFT SKILLS',
		// 	},
		// 	{
		// 		name: 'extract',
		// 		path: 'parent.created',
		// 		dest: 'created',
		// 	}
		// ]
	},
	{
		mappersz: [
			{
				name: 'classify',
				convertions: {
					5: 'A - Excellent',
					4: 'B - Good',
					3: 'C - Satisfactory',
					2: 'D - Deficient',
					1: 'E - Not Acceptable',
					// 0: 'N / A'
				},
				keys: ['DOCUMENTATION & SOFT SKILLS -*'],
			}
		],
		// explode: {
		// 	id: 'parent.id'
		// 	// name: 'sell'
		// }
	},
	{
		filters: [
			{
				name: 'mismatch',
				path: 'DOCUMENTATION & SOFT SKILLS',
				match: 'N / A'
			}
		],
		reducers: [
			{
				name: 'average',
				keys: ['DOCUMENTATION & SOFT SKILLS -*']
			}
		]
	},
	{
		explode: {},
	},
	{
		mappers: [
			{
				name: 'replace',
				match: 'DOCUMENTATION & SOFT SKILLS - ',
				path: 'key'
			}
		],
		reducers: [
			{
				name: 'array',
				keys: ['key', 'value']
				// path: 'key',
				// dest: 'keys',
			},
			// {
			// 	name: 'array',
			// 	path: 'value',
			// 	dest: 'values'
			// }
		]
	}
];

recipe4 = [
	{
		filters: [
			{
				name: 'match',
				path: 'mission.id',
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

var helper = sushi.helper();

sushi.addMapper('waleed', function(item, mapper) {
	return helper.extract(item, mapper.path, mapper.default) + ' Waleed!';
});

$(document).ready(function() {

	var dataContent = $('#content-data');
	var resultContent = $('#content-result');

	$.getJSON('./js/data3.json', function(data) {
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
		// var result4 = sushi.cook(data, recipe4);
		resultContent.html(

			result3.length + '\n\n' +
			JSON.stringify(result3, null, 3) + '\n\n'

			// result4.length + '\n\n' +
			// JSON.stringify(result4, null, 3) + '\n\n'

			// JSON.stringify(result1, null, 3) + '\n\n' +
			// JSON.stringify(result2, null, 3)
		);
	}, function(error) {
		console.warn(error);
	});
});