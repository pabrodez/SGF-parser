import { PropDesc } from "./constants";

export type PropName = keyof typeof PropDesc;

export interface Parentheses {
    paren: string;
    index: number;
}

export interface Property {
    propName: PropName;
    propValue: string;
}

export interface Move {
    player: "B" | "W";
    coords: string;
}

export interface Node {
    properties: Property[] | undefined;
    move: Move | undefined;
  }
  
export interface Sequence {
    id: number;
    nodes: Node[];
    subSequences: Sequence[];
    parent?: Sequence;
  }