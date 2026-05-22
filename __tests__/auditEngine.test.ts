// __tests__/auditEngine.test.ts
import { runAudit } from '@/lib/auditEngine';
import type { AuditFormData } from '@/lib/auditEngine';

// Test 1: Business plan with 2 users should recommend downgrade
test('Cursor Business with 2 seats recommends downgrade to Pro', () => {
  const input: AuditFormData = {
    teamSize: 2,
    useCase: 'coding',
    tools: [{ tool: 'cursor', plan: 'business', monthlySpend: 80, seats: 2, useCase: 'coding' }],
  };
  const result = runAudit(input);
  expect(result.recommendations[0].monthlySavings).toBeGreaterThan(0);
  expect(result.recommendations[0].severity).toBe('high');
});

// Test 2: Optimal plan should return 0 savings
test('Cursor Pro with 1 seat is optimal', () => {
  const input: AuditFormData = {
    teamSize: 1,
    useCase: 'coding',
    tools: [{ tool: 'cursor', plan: 'pro', monthlySpend: 20, seats: 1, useCase: 'coding' }],
  };
  const result = runAudit(input);
  expect(result.recommendations[0].monthlySavings).toBe(0);
  expect(result.recommendations[0].severity).toBe('optimal');
});

// Test 3: Claude Max for 1 user should recommend Pro
test('Claude Max for 1 user recommends downgrade to Pro', () => {
  const input: AuditFormData = {
    teamSize: 1,
    useCase: 'writing',
    tools: [{ tool: 'claude', plan: 'max', monthlySpend: 100, seats: 1, useCase: 'writing' }],
  };
  const result = runAudit(input);
  expect(result.recommendations[0].monthlySavings).toBe(80);
  expect(result.totalAnnualSavings).toBe(960);
});

// Test 4: isHighSavings flag triggers when savings > $500
test('isHighSavings is true when total savings exceed $500/mo', () => {
  const input: AuditFormData = {
    teamSize: 10,
    useCase: 'mixed',
    tools: [
      { tool: 'cursor', plan: 'business', monthlySpend: 400, seats: 10, useCase: 'mixed' },
      { tool: 'claude', plan: 'max', monthlySpend: 1000, seats: 10, useCase: 'mixed' },
    ],
  };
  const result = runAudit(input);
  expect(result.isHighSavings).toBe(true);
});

// Test 5: Empty tools array returns zero savings
test('Empty tools array returns zero savings', () => {
  const input: AuditFormData = {
    teamSize: 5,
    useCase: 'coding',
    tools: [],
  };
  const result = runAudit(input);
  expect(result.totalMonthlySavings).toBe(0);
  expect(result.totalAnnualSavings).toBe(0);
  expect(result.recommendations.length).toBe(0);
});

// Test 6: GitHub Copilot Enterprise with small team recommends Business
test('GitHub Copilot Enterprise with 3 seats recommends Business', () => {
  const input: AuditFormData = {
    teamSize: 3,
    useCase: 'coding',
    tools: [{ tool: 'github_copilot', plan: 'enterprise', monthlySpend: 117, seats: 3, useCase: 'coding' }],
  };
  const result = runAudit(input);
  expect(result.recommendations[0].monthlySavings).toBeGreaterThan(0);
});

// Test 7: Total annual savings = monthly * 12
test('Annual savings is exactly 12x monthly savings', () => {
  const input: AuditFormData = {
    teamSize: 2,
    useCase: 'coding',
    tools: [{ tool: 'cursor', plan: 'business', monthlySpend: 80, seats: 2, useCase: 'coding' }],
  };
  const result = runAudit(input);
  expect(result.totalAnnualSavings).toBe(result.totalMonthlySavings * 12);
});