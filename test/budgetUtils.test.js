import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { pathToFileURL } from 'node:url';

const projectRoot = process.cwd();

test('persists only budget fields after creating a month', async (t) => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'pennies-and-peas-'));
  const originalCwd = process.cwd();
  process.chdir(tempRoot);
  t.after(() => {
    process.chdir(originalCwd);
    fs.rmSync(tempRoot, { recursive: true, force: true });
  });

  const moduleUrl = pathToFileURL(path.join(projectRoot, 'utils', 'budgetUtils.js'));
  const { updateIncomes } = await import(`${moduleUrl.href}?test=${Date.now()}`);

  updateIncomes('2026', '08', [{ source: 'salary', amount: 32000 }]);

  const saved = JSON.parse(
    fs.readFileSync(path.join(tempRoot, 'data', 'budget-2026-08.json'), 'utf8'),
  );
  assert.deepEqual(saved, {
    incomes: [{ id: saved.incomes[0].id, source: 'salary', amount: 32000 }],
    expenses: [],
  });
});
