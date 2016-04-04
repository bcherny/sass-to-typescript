const assert = require('assert')
const parser = require('./').parser

// numbers
assert.deepStrictEqual(
    parser.parse('$abc: 42').value,
    [{ type: 'declaration', key: 'abc', value: '42', comment: undefined }]
)
assert.deepStrictEqual(
    parser.parse('$abc: 42 // foo').value,
    [{ type: 'declaration', key: 'abc', value: '42', comment: 'foo' }]
)

// strings
assert.deepStrictEqual(
    parser.parse('$abc: "foo"').value,
    [{ type: 'declaration', key: 'abc', value: '"foo"', comment: undefined }]
)
assert.deepStrictEqual(
    parser.parse('$abc: "foo" // bar baz moo!').value,
    [{ type: 'declaration', key: 'abc', value: '"foo"', comment: 'bar baz moo!' }]
)

// variables
assert.deepStrictEqual(
    parser.parse('$abc: $foo').value,
    [{ type: 'declaration', key: 'abc', value: '$foo', comment: undefined }]
)

// complex values
assert.deepStrictEqual(
    parser.parse('$a: "Helvetica Neue", Helvetica, Arial, sans-serif').value,
    [{ type: 'declaration', key: 'a', value: '"Helvetica Neue", Helvetica, Arial, sans-serif', comment: undefined }]
)

// mixins
assert.deepStrictEqual(
    parser.parse(`@mixin fontWeightBold
  font-weight: $fontWeightBold
  font-size: 12px
`).value,
    [{ key: 'fontWeightBold', type: 'mixin', value: [
        {type: 'declaration', key: 'font-weight', value: '$fontWeightBold'},
        {type: 'declaration', key: 'font-size', value: '12px'}
    ]}]
)