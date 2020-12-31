import { Parentheses, Node, Sequence, Move, Property, PropName } from "./types";
import { PropDesc } from "./constants";

// https://homepages.cwi.nl/~aeb/go/misc/sgfnotes.html#charset
export const formatSgf = (str: string): string => str.replace(/(?<!\[([^\\\]]|\\[^])*)\s(?!([^\\\[]|\\[^])*\])/g, "");

export const getArrayOfParenthesesIndexes = (str: string): Parentheses[] => {
  // especial chars like [], ; and () may appear in text fields of properties like C or N
  // the regex excludes pars that are between unescaped [ and ], this is between opening and closing brackets of a property value
  const parenRegex = /(?<!\[([^\\\[\]]|\\[^])*)\(|\)(?!([^\\\[\]]|\\[^])*\])/g;
  const parenArr = Array.from(str.matchAll(parenRegex), (par) => ({
    paren: par[0],
    index: par.index! // impossible to be undefined if there is a match
  }));

  return parenArr;
};

export const getNodeMove = (str: string): Move | undefined => {
  const groups = str.match(/(?<![A-Z])(?<player>B|W)\[(?<coords>[a-z]{0,2})\]/)?.groups;
  return groups
    ? ({ player: groups.player, coords: groups.coords } as Move)
    : groups;
};

export function splitNodeProperties(str: string): string[] {
  return str.split(/(?<=[^\\]\])(?=[A-Z]{1,2})/g)
}

export function getPropertyValues(input: string): string[] {
  const output = input.match(/(?<=\[)([^\\\]]|\\[^])*(?=\])/g)?.flatMap(value => {
    if (value.length === 5 && value.indexOf(':') !== -1) {
      return extractCompressedPointList(value)
    }
    return value
  }) ?? ['']
  return output
}

export const getPropertyIdent = (input: string): PropName => input.slice(0, input.indexOf('[')) as PropName

export function extractCompressedPointList(input: string): string[] {
  const abc = "abcdefghijklmnopqrstuvwxyz"
  let pointList: string[] = []
  const [x1, x2] = [abc.indexOf(input.charAt(0)), abc.indexOf(input.charAt(3))]
  const [y1, y2] = [abc.indexOf(input.charAt(1)), abc.indexOf(input.charAt(4))]
  for (let i = Math.min(x1, x2); i <= Math.max(x1, x2); i++) {
    for (let m = Math.min(y1, y2); m <= Math.max(y1, y2); m++) {
      pointList.push(abc[i] + abc[m])
    }
  }

  return pointList
}

export const getNodeProperties = (input: string): Property[] => {

  const props = splitNodeProperties(input)
  const propList: Property[] = props.map(prop => ({
    propName: getPropertyIdent(prop),
    propValue: getPropertyValues(prop)
  }))

  return propList;
};

export function createNodeFromStr(input: string): Node {
  let node: Node = {
    move: getNodeMove(input),
    properties: []
  }
  const moveMatch = input.match(/(?<![A-Z])(?<player>B|W)\[(?<coords>[a-z]{0,2})\]/)
  let propStr = input
  if (moveMatch) {
    propStr = input.slice(0, moveMatch.index) + input.slice(moveMatch.index! + moveMatch[0].length)
  }
  if (propStr.length !== 0) {
    node.properties = getNodeProperties(propStr)
  }

  return node
}

// takes a string like ;B[aa]C["Comment"]N["anotherproperty"];W[[bb];B[ol]
// and splits at ;, which is the start of a node in the SGF specification
// returns an array of strings of the divided nodes
// https://regex101.com/r/yqmG2W/1
export const splitNodesFromStr = (str: string): Array<string> => {
  return str.split(/(?<!\[[^\[\]]*);(?![^\[\]]*\])/g).slice(1)
}

export function createTreeNode(str: string): Sequence | undefined {
  let openSequences: Sequence[] = [];
  let currentSequence: Sequence;
  let closedSequence: Sequence | undefined;
  let sequenceCount = 0;

  const formattedSgf = formatSgf(str);
  const parList: Parentheses[] = getArrayOfParenthesesIndexes(formattedSgf);

  for (let i = 0; i < parList.length; i++) {
    const currentPar = parList[i];
    const nextPar: Parentheses | string = parList[i + 1] ?? "end of tree";
    if (currentPar.paren === "(") {
      const sequenceSubstr = formattedSgf.slice(
        currentPar.index + 1,
        nextPar.index
      );
      const splitNodes: string[] = splitNodesFromStr(sequenceSubstr);
      const nodesArr: Node[] = splitNodes.map((node): Node => createNodeFromStr(node))
      currentSequence = {
        id: ++sequenceCount,
        nodes: nodesArr,
        subSequences: []
      };
      openSequences.push(currentSequence);
    } else if (currentPar.paren === ")") {
      // the currentSequence, or last open sequence, ends
      closedSequence = openSequences.pop()!; // cant be undefined
      if (nextPar.paren === ")" || nextPar.paren === "(") {
        // it can be the case that the next par is another ),
        // which means the closed sequence is child of another one
        // the parent of the current/closed sequence is the last open sequence in the array
        // the ) marks the end of that parent sequence
        // the next par could be (, which means a sibling sequence starts
        // and they both would share the last non closed sequence as their parent
        closedSequence.parent = openSequences[openSequences.length - 1];
        openSequences[openSequences.length - 1].subSequences.push(
          closedSequence
        );
      }
    }
  }
  return closedSequence;
}

export function getPropertyDescription(propident: PropName): string {
  return PropDesc[propident]
}