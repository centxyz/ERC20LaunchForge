import { promises as fs } from 'node:fs';
import path from 'node:path';
import minimist, { ParsedArgs } from 'minimist';
import { TokenForgeMax, TokenSpec } from './tokenforgemax';

interface Args extends ParsedArgs { input?: string; output?: string; compiler?: string; }

export async function main(argv = process.argv.slice(2)): Promise<number> {
    try {
        const args = minimist<Args>(argv, { string: ['input', 'output', 'compiler'], alias: { i: 'input', o: 'output', c: 'compiler' } });
        if (!args.input) throw new Error('Usage: tokenforgemax --input token.json [--output ./artifacts] [--compiler http://localhost:3000]');
        const spec = JSON.parse(await fs.readFile(args.input, 'utf8')) as TokenSpec;
        const forge = new TokenForgeMax(); const result = forge.forge(spec);
        const output = path.resolve(args.output || `./${result.contractName}-artifacts`);
        await fs.mkdir(output, { recursive: true });
        await fs.writeFile(path.join(output, result.fileName), result.source, 'utf8');
        let compiled: unknown; if (args.compiler) compiled = await forge.compile(result, args.compiler);
        const { source: _source, ...portable } = result;
        await fs.writeFile(path.join(output, 'manifest.json'), `${JSON.stringify({ product: 'TokenForgeMax', formatVersion: 1, ...portable, compiled }, null, 2)}\n`, 'utf8');
        console.log(JSON.stringify({ output, contractName: result.contractName, sourceHash: result.sourceHash, compiled: Boolean(compiled) }, null, 2));
        return 0;
    } catch (error) { console.error(error instanceof Error ? error.message : error); return 1; }
}

if (require.main === module) void main().then(code => { process.exitCode = code; });
