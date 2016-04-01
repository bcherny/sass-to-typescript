let assert = require('assert')
let Parsimmon = require('parsimmon')
let whitespace = Parsimmon.whitespace
let optWhitespace = Parsimmon.optWhitespace
let regex = Parsimmon.regex
let string = Parsimmon.string
let lazy = Parsimmon.lazy
let seq = Parsimmon.seq
let digits = Parsimmon.digits
let letters = Parsimmon.letters
let any = Parsimmon.any

function lexeme(p) { return p.skip(optWhitespace) }

let newline = whitespace.or(regex(/\r\n/))
let tab = regex(/[\s\t]+/)
let oneLineComment = string('//').then(optWhitespace).then(regex(/[^\n\r]+/))
let varName = regex(/[\w\d-_]+/)
let variable = string('$').then(varName)
let value = regex(/[\w\d-_"',\\." ]+/).map(_ => _.trim())
let property = seq(
  varName,
  lexeme(string(':')).then(variable.map(_ => `$${_}`).or(value))
)
let declaration = seq(
    variable,
    lexeme(string(':')).then(value)
)
// TODO: support mixins with args
let mixin = seq(
  string('@mixin').then(whitespace.many()).then(varName),
  whitespace.many()
    .then(property)
    .skip(newline)
    .skip(whitespace.many())
    .many()
).map(([mixinName, rules]) => ({
    type: 'mixin',
    key: mixinName,
    value: rules.map(([key, value]) => ({
        key,
        value,
        type: 'declaration'
    }))
}))

// line types
let declarationLine = seq(
    declaration.skip(whitespace.many()),
    oneLineComment.atMost(1)
).map(([d, c]) => ({
    type: 'declaration',
    key: d[0],
    value: d[1],
    comment: c[0]
}))
let commentLine = oneLineComment
    .skip(whitespace.many())
    .map(c => ({
        type: 'comment',
        value: c
    }))


let sassFile = newline.many()
    .then(
        commentLine
        .or(declarationLine)
        .or(mixin)
    )
    .skip(newline.many())
    .many()
    .skip(Parsimmon.eof)

let parser = lazy('sass', () => sassFile)

export const parser = lazy('sass', () => sassFile)