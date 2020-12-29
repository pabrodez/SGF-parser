# 📖 SGF text parser
A SGF text parser written in Typescript

## About SGF specification
> SGF is the standard format for go (igo, weiqi, baduk) game records, and is also used for several other games. SGF is a text-only format (not a binary format). It contains game trees, with all their nodes and properties, and nothing more. Thus the file format reflects the regular internal structure of a tree of property lists. There are no exceptions; if a game needs to store some information on file with the document, a (game-specific) property must be defined for that purpose. 
- [SGF spec web](https://www.red-bean.com/sgf/user_guide/index.html)
- https://homepages.cwi.nl/~aeb/go/misc/sgf.html#contents

## Use
```bash
npm install ts-sgf-parser
```
```javascript
import SgfParser from 'ts-sgf-parser'
const SgfParser = require('ts-sgf-parser').default

const parser = new SgfParser(String.raw`(;FF[4]GM[1]SZ[19];B[aa];W[bb](;B[cc];W[dd];B[ad];W[bd])(;B[hh];W[hg]))`)
```

## Tools
- Typescript
- Jest

## TODO:

- [ ] Support for setup properties and list of points values in Properties (AB, AW properties)
- [ ] Pretty printing
- [ ] Read text files via node
- [ ] Add webpack