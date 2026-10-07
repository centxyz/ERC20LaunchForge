const assert = require('node:assert/strict');
const { describe, test } = require('node:test');
const { TokenForgeMax, normalizeSpec } = require('../dist/tokenforgemax');

const spec = { name: 'Cent Credit', symbol: 'CENT', decimals: 6, initialSupply: '1000000.25', owner: '0x1111111111111111111111111111111111111111', mintable: true, burnable: true, pausable: true };

describe('TokenForgeMax', () => {
    test('normalizes supply into atomic units', () => { assert.equal(normalizeSpec(spec).initialSupplyUnits, '1000000250000'); });
    test('generates deterministic, self-contained ERC-20 source', () => {
        const forge = new TokenForgeMax(); const first = forge.forge(spec); const second = forge.forge(spec);
        assert.equal(first.sourceHash, second.sourceHash); assert.equal(first.contractName, 'CentCreditCENTToken');
        assert.match(first.source, /function transferFrom/); assert.match(first.source, /function mint/); assert.match(first.source, /function burn/); assert.match(first.source, /function setPaused/);
    });
    test('rejects unsafe or malformed token specifications', () => {
        assert.throws(() => normalizeSpec({ ...spec, symbol: 'BAD-SYMBOL' }), /symbol/);
        assert.throws(() => normalizeSpec({ ...spec, owner: '0x1234' }), /owner/);
        assert.throws(() => normalizeSpec({ ...spec, initialSupply: '1.0000001' }), /decimal places/);
    });
    test('compiles through SolidityStackDiamond', async () => {
        const forge = new TokenForgeMax(); const result = forge.forge(spec); let request;
        const payload = await forge.compile(result, 'http://localhost:3000', async (url, init) => {
            request = { url: String(url), body: JSON.parse(init.body) };
            return { ok: true, status: 200, json: async () => ({ contracts: [{ name: result.contractName, abi: [] }] }) };
        });
        assert.equal(request.url, 'http://localhost:3000/api/compile'); assert.equal(request.body.source, result.source); assert.equal(payload.contracts[0].name, result.contractName);
    });
});
