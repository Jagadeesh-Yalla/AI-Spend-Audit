// lib/auditEngine.ts
// Core audit logic — hardcoded rules are correct here.
// Knowing when NOT to use AI is part of the test.

export type PlanTier = string;
export type UseCase = 'coding' | 'writing' | 'data' | 'research' | 'mixed';

export interface ToolInput {
  tool: string;
  plan: string;
  monthlySpend: number;
  seats: number;
  useCase: UseCase;
}

export interface AuditFormData {
  tools: ToolInput[];
  teamSize: number;
  useCase: UseCase;
}

export interface ToolRecommendation {
  tool: string;
  currentPlan: string;
  currentSpend: number;
  recommendedAction: string;
  recommendedPlan?: string;
  estimatedNewSpend: number;
  monthlySavings: number;
  annualSavings: number;
  reason: string;
  severity: 'high' | 'medium' | 'low' | 'optimal';
}

export interface AuditResult {
  recommendations: ToolRecommendation[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  totalCurrentSpend: number;
  isHighSavings: boolean; // >$500/mo
  isAlreadyOptimal: boolean; // <$100/mo savings
}

// ── Pricing data (verified May 2026) ──────────────────────────────────────────
// Full sources in PRICING_DATA.md
const PRICING: Record<string, Record<string, number>> = {
  cursor: {
    hobby: 0,
    pro: 20,
    business: 40,
    enterprise: 100, // estimated
  },
  github_copilot: {
    individual: 10,
    business: 19,
    enterprise: 39,
  },
  claude: {
    free: 0,
    pro: 20,
    max: 100,
    team: 30, // per seat
    enterprise: 60, // per seat estimated
    api_direct: 0, // usage-based
  },
  chatgpt: {
    plus: 20,
    team: 30, // per seat
    enterprise: 60, // per seat estimated
    api_direct: 0, // usage-based
  },
  anthropic_api: {
    api_direct: 0, // usage-based
  },
  openai_api: {
    api_direct: 0, // usage-based
  },
  gemini: {
    free: 0,
    pro: 20,
    ultra: 300,
    api: 0, // usage-based
  },
  windsurf: {
    free: 0,
    pro: 15,
    teams: 35,
  },
};

// ── Audit rules ────────────────────────────────────────────────────────────────

function auditCursor(input: ToolInput): ToolRecommendation {
  const base = {
    tool: 'Cursor',
    currentPlan: input.plan,
    currentSpend: input.monthlySpend,
    estimatedNewSpend: input.monthlySpend,
    monthlySavings: 0,
    annualSavings: 0,
    reason: '',
    severity: 'optimal' as const,
    recommendedAction: 'Keep current plan',
  };

  // Business plan for <=2 users is overkill
  if (input.plan === 'business' && input.seats <= 2) {
    const newSpend = PRICING.cursor.pro * input.seats;
    const savings = input.monthlySpend - newSpend;
    return {
      ...base,
      recommendedAction: 'Downgrade to Pro',
      recommendedPlan: 'Pro',
      estimatedNewSpend: newSpend,
      monthlySavings: savings,
      annualSavings: savings * 12,
      reason: `Business plan ($40/seat) is designed for teams >5. With ${input.seats} seat(s), Pro ($20/seat) provides identical features at half the cost.`,
      severity: savings > 50 ? 'high' : 'medium',
    };
  }

  // If team is coding-focused and paying for Cursor Business, check if GitHub Copilot Business is cheaper
  if (input.plan === 'business' && input.useCase === 'coding' && input.seats >= 5) {
    const copilotAlt = PRICING.github_copilot.business * input.seats;
    const savings = input.monthlySpend - copilotAlt;
    if (savings > 20) {
      return {
        ...base,
        recommendedAction: 'Consider GitHub Copilot Business as alternative',
        recommendedPlan: 'GitHub Copilot Business',
        estimatedNewSpend: copilotAlt,
        monthlySavings: savings,
        annualSavings: savings * 12,
        reason: `For ${input.seats} coding-focused seats, GitHub Copilot Business ($19/seat) offers comparable AI code completion at ${Math.round((savings / input.monthlySpend) * 100)}% less cost.`,
        severity: 'medium',
      };
    }
  }

  return { ...base, reason: 'Your Cursor plan is well-matched to your team size and use case.' };
}

function auditGitHubCopilot(input: ToolInput): ToolRecommendation {
  const base = {
    tool: 'GitHub Copilot',
    currentPlan: input.plan,
    currentSpend: input.monthlySpend,
    estimatedNewSpend: input.monthlySpend,
    monthlySavings: 0,
    annualSavings: 0,
    reason: '',
    severity: 'optimal' as const,
    recommendedAction: 'Keep current plan',
  };

  if (input.plan === 'enterprise' && input.seats <= 5) {
    const newSpend = PRICING.github_copilot.business * input.seats;
    const savings = input.monthlySpend - newSpend;
    return {
      ...base,
      recommendedAction: 'Downgrade to Business',
      recommendedPlan: 'Business',
      estimatedNewSpend: newSpend,
      monthlySavings: savings,
      annualSavings: savings * 12,
      reason: `GitHub Copilot Enterprise ($39/seat) adds policy controls and PR summaries — valuable for large orgs. With ${input.seats} seats, Business ($19/seat) covers all core AI coding features.`,
      severity: savings > 30 ? 'high' : 'medium',
    };
  }

  if (input.useCase !== 'coding' && input.plan !== 'individual') {
    return {
      ...base,
      recommendedAction: 'Reconsider tool fit',
      reason: `GitHub Copilot is optimised for coding tasks. For ${input.useCase} use cases, Claude Pro or ChatGPT Plus may deliver better value per dollar.`,
      severity: 'medium',
    };
  }

  return { ...base, reason: 'GitHub Copilot plan aligns with your team size and coding focus.' };
}

function auditClaude(input: ToolInput): ToolRecommendation {
  const base = {
    tool: 'Claude',
    currentPlan: input.plan,
    currentSpend: input.monthlySpend,
    estimatedNewSpend: input.monthlySpend,
    monthlySavings: 0,
    annualSavings: 0,
    reason: '',
    severity: 'optimal' as const,
    recommendedAction: 'Keep current plan',
  };

  if (input.plan === 'max' && input.seats === 1) {
    const savings = PRICING.claude.max - PRICING.claude.pro;
    return {
      ...base,
      recommendedAction: 'Downgrade to Pro',
      recommendedPlan: 'Pro',
      estimatedNewSpend: PRICING.claude.pro,
      monthlySavings: savings,
      annualSavings: savings * 12,
      reason: `Claude Max ($100/mo) unlocks 5× more usage than Pro. For a single user without documented usage limits on Pro, downgrading to Pro ($20/mo) saves $${savings}/mo unless you regularly hit Pro limits.`,
      severity: 'high',
    };
  }

  if (input.plan === 'team' && input.seats <= 2) {
    const newSpend = PRICING.claude.pro * input.seats;
    const savings = input.monthlySpend - newSpend;
    if (savings > 0) {
      return {
        ...base,
        recommendedAction: 'Switch to individual Pro plans',
        recommendedPlan: 'Pro (individual)',
        estimatedNewSpend: newSpend,
        monthlySavings: savings,
        annualSavings: savings * 12,
        reason: `Claude Team ($30/seat) adds collaboration features. With ${input.seats} users, individual Pro plans ($20/seat) save $${savings}/mo with near-identical capabilities.`,
        severity: savings > 20 ? 'medium' : 'low',
      };
    }
  }

  return { ...base, reason: 'Your Claude plan is appropriate for your team size and usage pattern.' };
}

function auditChatGPT(input: ToolInput): ToolRecommendation {
  const base = {
    tool: 'ChatGPT',
    currentPlan: input.plan,
    currentSpend: input.monthlySpend,
    estimatedNewSpend: input.monthlySpend,
    monthlySavings: 0,
    annualSavings: 0,
    reason: '',
    severity: 'optimal' as const,
    recommendedAction: 'Keep current plan',
  };

  if (input.plan === 'team' && input.seats <= 2) {
    const newSpend = PRICING.chatgpt.plus * input.seats;
    const savings = input.monthlySpend - newSpend;
    if (savings > 0) {
      return {
        ...base,
        recommendedAction: 'Switch to individual Plus plans',
        recommendedPlan: 'Plus (individual)',
        estimatedNewSpend: newSpend,
        monthlySavings: savings,
        annualSavings: savings * 12,
        reason: `ChatGPT Team ($30/seat) is designed for collaborative workflows. With ${input.seats} seat(s), individual Plus plans ($20/seat) provide equivalent model access at lower cost.`,
        severity: 'medium',
      };
    }
  }

  // Coding use case — suggest Cursor or Copilot instead
  if (input.useCase === 'coding' && input.plan !== 'api_direct') {
    return {
      ...base,
      recommendedAction: 'Consider switching to a coding-native tool',
      reason: `ChatGPT is a general-purpose tool. For coding-focused teams, Cursor ($20/seat) or GitHub Copilot Individual ($10/seat) provides IDE-native AI assistance that delivers higher ROI per dollar.`,
      severity: 'medium',
    };
  }

  return { ...base, reason: 'ChatGPT plan is well-matched to your use case.' };
}

function auditGemini(input: ToolInput): ToolRecommendation {
  const base = {
    tool: 'Gemini',
    currentPlan: input.plan,
    currentSpend: input.monthlySpend,
    estimatedNewSpend: input.monthlySpend,
    monthlySavings: 0,
    annualSavings: 0,
    reason: '',
    severity: 'optimal' as const,
    recommendedAction: 'Keep current plan',
  };

  if (input.plan === 'ultra') {
    const savings = PRICING.gemini.ultra - PRICING.gemini.pro;
    return {
      ...base,
      recommendedAction: 'Evaluate downgrade to Pro',
      recommendedPlan: 'Pro',
      estimatedNewSpend: PRICING.gemini.pro,
      monthlySavings: savings,
      annualSavings: savings * 12,
      reason: `Gemini Ultra ($300/mo) provides access to Gemini Ultra model. Unless you have documented tasks requiring Ultra's capabilities over Pro, Claude Pro or ChatGPT Plus offer comparable general intelligence at $20/mo.`,
      severity: 'high',
    };
  }

  return { ...base, reason: 'Your Gemini plan appears reasonable for your use case.' };
}

function auditWindsurf(input: ToolInput): ToolRecommendation {
  const base = {
    tool: 'Windsurf',
    currentPlan: input.plan,
    currentSpend: input.monthlySpend,
    estimatedNewSpend: input.monthlySpend,
    monthlySavings: 0,
    annualSavings: 0,
    reason: '',
    severity: 'optimal' as const,
    recommendedAction: 'Keep current plan',
  };

  if (input.plan === 'teams' && input.seats <= 3) {
    const newSpend = PRICING.windsurf.pro * input.seats;
    const savings = input.monthlySpend - newSpend;
    if (savings > 0) {
      return {
        ...base,
        recommendedAction: 'Switch to individual Pro plans',
        recommendedPlan: 'Pro (individual)',
        estimatedNewSpend: newSpend,
        monthlySavings: savings,
        annualSavings: savings * 12,
        reason: `Windsurf Teams ($35/seat) adds admin controls. With ${input.seats} seat(s), individual Pro plans ($15/seat) save $${savings}/mo with comparable AI coding capabilities.`,
        severity: savings > 20 ? 'medium' : 'low',
      };
    }
  }

  return { ...base, reason: 'Your Windsurf plan is appropriately sized for your team.' };
}

function auditAPITool(toolName: string, input: ToolInput): ToolRecommendation {
  return {
    tool: toolName,
    currentPlan: 'API Direct (usage-based)',
    currentSpend: input.monthlySpend,
    estimatedNewSpend: input.monthlySpend,
    monthlySavings: 0,
    annualSavings: 0,
    recommendedAction: 'Review usage patterns',
    reason: `API direct billing is usage-based and often optimal for developers. Ensure you're using the right model tier — e.g., claude-haiku or gpt-4o-mini for high-volume, low-complexity tasks can cut costs by 80% vs flagship models.`,
    severity: 'low',
  };
}

// ── Main audit function ────────────────────────────────────────────────────────

export function runAudit(formData: AuditFormData): AuditResult {
  const recommendations: ToolRecommendation[] = [];

  for (const toolInput of formData.tools) {
    if (toolInput.monthlySpend === 0) continue; // skip tools not in use

    let rec: ToolRecommendation;

    switch (toolInput.tool) {
      case 'cursor':
        rec = auditCursor(toolInput);
        break;
      case 'github_copilot':
        rec = auditGitHubCopilot(toolInput);
        break;
      case 'claude':
        rec = auditClaude(toolInput);
        break;
      case 'chatgpt':
        rec = auditChatGPT(toolInput);
        break;
      case 'anthropic_api':
        rec = auditAPITool('Anthropic API', toolInput);
        break;
      case 'openai_api':
        rec = auditAPITool('OpenAI API', toolInput);
        break;
      case 'gemini':
        rec = auditGemini(toolInput);
        break;
      case 'windsurf':
        rec = auditWindsurf(toolInput);
        break;
      default:
        rec = {
          tool: toolInput.tool,
          currentPlan: toolInput.plan,
          currentSpend: toolInput.monthlySpend,
          estimatedNewSpend: toolInput.monthlySpend,
          monthlySavings: 0,
          annualSavings: 0,
          recommendedAction: 'Keep current plan',
          reason: 'No specific optimisation rules available for this tool yet.',
          severity: 'optimal',
        };
    }

    recommendations.push(rec);
  }

  const totalMonthlySavings = recommendations.reduce((sum, r) => sum + r.monthlySavings, 0);
  const totalCurrentSpend = recommendations.reduce((sum, r) => sum + r.currentSpend, 0);

  return {
    recommendations,
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
    totalCurrentSpend,
    isHighSavings: totalMonthlySavings > 500,
    isAlreadyOptimal: totalMonthlySavings < 100,
  };
}