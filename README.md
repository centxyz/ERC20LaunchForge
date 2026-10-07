# ERC20LaunchForge

ERC20LaunchForge turns a validated JSON token specification into a self-contained ERC-20 Solidity contract and deterministic build manifest. Generated contracts support standard transfers and allowances, ownership transfer, and optional mint, burn, and pause controls. The CLI can also compile the generated source through [SolcQueue](https://github.com/centxyz/SolcQueue).

It generates and compiles source; it never accepts private keys or deploys contracts.

## Install

```bash
git clone https://github.com/centxyz/ERC20LaunchForge.git
cd ERC20LaunchForge
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

To include compiled ABI and bytecode, start SolcQueue and add:

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

## Current limitations

- Generated source still requires independent review, testing, and security analysis before deployment.
- Optional ownership, minting, burning, and pausing controls introduce governance and trust considerations.
- The tool does not manage keys, deploy contracts, or guarantee token value or regulatory compliance.
