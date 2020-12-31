const SAMPLES = {
  // taken from: https://www.red-bean.com/sgf/examples/
  // https://www.red-bean.com/sgf/var.htm
  noVariation: `(;FF[4]GM[1]SZ[19];B[aa];W[bb];B[cc];W[dd];B[ad];W[bd])`,
  oneVariation: `(;FF[4]GM[1]SZ[19];B[aa];W[bb](;B[cc];W[dd];B[ad];W[bd])(;B[hh];W[hg]))`,
  twoVariations: `(;FF[4]GM[1]SZ[19];B[aa];W[bb](;B[cc]N[Var A];W[dd];B[ad];W[bd])(;B[hh]N[Var B];W[hg])(;B[gg]N[Var C];W[gh];B[hh];W[hg];B[kk]))`,
  twoVariationsAtDifferentMoves: `(;FF[4]GM[1]SZ[19];B[aa];W[bb](;B[cc];W[dd](;B[ad];W[bd])(;B[ee];W[ff]))(;B[hh];W[hg]))`,
  variationOfVariation: `(;FF[4]GM[1]SZ[19];B[aa];W[bb](;B[cc]N[Var A];W[dd];B[ad];W[bd])(;B[hh]N[Var B];W[hg])(;B[gg]N[Var C];W[gh];B[hh](;W[hg]N[Var A];B[kk])(;W[kl]N[Var B])))`,
  withProperties: `(;FF[4]AP[Primiview:3.1]GM[1]SZ[19]GN[Gametree 1: properties]US[Arno Hollosi]
  
  ;B[pd]N[Moves, comments, annotations]
  C[Nodename set to: "Moves, comments, annotations"];W[dp]GW[1]
  C[Marked as "Good for White"];B[pp]GB[2]
  C[Marked as "Very good for Black"];W[dc]GW[2]
  C[Marked as "Very good for White"];B[pj]DM[1]
  C[Marked as "Even position"];W[ci]UC[1]
  C[Marked as "Unclear position"];B[jd]TE[1]
  C[Marked as "Tesuji" or "Good move"];W[jp]BM[2]
  C[Marked as "Very bad move"];B[gd]DO[]
  C[Marked as "Doubtful move"];W[de]IT[]
  C[Marked as "Interesting move"];B[jj];
  C[White "Pass" move]W[];
  C[Black "Pass" move]B[tt])`
};

const sampleCollections = [
  ['no variation', SAMPLES.noVariation],
  ['one variation at one move', SAMPLES.oneVariation],
  ['two variations at one move', SAMPLES.twoVariations],
  ['two variations at different moves', SAMPLES.twoVariationsAtDifferentMoves],
  ['variation of a variation', SAMPLES.variationOfVariation],
]

const PropDesc = {
  // https://homepages.cwi.nl/~aeb/go/misc/sgf.html
  // Index list of types: https://www.red-bean.com/sgf/proplist_t.html
  // https://www.red-bean.com/sgf/sgf4.html#ebnf-def
  KO: 'Ko',
  TM: 'Total time for each player',
  OT: 'Overtime: type of byo-yomi used',
  LC: 'Number of overtime periods',
  LT: 'Length of overtime periods',
  KM: 'Komi',
  HA: 'Handicap',
  SZ: 'Board size',
  PL: 'Player to move first',
  RU: 'Rule set',
  RE: 'Result',
  TB: 'Black territory',
  TW: 'White territory',
  MN: 'Total number of moves',
  GC: 'Game comments',
  PB: 'Black player',
  PW: 'White player',
  BR: 'Black rank',
  WR: 'White rank',
  BC: 'Black country',
  WC: 'White country',
  BT: 'Black team',
  WT: 'White team',
  EV: 'Event',
  RO: 'Round',
  DT: 'Date',
  PC: 'Place',
  FF: 'File format',
  CA: 'Character set',
  AP: 'Application that produced the SGF file',
  SO: 'Source of information',
  US: 'User',
  AN: 'Author of comments',
  CP: 'Copyright',
  GN: 'Game name',
  C: 'Comment',
  OW: 'Overtime White',
  OB: 'Overtime Black',
  WL: 'White time left',
  BL: 'Black time left',
  N: 'Node name',
  GM: 'Type of game',
  AW: 'Add white (list of stones)',
  AB: 'Add black (list of stones)'
} as const

export { SAMPLES, sampleCollections, PropDesc };