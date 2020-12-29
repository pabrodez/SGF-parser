import { sampleCollections } from "../src/constants";
import { createTreeNode, formatSgf, getArrayOfParenthesesIndexes, getNodeMove, getNodeProperties, splitNodesFromStr, } from "../src/utils";

// https://homepages.cwi.nl/~aeb/go/misc/sgf.html:
// That is, an SGF file (Collection) is the concatenation of zero or more GameTrees.
// A GameTree is an open parenthesis, followed by a NodeSequence, followed by zero or more GameTrees, followed by a close parenthesis.
// A NodeSequence is the concatenation of zero or more Nodes.
// A Node is a semicolon followed by a Property.
// A Property is an identifier (PropIdent) followed by one or more PropValues.
// A PropIdent is a sequence of one or more upper case letters (UcLetters).
// A PropValue consists of arbitrary data enclosed in square brackets. 

const parenthesesTest = [
    [sampleCollections[0][0],
    sampleCollections[0][1],
    [{ paren: '(', index: 0 }, { paren: ')', index: 54 }]
    ],
    [
        sampleCollections[1][0],
        sampleCollections[1][1],
        [{ paren: '(', index: 0 }, { paren: '(', index: 30 },
        { paren: ')', index: 55 }, { paren: '(', index: 56 },
        { paren: ')', index: 69 }, { paren: ')', index: 70 }]
    ],
    [
        sampleCollections[2][0],
        sampleCollections[2][1],
        [{ paren: '(', index: 0 }, { paren: '(', index: 30 }, { paren: ')', index: 63 },
        { paren: '(', index: 64 }, { paren: ')', index: 85 },
        { paren: '(', index: 86 }, { paren: ')', index: 125 }, { paren: ')', index: 126 }]
    ],
    [
        sampleCollections[3][0],
        sampleCollections[3][1],
        [{ paren: '(', index: 0 }, { paren: '(', index: 30 }, { paren: '(', index: 43 },
        { paren: ')', index: 56 }, { paren: '(', index: 57 },
        { paren: ')', index: 70 }, { paren: ')', index: 71 }, { paren: '(', index: 72 },
        { paren: ')', index: 85 }, { paren: ')', index: 86 }]
    ],
    [
        sampleCollections[4][0],
        sampleCollections[4][1],
        [{ paren: '(', index: 0 }, { paren: '(', index: 30 }, { paren: ')', index: 63 },
        { paren: '(', index: 64 }, { paren: ')', index: 85 },
        { paren: '(', index: 86 }, { paren: '(', index: 113 }, { paren: ')', index: 134 },
        { paren: '(', index: 135 }, { paren: ')', index: 150 }, { paren: ')', index: 151 }, { paren: ')', index: 152 }]
    ],
    [
        // https://regex101.com/r/VIRBkq/3
        // a valid SGF escapes closing brackets in node properties values \]
        // used string raw to avoid processing escape sequences
        'ignores parentheses in a node propety value (between brackets)',
        String.raw`(;A[aa];B[()](;C[d)(];D[af[(\]])(;E[a([\]a)\]](;F[\](afa0af)](;G[aa];H[\a()])))(;I[3\][())\]))((]))`,
        [{ paren: '(', index: 0 }, { paren: '(', index: 13 },
        { paren: ')', index: 31 }, { paren: '(', index: 32 }, { paren: '(', index: 46 },
        { paren: '(', index: 61 }, { paren: ')', index: 76 }, { paren: ')', index: 77 }, { paren: ')', index: 78 },
        { paren: '(', index: 79 }, { paren: ')', index: 97 }, { paren: ')', index: 98 }]
    ]

]

describe("Find indexes of opening and closing parentheses", () => {
    test.each(parenthesesTest)('Sequence with %s', (description, input, expected) => {
        const parenArr = getArrayOfParenthesesIndexes(input as string)
        expect(parenArr).toStrictEqual(expected)
    })
})

describe('Format SGF text', () => {
    // https://regex101.com/r/VV0EJ5/1
    test('Removes unnecessary whitespace and keeps new lines and white space in properties values', () => {
        const str = String.raw`  (;PW[A. Tari] WR[12k] KM [-59.5]RO[4]RE[B+R]PB[B. Lack]BR[5d]PC[London]EV[Go Congress]W[cd]
            C   [Game-info:
            Black: B. Lack, 5d
            White: A. Tari])))
              
            (  ;B   [dp]N[B d4]  )   
            (;B[pq]N[B q3]  )  
             (;B[oq]N[B p3]   )    `
        const formattedStr = formatSgf(str)
        const expected = String.raw`(;PW[A. Tari]WR[12k]KM[-59.5]RO[4]RE[B+R]PB[B. Lack]BR[5d]PC[London]EV[Go Congress]W[cd]C[Game-info:
            Black: B. Lack, 5d
            White: A. Tari])))(;B[dp]N[B d4])(;B[pq]N[B q3])(;B[oq]N[B p3])`
        expect(formattedStr).toEqual(expected)
    })
})

describe('Split nodes from from a node sequence', () => {
    // A NodeSequence is the concatenation of zero or more Nodes
    // A Node is a semicolon followed by a Property
    test('Split simple node sequence, ignoring ; in Prop values', () => {
        const input = ';B[qr]N[Time limits, captures & move numbers]BL[120.0]C[Black tim;e left: 120 sec]' +
            ';W[rr]WL[300]C[White time left: 300 sec]' +
            ';B[rq]BL[105.6]OB[10]C[Black time left: 105.6 sec Black stones left (;in this; byo-yomi period): 10]' +
            ';W[q;q]'
        const result = splitNodesFromStr(input)
        const expected = [
            "B[qr]N[Time limits, captures & move numbers]BL[120.0]C[Black tim;e left: 120 sec]",
            "W[rr]WL[300]C[White time left: 300 sec]",
            "B[rq]BL[105.6]OB[10]C[Black time left: 105.6 sec Black stones left (;in this; byo-yomi period): 10]",
            "W[q;q]"
        ]
        expect(result).toEqual(expected)
    })
})

describe('Get node move', () => {
    // https://regex101.com/r/KVC1XE/1
    test('Order and properties with similar properties ignored', () => {
        const inputs = ['B[cn]BL[105.6]OB[10]BA[aa]CB[90]', 'AW[jd]UC[1]W[ci]']
        const expected = [{ player: 'B', coords: 'cn' }, { player: 'W', coords: 'ci' }]
        const result = inputs.map(getNodeMove)
        expect(result).toEqual(expected)
    })
})

const propertiesTest = [
    ['white',
        'PW[jd]WL[1]W[ci]C[Black time left: 105.6 sec Black stones left (;in this; byo-yomi period): 10]',
        [
            { propName: 'PW', propValue: 'jd' },
            { propName: 'WL', propValue: '1' },
            { propName: 'C', propValue: 'Black time left: 105.6 sec Black stones left (;in this; byo-yomi period): 10' }
        ]
    ],
    ['black',
        'B[cn]C[White time left: 300 sec]BL[105.6]PB[10]TB[aa]KO[90]',
        [{ propName: 'C', propValue: 'White time left: 300 sec' },
        { propName: 'BL', propValue: '105.6' },
        { propName: 'PB', propValue: '10' },
        { propName: 'TB', propValue: 'aa' },
        { propName: 'KO', propValue: '90' }]
    ]
]

describe('Get node properties', () => {
    test.each(propertiesTest)('player %s', (description, input, expected) => {
        const result = getNodeProperties(input as string)
        expect(JSON.stringify(result)).toEqual(JSON.stringify(expected))
    })
})

const treeNodeTest = [
    [sampleCollections[0][0], sampleCollections[0][1], {
        id: 1,
        nodes: [
            {
                move: undefined,
                properties: [{ propName: 'FF', propValue: '4' }, { propName: 'GM', propValue: '1' }, { propName: 'SZ', propValue: '19' }]
            },
            {
                move: {
                    player: 'B',
                    coords: 'aa'
                },
                properties: []
            },
            {
                move: {
                    player: 'W',
                    coords: 'bb'
                },
                properties: []
            },
            {
                move: {
                    player: 'B',
                    coords: 'cc'
                },
                properties: []
            },
            {
                move: {
                    player: 'W',
                    coords: 'dd'
                },
                properties: []
            },
            {
                move: {
                    player: 'B',
                    coords: 'ad'
                },
                properties: []
            },
            {
                move: {
                    player: 'W',
                    coords: 'bd'
                },
                properties: []
            },
        ],
        subSequences: []
    }]
]

describe('Create Tree Node', () => {

    test.each(treeNodeTest)('Sequence with %s', (description, input, expected) => {
        const collection = createTreeNode(input as string)
        expect(JSON.stringify(collection)).toEqual(JSON.stringify(expected))
    })
})
