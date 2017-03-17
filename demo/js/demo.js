
var sushi = new Sushi();

recipe3 = [
	{
		filters: [
			{
				name: 'match',
				path: 'mission.id',
				match: '871'
			}
		]
	},
	// {
	// 	selectors: [
	// 		{
	// 			name: 'extract',
	// 			paths: ['parent.created'],
	// 			dest: 'created'
	// 		}
	// 	]
	// },
	{
		overturn: {
			pivot: 'custom'
		},
		pick: {
			values: ['!N/A'],
			paths: ['parent.created'],
			keys: ['!OSCAR', 'DOCUMENTATION & SOFT SKILLS -', 'SSHE -', 'SWT / FB COMPETENCE -', 'DAQ / MPFM COMPETENCE -']
		},
		mappers: [
			{
				name: 'translate',
				translations: {
					'A': 1,
					'B': 2,
					'C': 3,
					'D': 4,
					'E': 5,
					'F': 6,
					null: 0,
				},
				keys: ['DOCUMENTATION & SOFT SKILLS -', 'SSHE -*', 'SWT / FB COMPETENCE -*', 'DAQ / MPFM COMPETENCE -*']
			}
		],
		selectors: [
			{
				name: 'extract',
				path: 'parent.created',
				dest: 'created',
			},
			{
				name: 'average',
				keys: ['DOCUMENTATION & SOFT SKILLS -'],
				dest: 'DOCUMENTATION & SOFT SKILLS',
			},
			{
				name: 'average',
				keys: ['SSHE -'],
				dest: 'SSHE',
			},
			{
				name: 'average',
				keys: ['SWT / FB COMPETENCE -'],
				dest: 'SWT / FB COMPETENCE',
			},
			{
				name: 'average',
				keys: ['DAQ / MPFM COMPETENCE -'],
				dest: 'DAQ / MPFM COMPETENCE',
			},
		],
		reducers: [
			{
				name: 'average',
				path: 'DOCUMENTATION & SOFT SKILLS',
				dest: 'DOCUMENTATION & SOFT SKILLS',
			},
			{
				name: 'average',
				path: 'SSHE',
				dest: 'SSHE',
			},
			{
				name: 'average',
				path: 'SWT / FB COMPETENCE',
				dest: 'SWT / FB COMPETENCE',
			},
			{
				name: 'average',
				path: 'DAQ / MPFM COMPETENCE',
				dest: 'DAQ / MPFM COMPETENCE',
			},
		]
	},
	// {
	// 	mappers: {
	// 		{

	// 			values: ['!null']
	// 		}
	// 	}
	// }
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