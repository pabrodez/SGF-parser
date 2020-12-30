import { Node, Property, Sequence } from "./types";
import { createTreeNode, getPropertyDescription } from "./utils";

export class SgfParser {
    private _sgfText: string
    private _collection: Sequence;
    private _currentSequence: Sequence;
    private _currentSubsequenceIndex: number = 0;
    private _currentNode: Node;
    private _nodeIndex: number = 0

    constructor(sgfText: string) {
        if (sgfText.length === 0) throw 'Empty string'
        this._sgfText = sgfText
        this._collection = this.parseCollection(this._sgfText)
        this._currentSequence = this._collection
        this._currentNode = this.currentSequence.nodes[0]
    }

    private seqBelongsToMainLine(id: number): boolean {
        if (this._collection.id === id) return true
        let result = false
        result = this.getMainLine().some(seq => seq.id === id)
        return result
    }

    chooseVariationIndex(index: number): SgfParser {
        // movNode goes to the first subsequence by default, but
        // we may want to follow a different variation
        let ind = Math.floor(index)
        const totalSubs = this._currentSequence.subSequences.length - 1
        if (ind > totalSubs) ind = totalSubs;
        this._currentSubsequenceIndex = ind

        return this
    }

    private getFirstChild(sequence: Sequence): Sequence | undefined {
        return sequence.subSequences[0]
    }

    backToClosestMain(): SgfParser {
        // change current sequence that doesnt belong to main line
        // to the closest sequence that belongs to main line up
        if (this._currentSequence.id === this._collection.id) return this;
        if (this._currentSequence.parent?.id === this._collection.id) {
            this._currentSequence = this._collection
        } else {
            const mainLineIds: number[] = this.getMainLine().map(seq => seq.id)
            while (this._currentSequence?.parent !== undefined
                && !mainLineIds.includes(this._currentSequence.id)) {
                this._currentSequence = this._currentSequence.parent
            }
        }

        this._nodeIndex = this._currentSequence.nodes.length - 1
        this._currentNode = this._currentSequence.nodes[this._nodeIndex]

        return this;
    }

    getMainLine(): Sequence[] {
        let mainSeqs: Sequence[] = [...this._collection.subSequences]

        let currentSequence: Sequence = this._collection;
        let firstChild = this.getFirstChild(currentSequence)
        while (firstChild !== undefined) {
            mainSeqs.push(firstChild);
            [currentSequence, firstChild] = [firstChild, this.getFirstChild(firstChild)]
        }

        return mainSeqs
    }

    getGameInfo(): (Property & { propDesc: string })[] | undefined {
        const props: (Property & { propDesc: string })[] | undefined = this._collection.nodes[0].properties
            ?.map((prop: Property) => ({ ...prop, propDesc: getPropertyDescription(prop.propName) }))
        return props
    }

    moveNode(times?: number): SgfParser {
        if (times && times > 0) {
            for (let i = 0; i < times; i++) {
                this.moveNode()
            }
        } else {
            const currentSeqTotalNodes = this.currentSequence.nodes.length
            if ((currentSeqTotalNodes - 1) === this._nodeIndex) {
                // reach end of node sequence
                this._nodeIndex = 0
                // carry on with chosen line (if there is one)
                if (this._currentSequence.subSequences.length !== 0) {
                    this._currentSequence = this.currentSequence.subSequences[this._currentSubsequenceIndex]
                    this._currentSubsequenceIndex = 0
                } else {
                    // reach end of line
                    console.info('End of line reached')
                    this._currentSequence = this._collection
                }
                this._currentNode = this.currentSequence.nodes[this._nodeIndex]
            } else {
                this._currentNode = this.currentSequence.nodes[++this._nodeIndex]
            }
        }
        return this
    }

    resetCollection(): void {
        this._currentSequence = this._collection
        this._currentNode = this._currentSequence.nodes[0];
        this._nodeIndex = 0
        this._currentSubsequenceIndex = 0
    }

    backNode(times?: number): SgfParser {
        if (times && times > 0) {
            for (let i = 0; i < times; i++) {
                this.backNode()
            }
        } else {
            if (this._nodeIndex === 0) {
                const parentSeq = this.currentSequence.parent
                if (parentSeq) {
                    // get last node of parent sequence
                    this._nodeIndex = parentSeq.nodes.length - 1
                    this._currentNode = parentSeq.nodes[this._nodeIndex]
                    this._currentSequence = parentSeq
                } else {
                    // we reached the beginning of the line
                    let hasSubsequences = this.currentSequence.subSequences.length > 0
                    while (hasSubsequences) {
                        this._currentSequence = this.currentSequence.subSequences[0]
                        hasSubsequences = this.currentSequence.subSequences.length > 0
                    }
                    this._nodeIndex = this.currentSequence.nodes.length - 1
                    this._currentNode = this.currentSequence.nodes[this._nodeIndex]
                }
            } else {
                this._currentNode = this.currentSequence.nodes[--this._nodeIndex]
            }
        }

        return this
    }

    previousNode(): Node {
        this.backNode()
        return this._currentNode
    }

    nextNode(): Node {
        this.moveNode()
        return this._currentNode
    }

    getSequence(id: number): Sequence | null {
        if (this._collection.id === id) return this._collection

        let seqWithId: Sequence | null = null

        const findSeqWithId = (sequence: Sequence): Sequence | null => {
            if (sequence.id === id) return sequence

            for (const child of sequence.subSequences) {
                let found: Sequence | null = findSeqWithId(child)
                if (found !== null) return found
            }

            return null
        }

        seqWithId = findSeqWithId(this._collection)

        return seqWithId
    }

    variationsFromCurrentNode(): Sequence[] {
        return this._nodeIndex === this._currentSequence.nodes.length - 1 && this._currentSequence.subSequences.length !== 0
            ? this._currentSequence.subSequences
            : []
    }

    private parseCollection(str: string): Sequence {
        const collection: Sequence | undefined = createTreeNode(str)

        if (collection === undefined) throw 'Collection parsed is undefined\nCheck validity of SGF text'

        return collection
    }

    get currentSequence(): Sequence {
        return this._currentSequence
    }

    get currentNode(): Node {
        return this._currentNode
    }

    prettyPrint(): string | undefined {
        const gameInfo: string | undefined = this.getGameInfo()
        ?.reduce((acc, curr) => `${acc} ${curr.propName}: ${curr.propValue}`, "")
        

        return gameInfo 
    }


}