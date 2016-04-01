assert.deepStrictEqual(
    parser.parse('$abc: 42').value,
    [{ type: 'declaration', key: 'abc', value: '42', comment: undefined }]
)
assert.deepStrictEqual(
    parser.parse('$abc: 42 // foo').value,
    [{ type: 'declaration', key: 'abc', value: '42', comment: 'foo' }]
)
assert.deepStrictEqual(
    parser.parse('$abc: "foo"').value,
    [{ type: 'declaration', key: 'abc', value: '"foo"', comment: undefined }]
)
assert.deepStrictEqual(
    parser.parse('$abc: "foo" // bar baz moo!').value,
    [{ type: 'declaration', key: 'abc', value: '"foo"', comment: 'bar baz moo!' }]
)
assert.deepStrictEqual(
    parser.parse(`@mixin fontWeightBold
  font-weight: $fontWeightBold
  font-size: 12px
`).value,
    [{ key: 'fontWeightBold', type: 'mixin', value: [
        ['font-weight', '$fontWeightBold'],
        ['font-size', '12px']
    ]}]
)