const subreduce = (collection, subreducer) => {

	if (Array.isArray(subreducer)) {
		subreducer = subreducer[0];
	}

	let currentDest = (subreducer && subreducer.currentDest) ? subreducer.currentDest : 'current';
	let nextDest = (subreducer && subreducer.nextDest) ? subreducer.nextDest : 'next';

	if (collection.length === 0) {
		return [];
	} else if (collection.length === 1) {
		return [
			{
				[currentDest]: collection[0],
				[nextDest]: null
			}
		];
	} else {
		return collection.slice(0, -1).map((item, index) => {
			return {
				[currentDest]: item,
				[nextDest]: collection[index + 1]
			};
		});
	}
};

export default subreduce;
