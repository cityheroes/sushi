
const attach = (collection, attachers, applyOperation) => {

	if (!attachers) {
		return collection;
	}

	if (!Array.isArray(attachers)) {
		attachers = [attachers];
	}

	return collection.map((item, index) => {
		attachers.forEach((attacher) => {
			item[attacher.dest] = applyOperation(
				'attacher',
				attacher.name,
				item,
				attacher,
				index
			);
		});

		return item;
	});
};

export default attach;
