const listHelper = require('../utils/list_helper').dummy

test('dummy returns one',() => {
    expect(listHelper([])).toBe(1)
})