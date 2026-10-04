const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const vm = require('node:vm');
const source = fs.readFileSync('src/data/mockData.ts', 'utf8');
const {outputText} = ts.transpileModule(source, {compilerOptions:{module:ts.ModuleKind.CommonJS, target:ts.ScriptTarget.ES2020}});
const sandbox = {exports:{}};
vm.runInNewContext(outputText, sandbox);
const data = sandbox.exports;
let checks = 0;
for (const [name, rows] of Object.entries(data)) {
  if (!Array.isArray(rows)) continue;
  if (rows.every(row => typeof row.id === 'string')) {
    assert.equal(new Set(rows.map(row => row.id)).size, rows.length, `${name}: duplicate IDs`);
    checks++;
  }
}
for (const log of data.INITIAL_EXTRACTED_LOGS) {
  assert.equal(log.extractedMedicinesCount, log.extractedItems.length, `${log.id}: extraction count`);
  assert.equal(log.matchedMedicinesCount, log.extractedItems.filter(item => item.matchStatus === 'matched').length, `${log.id}: matched count`);
  assert.ok(log.extractedItems.every(item => item.confidence >= 0 && item.confidence <= 1), `${log.id}: confidence range`);
  checks += 3;
}
for (const mapping of data.INITIAL_MEDICINE_MAPPINGS) {
  assert.ok(mapping.availableOptions.some(option => option.name === mapping.selectedMapping), `${mapping.id}: selection missing from options`);
  assert.ok(mapping.quantity > 0 && mapping.price >= 0, `${mapping.id}: quantity/price`);
  checks += 2;
}
for (const role of data.INITIAL_ROLE_DEFINITIONS) {
  const permissions = role.groups.flatMap(group => group.permissions);
  assert.equal(new Set(permissions.map(permission => permission.id)).size, permissions.length, `${role.id}: duplicate permission IDs`);
  checks++;
}
const matching = data.AI_COMPONENTS_DATA.find(card => card.role === 'medicine_matching');
assert.equal(matching.evaluation.metricValue, '99.31%');
assert.ok(matching.evaluation.productionBenchmarkNote.includes('No production accuracy measurement is provided'));
checks += 2;
console.log(`Mock data integrity: ${checks} checks passed.`);
