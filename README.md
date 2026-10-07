# TokenForgeMax

TokenForgeMax turns a validated JSON token specification into a self-contained ERC-20 Solidity contract and deterministic build manifest. Generated contracts support standard transfers and allowances, ownership transfer, and optional mint, burn, and pause controls. The CLI can also compile the generated source through [SolidityStackDiamond](https://github.com/centxyz/SolidityStackDiamond).

It generates and compiles source; it never accepts private keys or deploys contracts.

## Install

```bash
git clone https://github.com/centxyz/TokenForgeMax.git
cd TokenForgeMax
npm install
npm run build
```

## Create a token project

Create `token.json` (or start with `examples/token.json`):

```json
{
  "name": "Cent Credit",
  "symbol": "CENT",
  "decimals": 18,
  "initialSupply": "1000000",
  "owner": "0x1111111111111111111111111111111111111111",
  "mintable": true,
  "burnable": true,
  "pausable": false
}
```

Generate source and a manifest:

```bash
npm start -- --input token.json --output ./artifacts
```

To include compiled ABI and bytecode, start SolidityStackDiamond and add:

```bash
npm start -- --input token.json --output ./artifacts --compiler http://localhost:3000
```

The generator validates names, symbols, decimals, owner addresses, decimal precision, and `uint256` supply bounds before writing anything.

## Verify

```bash
npm test
```

## License

MIT © cent
