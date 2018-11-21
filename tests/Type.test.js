const Type = require('../Type');

module.exports = (t) => {
	t.test('Base type is abstract', (t) => {
		const T = new Type();
		t.throws(() => T.encode());
		t.throws(() => T.decode());
	});
}