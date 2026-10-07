const { TokenForgeMax } = require('../dist/tokenforgemax');

describe('TokenForgeMax', () => {
    test('executes and records completed work', async () => {
        const app = new TokenForgeMax();
        const result = await app.execute();

        expect(result.success).toBe(true);
        expect(result.data).toMatchObject({ processed: 1, status: 'completed' });
        expect(app.getStatistics()).toMatchObject({ processed: 1 });
    });
});
