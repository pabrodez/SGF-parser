import { sampleCollections } from "../src/constants"
import { SgfParser } from "../src/SgfParser"

describe('Next node', () => {
    test('Returns next node', () => {
        const parser = new SgfParser(sampleCollections[0][1])
        const expected = {
            move: {
                player: 'W',
                coords: 'bb'
            },
            properties: []
        }

        parser.nextNode()
        parser.nextNode()

        expect(parser.currentNode).toEqual(expected)
    })

    test('Returns first node when end of sequence reached', () => {
        const parser = new SgfParser(sampleCollections[0][1])
        const expected = {
            move: undefined,
            properties: [{ propName: 'FF', propValue: '4' }, { propName: 'GM', propValue: '1' }, { propName: 'SZ', propValue: '19' }]
        }

        for (let i = 0; i < 7; i++) {
            parser.nextNode()
        }

        expect(parser.currentNode).toEqual(expected)
    })

    test('Follows the main line', () => {
        const parser = new SgfParser(sampleCollections[3][1])
        const expected = {
            move: {
                player: 'W',
                coords: 'bd'
            },
            properties: []
        }
        for (let i = 0; i < 6; i++) {
            parser.nextNode()
        }
        expect(parser.currentNode).toEqual(expected)
    })

})

describe('Variations', () => {
    test('Returns all subsequences starting from the current node', () => {
        const parser = new SgfParser(sampleCollections[4][1])
        const expected = [{
            move: {
                player: 'B',
                coords: 'cc'
            },
            properties: [{ propName: 'N', propValue: 'Var A' }]
        }, {
            move: {
                player: 'B',
                coords: 'hh'
            },
            properties: [{ propName: 'N', propValue: 'Var B' }]
        },
        {
            move: {
                player: 'B',
                coords: 'gg'
            },
            properties: [{ propName: 'N', propValue: 'Var C' }]
        }]
        for (let i = 0; i < 2; i++) {
            parser.nextNode()
        }
        const result = parser.variationsFromCurrentNode().map(seq => seq.nodes[0])
        expect(JSON.stringify(result)).toEqual(JSON.stringify(expected))
    })

    test('Returns empty when no variations', () => {
        const parser = new SgfParser(sampleCollections[4][1])
        parser.nextNode()
        expect(parser.variationsFromCurrentNode()).toStrictEqual([])
    })
})

describe('Move Node', () => {
    test('Returns the class instance', () => {
        const parser = new SgfParser(sampleCollections[0][1])
        const returnedInstance = parser.moveNode(3)
        expect(returnedInstance).toStrictEqual(parser)
    })
})

describe('Previous Node', () => {
    test('When current node is first returns last node of parent sequence', () => {
        const parser = new SgfParser(sampleCollections[1][1])
        const expected = {
            move: {
                player: 'W',
                coords: 'bb'
            },
            properties: []
        }
        parser.moveNode(3)

        const result = parser.backNode().currentNode
        expect(result).toStrictEqual(expected)
    })
    test('Returns last node of main line, when current node is first', () => {
        const parser = new SgfParser(sampleCollections[4][1])
        const expected = {
            move: {
                player: 'W',
                coords: 'bd'
            },
            properties: []
        }
        const result = parser.previousNode()
        expect(result).toEqual(expected)
    })
})

describe('Get main line', () => {
    test('Returns an array of all sequences belonging to main line', () => {
        const parser = new SgfParser(sampleCollections[3][1])
        const expected = `[{"properties":[{"propName":"FF","propValue":"4"},{"propName":"GM","propValue":"1"},{"propName":"SZ","propValue":"19"}]},{"move":{"player":"B","coords":"aa"},"properties":[]},{"move":{"player":"W","coords":"bb"},"properties":[]},{"move":{"player":"B","coords":"cc"},"properties":[]},{"move":{"player":"W","coords":"dd"},"properties":[]},{"move":{"player":"B","coords":"ad"},"properties":[]},{"move":{"player":"W","coords":"bd"},"properties":[]}]`

        const result = parser.getMainLine()
        expect(JSON.stringify(result)).toEqual(expected)
    })
})

describe('Choose variation index', () => {
    test('Access the chosen subsequence when end of current sequenced reached', () => {
        const parser = new SgfParser(sampleCollections[3][1])
        const expect1 = {
            move: {
                player: 'W',
                coords: 'hg'
            },
            properties: []
        }
        const expect2 = {
            move: {
                player: 'B',
                coords: 'ee'
            },
            properties: []
        }
        expect(parser.chooseVariationIndex(1).moveNode(4).currentNode)
            .toStrictEqual(expect1);
        expect(parser.backNode(2).chooseVariationIndex(0).moveNode(2).chooseVariationIndex(1).moveNode().currentNode)
            .toStrictEqual(expect2);
    })

})

describe('Back to closest main', () => {
    test('Returns closest sequence that belongs to main line closest to current sequence', () => {
        const parser = new SgfParser(sampleCollections[3][1])
        const expected = 2
        const result = parser.moveNode(4).chooseVariationIndex(1).moveNode().backToClosestMain().currentSequence.id

        expect(result).toBe(expected)
    })        
})

