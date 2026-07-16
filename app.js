const scenarios = [
  {
    id: "r10",
    mttrMin: 95,
    mttrTargetMin: 60,
    mttrClass: "ACH return",
    label: "ACH R10",
    title: "Unauthorized debit claim",
    market: "United States",
    rail: "ACH return",
    queueAge: "18m",
    tags: ["ach", "authorization", "approval"],
    signalCode: "R10",
    signalType: "ACH return code",
    risk: "Critical",
    riskTone: "danger",
    owner: "Compliance + Partner Ops",
    primaryPersona: "Compliance analyst",
    secondaryPersona: "Partner Ops lead",
    personaWhy:
      "Unauthorized debit claims need evidence collection, retry blocking, and partner-level concentration monitoring.",
    approval: "Required",
    kpi: "Unauthorized return rate",
    problem:
      "The customer says the debit was not authorized. This is not a normal retry problem. The safe action is to block automatic retry, collect authorization evidence, and route the case to compliance.",
    runbook: [
      "Block retry automation for this originator and receiving account pair.",
      "Collect authorization evidence and partner-support context.",
      "Route the exception to compliance and partner ops.",
      "Track partner-level unauthorized return concentration."
    ],
    trace: [
      "Bank link created",
      "ACH debit initiated",
      "Return event received: R10",
      "Retry blocked pending review"
    ],
    guardrail:
      "The workbench can stage a review case. It cannot decide whether a debit was legally authorized.",
    source:
      "Nacha distinguishes unauthorized return reasons and treats R10 as a high-risk authorization claim.",
    sourceUrl: "https://www.nacha.org/rules/differentiating-unauthorized-return-reasons",
    confidence: "Standardized external return code",
    payload: {
      action: "stage_compliance_review",
      auto_execute: false,
      signal_code: "R10",
      signal_type: "ach_return_code",
      rail: "ach",
      transfer_id: "trf_synth_8831",
      required_approval: ["compliance", "partner_ops"],
      controls: ["block_retry", "collect_authorization_evidence", "monitor_partner_return_rate"]
    }
  },
  {
    id: "r01",
    mttrMin: 28,
    mttrTargetMin: 20,
    mttrClass: "ACH return",
    label: "ACH R01",
    title: "Insufficient funds",
    market: "United States",
    rail: "ACH return",
    queueAge: "27m",
    tags: ["ach"],
    signalCode: "R01",
    signalType: "ACH return code",
    risk: "Medium",
    riskTone: "warning",
    owner: "Partner Ops",
    primaryPersona: "Partner Ops lead",
    secondaryPersona: "Support specialist",
    personaWhy:
      "Insufficient-funds returns need policy-safe retry decisions and customer messaging without escalating to compliance by default.",
    approval: "Policy check",
    kpi: "Funding conversion",
    problem:
      "The account did not have enough available funds. The product should keep this separate from authorization disputes and suggest a policy-controlled retry or customer notification path.",
    runbook: [
      "Check partner retry policy and customer notification rules.",
      "Confirm there is no related unauthorized-return pattern.",
      "Stage a customer notification with a safe retry window.",
      "Measure repeat R01 concentration by partner and bank."
    ],
    trace: [
      "ACH debit initiated",
      "Debit sent to clearing",
      "Return event received: R01",
      "Retry window staged for policy review"
    ],
    guardrail:
      "Do not automatically retry unless the partner policy explicitly allows it and risk thresholds are clear.",
    source:
      "ACH return codes identify failed ACH entries. R01 is commonly used for insufficient funds.",
    sourceUrl: "https://developer.gs.com/docs/services/transaction-banking/ach-return-codes/",
    confidence: "Standardized external return code",
    payload: {
      action: "stage_retry_policy_check",
      auto_execute: false,
      signal_code: "R01",
      signal_type: "ach_return_code",
      rail: "ach",
      transfer_id: "trf_synth_1490",
      required_approval: ["partner_ops"],
      controls: ["check_retry_policy", "notify_customer", "monitor_repeat_returns"]
    }
  },
  {
    id: "r03",
    mttrMin: 70,
    mttrTargetMin: 45,
    mttrClass: "ACH return",
    label: "ACH R03",
    title: "Unable to locate account",
    market: "United States",
    rail: "ACH return",
    queueAge: "2h",
    tags: ["ach", "bank-link", "approval"],
    signalCode: "R03",
    signalType: "ACH return code",
    risk: "High",
    riskTone: "danger",
    owner: "Partner Ops + Integration",
    primaryPersona: "Integration engineer",
    secondaryPersona: "Partner Ops lead",
    personaWhy:
      "Account-location failures usually need bank-link or ACH-relationship repair before another funding attempt.",
    approval: "Required",
    kpi: "Funding conversion",
    problem:
      "The receiving account cannot be found. Retrying blindly is likely to fail again. The useful next step is to repair or refresh bank-link data before another funding attempt.",
    runbook: [
      "Stop automatic retry for this bank relationship.",
      "Trace bank-link token exchange and ACH relationship creation state.",
      "Ask the partner to refresh bank details or relink the account.",
      "Stage a bank-link repair task with evidence attached."
    ],
    trace: [
      "Partner collected bank link",
      "Processor token exchanged",
      "ACH relationship created",
      "Return event received: R03"
    ],
    guardrail:
      "Do not mark the user or partner as bad. Treat this as a recoverable data or bank-link repair path until reviewed.",
    source:
      "Alpaca ACH funding docs describe Plaid processor-token setup for ACH relationships. ACH references define R03 as no account or unable to locate account.",
    sourceUrl: "https://docs.alpaca.markets/us/docs/ach-funding",
    confidence: "Standardized external return code",
    payload: {
      action: "stage_bank_link_repair",
      auto_execute: false,
      signal_code: "R03",
      signal_type: "ach_return_code",
      rail: "ach",
      transfer_id: "trf_synth_2039",
      proposed_endpoint: "POST /v1/accounts/{account_id}/ach_relationships",
      required_approval: ["partner_ops", "integration_engineering"],
      evidence_to_collect: ["processor_token_trace", "ach_relationship_id"]
    }
  },
  {
    id: "r07",
    mttrMin: 88,
    mttrTargetMin: 60,
    mttrClass: "ACH return",
    label: "ACH R07",
    title: "Authorization revoked",
    market: "United States",
    rail: "ACH return",
    queueAge: "44m",
    tags: ["ach", "authorization", "approval"],
    signalCode: "R07",
    signalType: "ACH return code",
    risk: "Critical",
    riskTone: "danger",
    owner: "Compliance",
    primaryPersona: "Compliance analyst",
    secondaryPersona: "Partner Ops lead",
    personaWhy:
      "Revoked authorization is a stop condition, so the right user is the person controlling mandates and retry eligibility.",
    approval: "Required",
    kpi: "Authorization defect rate",
    problem:
      "The customer previously authorized the debit but has revoked that authorization. The product should prevent further pulls from that mandate and route the issue as an authorization-control case.",
    runbook: [
      "Disable future debit attempts tied to the revoked authorization.",
      "Attach customer communication and mandate history.",
      "Notify partner ops that a new authorization is required.",
      "Escalate if repeated revocations cluster around one partner flow."
    ],
    trace: [
      "ACH relationship active",
      "Recurring debit initiated",
      "Return event received: R07",
      "Mandate marked revoked pending review"
    ],
    guardrail:
      "Do not ask the system to infer consent. Treat revoked authorization as a compliance-controlled stop condition.",
    source:
      "Unauthorized and authorization-related ACH returns require different handling from ordinary failed funding attempts.",
    sourceUrl: "https://www.nacha.org/rules/differentiating-unauthorized-return-reasons",
    confidence: "Standardized external return code",
    payload: {
      action: "disable_revoked_authorization",
      auto_execute: false,
      signal_code: "R07",
      signal_type: "ach_return_code",
      rail: "ach",
      transfer_id: "trf_synth_5127",
      required_approval: ["compliance"],
      controls: ["stop_debit_attempts", "attach_mandate_history", "request_new_authorization"]
    }
  },
  {
    id: "r11",
    mttrMin: 75,
    mttrTargetMin: 50,
    mttrClass: "ACH return",
    label: "ACH R11",
    title: "Authorization terms error",
    market: "United States",
    rail: "ACH return",
    queueAge: "1h",
    tags: ["ach", "authorization", "approval"],
    signalCode: "R11",
    signalType: "ACH return code",
    risk: "High",
    riskTone: "danger",
    owner: "Compliance + Product Ops",
    primaryPersona: "Product Ops PM",
    secondaryPersona: "Compliance analyst",
    personaWhy:
      "R11 can point to a funding-flow copy, timing, or mandate-quality defect that product ops should feed back into the onboarding flow.",
    approval: "Required",
    kpi: "Authorization quality",
    problem:
      "The customer indicates an authorization exists, but the entry does not match its terms. That points to product-copy, timing, amount, or mandate-quality issues rather than a simple bank-account failure.",
    runbook: [
      "Hold retry and compare the debit amount, date, and account against authorization evidence.",
      "Route the case to compliance and product ops.",
      "Tag the partner flow that created the authorization.",
      "Feed confirmed defects into onboarding and funding-copy review."
    ],
    trace: [
      "Authorization captured",
      "Debit submitted",
      "Return event received: R11",
      "Authorization terms review staged"
    ],
    guardrail:
      "Do not collapse R11 into R10. R11 can indicate that authorization exists but execution terms were wrong.",
    source:
      "Nacha introduced clearer differentiation between R10 and R11 to separate unauthorized claims from authorization-terms issues.",
    sourceUrl: "https://www.nacha.org/rules/differentiating-unauthorized-return-reasons",
    confidence: "Standardized external return code",
    payload: {
      action: "stage_authorization_terms_review",
      auto_execute: false,
      signal_code: "R11",
      signal_type: "ach_return_code",
      rail: "ach",
      transfer_id: "trf_synth_6214",
      required_approval: ["compliance", "product_ops"],
      evidence_to_collect: ["authorization_copy", "debit_amount", "debit_date", "funding_flow_version"]
    }
  },
  {
    id: "plaid-token",
    mttrMin: 14,
    mttrTargetMin: 15,
    mttrClass: "Bank-link",
    label: "Plaid token",
    title: "Bank-link token expired",
    market: "Bank-link layer",
    rail: "Processor token / relationship state",
    queueAge: "13m",
    tags: ["bank-link"],
    signalCode: "PLAID_TOKEN_EXPIRED",
    signalType: "Operational signal",
    risk: "Low",
    riskTone: "info",
    owner: "Integration Support",
    primaryPersona: "Integration engineer",
    secondaryPersona: "Partner Ops lead",
    personaWhy:
      "This happens before a transfer exists, so the useful action is relinking or repairing setup rather than ACH return handling.",
    approval: "Not required",
    kpi: "Funding setup completion",
    problem:
      "The partner cannot create or repair the funding relationship because the bank-link credential is stale. This happens before an ACH return exists, so showing an R-code would be misleading.",
    runbook: [
      "Confirm the failure occurred before transfer submission.",
      "Ask the partner flow to refresh or relink the bank credential.",
      "Keep the ACH relationship creation attempt paused.",
      "Track repeated credential expiration by partner integration version."
    ],
    trace: [
      "User linked bank account",
      "Processor token generated",
      "Relationship creation attempted after token expiry",
      "Relink task staged"
    ],
    guardrail:
      "Do not fabricate an ACH code. This is a pre-transfer bank-link problem, not a return.",
    source:
      "Alpaca ACH setup uses Plaid processor-token handoff for ACH relationships. Plaid token state can fail before ACH transfer submission.",
    sourceUrl: "https://docs.alpaca.markets/us/docs/ach-funding",
    confidence: "Operational signal derived from integration state",
    payload: {
      action: "stage_bank_relink",
      auto_execute: true,
      signal_code: "PLAID_TOKEN_EXPIRED",
      signal_type: "operational_signal",
      rail: "bank_link",
      transfer_id: null,
      required_approval: [],
      evidence_to_collect: ["processor_token_created_at", "relationship_creation_attempted_at"]
    }
  },
  {
    id: "bank-auth",
    mttrMin: 40,
    mttrTargetMin: 35,
    mttrClass: "Bank auth",
    label: "Bank auth",
    title: "Bank authorization blocked",
    market: "Bank authorization layer",
    rail: "Payment initiation / bank approval",
    queueAge: "41m",
    tags: ["bank-link", "authorization", "approval"],
    signalCode: "BANK_AUTH_BLOCKED",
    signalType: "Operational signal",
    risk: "Medium",
    riskTone: "warning",
    owner: "Partner Support",
    primaryPersona: "Support lead",
    secondaryPersona: "Partner Ops lead",
    personaWhy:
      "Support needs to explain a bank-side authorization block without mislabeling it as an Alpaca, broker, or ACH return failure.",
    approval: "Support",
    kpi: "Time to funding",
    problem:
      "The user initiated a funding flow, but the user's bank blocked or required additional authorization. This is not an ACH return code and not automatically a broker fault. The product need is clear routing and user-facing next steps.",
    runbook: [
      "Classify the issue as bank authorization blocked, not an ACH return.",
      "Show support the bank, beneficiary, amount, and failure message.",
      "Route the user to bank authorization or bank support when appropriate.",
      "Track repeated blockers by bank and funding provider."
    ],
    trace: [
      "User starts funding flow",
      "Payment-initiation layer redirects to bank",
      "Bank rejects or requires approval",
      "Partner support receives next-step guidance"
    ],
    guardrail:
      "Do not assume Alpaca, Plaid, or the broker caused the block. Keep the evidence layer-specific.",
    source:
      "Plaid payment-initiation flows can involve bank redirect and authorization. A bank-blocked case is an operational signal, not a Nacha return code.",
    sourceUrl: "https://plaid.com/docs/payment-initiation/",
    confidence: "Operational signal derived from bank authorization state",
    payload: {
      action: "stage_partner_support_case",
      auto_execute: false,
      signal_code: "BANK_AUTH_BLOCKED",
      signal_type: "operational_signal",
      rail: "payment_initiation",
      transfer_id: "trf_synth_4407",
      required_approval: ["partner_support"],
      evidence_to_collect: ["bank_error_message", "beneficiary_name", "amount", "payment_provider_trace"],
      user_message_key: "bank_authorization_required"
    }
  },
  {
    id: "event-gap",
    mttrMin: 12,
    mttrTargetMin: 15,
    mttrClass: "Event-sync",
    label: "Event gap",
    title: "Missed transfer event",
    market: "API integration",
    rail: "Funding event stream",
    queueAge: "9m",
    tags: ["event-sync"],
    signalCode: "EVENT_GAP",
    signalType: "Operational signal",
    risk: "Medium",
    riskTone: "info",
    owner: "Integration Engineering",
    primaryPersona: "Integration engineer",
    secondaryPersona: "Partner Ops lead",
    personaWhy:
      "Event gaps affect the partner's local state, so the integration owner needs source-of-truth backfill and auditability.",
    approval: "Not required",
    kpi: "Status accuracy",
    problem:
      "A dropped or missed event can leave the partner's local ledger out of sync with the funding source of truth. The safe action is to backfill partner state, not mutate the money movement itself.",
    runbook: [
      "Detect missing event ids or stale transfer state.",
      "Query the REST source of truth for the affected transfer or activity window.",
      "Patch partner-local state and write an audit record.",
      "Escalate if event gaps exceed the partner error budget."
    ],
    trace: [
      "Event stream connection opens",
      "Partner misses event ids 15961 and 15962",
      "REST source of truth queried",
      "Partner ledger patched with audit log"
    ],
    guardrail:
      "Backfill patches partner-local state. It does not change the transfer, account, or money movement state.",
    source:
      "Alpaca Broker API provides replayable and real-time SSE streams. Transfer events include status transitions such as queued, sent_to_clearing, and executed.",
    sourceUrl: "https://docs.alpaca.markets/us/docs/sse-events",
    confidence: "Operational signal derived from event-stream state",
    payload: {
      action: "reconcile_event_gap",
      auto_execute: true,
      signal_code: "EVENT_GAP",
      signal_type: "operational_signal",
      rail: "sse",
      transfer_id: "trf_synth_7742",
      missing_event_ids: [15961, 15962],
      proposed_endpoint: "GET /v1/accounts/activities",
      required_approval: [],
      audit_log: true
    }
  }
];

const incidents = {
  r10: {
    caseId: "FND-2026-0609-1042",
    partner: "Retail brokerage partner A",
    accountId: "acct_synth_4182",
    transferId: "trf_synth_8831",
    occurredAt: "2026-06-09 10:42 ET",
    sourceSystem: "ACH return event",
    flowStage: "Post-submission ACH return",
    status: "Compliance review staged",
    where: "ACH debit returned after submission",
    evidence: ["transfer_id trf_synth_8831", "return_code R10", "authorization record pending", "support ticket SUP-2217"]
  },
  r01: {
    caseId: "FND-2026-0609-1113",
    partner: "Wealth app partner B",
    accountId: "acct_synth_9026",
    transferId: "trf_synth_1490",
    occurredAt: "2026-06-09 11:13 ET",
    sourceSystem: "ACH return event",
    flowStage: "Post-submission ACH return",
    status: "Retry policy check",
    where: "ACH debit returned after clearing attempt",
    evidence: ["transfer_id trf_synth_1490", "return_code R01", "attempt_count 1", "partner retry policy v3"]
  },
  r03: {
    caseId: "FND-2026-0609-0928",
    partner: "Investing app partner C",
    accountId: "acct_synth_7710",
    transferId: "trf_synth_2039",
    occurredAt: "2026-06-09 09:28 ET",
    sourceSystem: "ACH return event + bank-link trace",
    flowStage: "ACH relationship repair",
    status: "Bank-link repair staged",
    where: "ACH relationship returned after bank account lookup",
    evidence: ["transfer_id trf_synth_2039", "return_code R03", "ach_relationship rel_synth_6021", "processor token trace"]
  },
  r07: {
    caseId: "FND-2026-0609-1149",
    partner: "Treasury partner D",
    accountId: "acct_synth_3378",
    transferId: "trf_synth_5127",
    occurredAt: "2026-06-09 11:49 ET",
    sourceSystem: "ACH return event",
    flowStage: "Recurring debit authorization",
    status: "Mandate disabled pending review",
    where: "Recurring ACH debit returned after authorization revocation",
    evidence: ["transfer_id trf_synth_5127", "return_code R07", "mandate_id man_synth_2450", "customer revocation note"]
  },
  r11: {
    caseId: "FND-2026-0609-1007",
    partner: "Brokerage platform partner E",
    accountId: "acct_synth_1194",
    transferId: "trf_synth_6214",
    occurredAt: "2026-06-09 10:07 ET",
    sourceSystem: "ACH return event + funding-flow version",
    flowStage: "Authorization terms review",
    status: "Product ops review staged",
    where: "ACH debit returned because execution terms need review",
    evidence: ["transfer_id trf_synth_6214", "return_code R11", "authorization copy", "funding_flow_version 2026.06.3"]
  },
  "plaid-token": {
    caseId: "FND-2026-0609-1202",
    partner: "Embedded broker partner F",
    accountId: "acct_synth_6843",
    transferId: "No transfer created",
    occurredAt: "2026-06-09 12:02 ET",
    sourceSystem: "Bank-link session log",
    flowStage: "Pre-transfer bank-link setup",
    status: "Relink task staged",
    where: "Funding relationship creation before transfer submission",
    evidence: ["account_id acct_synth_6843", "processor_token expired", "relationship create attempt", "no ACH return generated"]
  },
  "bank-auth": {
    caseId: "FND-2026-0609-0936",
    partner: "International investing partner G",
    accountId: "acct_synth_5089",
    transferId: "trf_synth_4407",
    occurredAt: "2026-06-09 09:36 ET",
    sourceSystem: "Payment-initiation redirect log",
    flowStage: "Bank authorization redirect",
    status: "Partner support routed",
    where: "Customer bank approval step before funding completion",
    evidence: ["transfer_id trf_synth_4407", "bank_error E10008", "beneficiary check", "bank support escalation suggested"]
  },
  "event-gap": {
    caseId: "FND-2026-0609-1218",
    partner: "API-first broker partner H",
    accountId: "acct_synth_7265",
    transferId: "trf_synth_7742",
    occurredAt: "2026-06-09 12:18 ET",
    sourceSystem: "SSE stream monitor",
    flowStage: "Post-event reconciliation",
    status: "Local ledger backfill ready",
    where: "Partner event consumer missed transfer-status events",
    evidence: ["transfer_id trf_synth_7742", "missing_event_ids 15961,15962", "REST backfill response", "audit log draft"]
  }
};

const taxonomy = [
  {
    group: "ACH return codes",
    description: "Formal return-code family. These are standardized rail signals and should show the R-code prominently.",
    items: [
      ["R01", "Insufficient funds", "Retry policy and customer notification"],
      ["R02", "Account closed", "Stop retry and repair bank relationship"],
      ["R03", "Unable to locate account", "Repair bank-link or account details"],
      ["R07", "Authorization revoked", "Stop debit attempts and review mandate"],
      ["R08", "Payment stopped", "Hold retry and collect bank/customer context"],
      ["R10", "Unauthorized debit claim", "Compliance review and retry block"],
      ["R11", "Authorization terms error", "Review amount/date/account terms"],
      ["R16", "Account frozen", "Support escalation and retry block"],
      ["R29", "Corporate customer not authorized", "Business authorization review"]
    ]
  },
  {
    group: "Operational signals",
    description: "No ACH return code expected. These are product or integration states around the rail.",
    items: [
      ["PLAID_TOKEN_EXPIRED", "Bank-link token expired", "Relink before transfer submission"],
      ["BANK_AUTH_BLOCKED", "Bank authorization blocked", "Support route with bank-message evidence"],
      ["DUPLICATE_TRANSFER_ATTEMPT", "Duplicate funding attempt", "Hold duplicate and ask for human approval"],
      ["EVENT_GAP", "Missed transfer event", "Backfill partner-local state from source of truth"],
      ["LEDGER_MISMATCH", "Partner ledger mismatch", "Reconcile balances before user messaging"],
      ["MANUAL_REVIEW_PENDING", "Review queue dependency", "Expose dependency and owner in support view"]
    ]
  }
];

const state = {
  activeId: "r10",
  filter: "all",
  query: ""
};

const buttonRoot = document.querySelector("#scenarioButtons");
const copyButton = document.querySelector("#copyPayload");
const copyState = document.querySelector("#copyState");
const emptyState = document.querySelector("#emptyState");
const searchInput = document.querySelector("#searchInput");
const casePanel = document.querySelector("#casePanel");
const queueStatus = document.querySelector("#queue-caption");

function requiresApproval(scenario) {
  return (
    scenario.payload.auto_execute === false &&
    (scenario.payload.required_approval || []).length > 0
  );
}

function filteredScenarios() {
  const query = state.query.trim().toLowerCase();
  return scenarios.filter((scenario) => {
    const matchesFilter =
      state.filter === "all" ||
      (state.filter === "approval" ? requiresApproval(scenario) : scenario.tags.includes(state.filter));
    const searchable = [
      scenario.label,
      scenario.title,
      scenario.rail,
      scenario.owner,
      scenario.signalCode,
      scenario.signalType,
      scenario.primaryPersona,
      scenario.secondaryPersona,
      scenario.problem,
      incidents[scenario.id].caseId,
      incidents[scenario.id].partner,
      incidents[scenario.id].sourceSystem,
      incidents[scenario.id].flowStage,
      incidents[scenario.id].status,
      incidents[scenario.id].where
    ]
      .join(" ")
      .toLowerCase();
    return matchesFilter && (!query || searchable.includes(query));
  });
}

function median(values) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2
    ? sorted[mid]
    : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

function lowerFirst(text) {
  return text ? text.charAt(0).toLowerCase() + text.slice(1) : text;
}

// All figures are synthetic, derived from the scenario data above.
function renderMetricStrip() {
  const medianMttr = median(scenarios.map((s) => s.mttrMin));
  const medianTarget = median(scenarios.map((s) => s.mttrTargetMin));

  // Show the safety boundary directly instead of presenting it as a success rate.
  const regulated = scenarios.filter((s) => !s.payload.auto_execute);
  const gated = regulated.filter(requiresApproval);

  const eventClass = scenarios.filter((s) => s.mttrClass === "Event-sync").map((s) => s.mttrMin);
  const reconLag = median(eventClass);
  const approvalGated = scenarios.filter(requiresApproval).length;

  document.querySelector("#medianMttr").textContent = `${medianMttr}m`;
  document.querySelector("#mttrTarget").textContent = `vs ${medianTarget}m target`;
  document.querySelector("#safeByPolicy").textContent = `${gated.length}/${regulated.length}`;
  document.querySelector("#reconLag").textContent = `${reconLag}m`;
  document.querySelector("#openExceptions").textContent = String(scenarios.length);
  document.querySelector("#approvalCount").textContent = `${approvalGated} approval-gated`;
}

function renderMttrByClass() {
  const root = document.querySelector("#mttrByClass");
  if (!root) return;

  const order = ["ACH return", "Authorization", "Bank-link", "Bank auth", "Event-sync"];
  const classes = [...new Set(scenarios.map((s) => s.mttrClass))].sort(
    (a, b) => order.indexOf(a) - order.indexOf(b)
  );

  const maxCurrent = Math.max(...scenarios.map((s) => s.mttrMin));
  const scale = Math.ceil(maxCurrent / 30) * 30; // round up to a clean minute axis

  root.innerHTML = "";
  classes.forEach((cls) => {
    const members = scenarios.filter((s) => s.mttrClass === cls);
    const current = median(members.map((s) => s.mttrMin));
    const target = median(members.map((s) => s.mttrTargetMin));
    const onTrack = current <= target;
    const fillPct = Math.round((current / scale) * 100);
    const targetPct = Math.round((target / scale) * 100);

    const card = document.createElement("div");
    card.className = `mt-class ${onTrack ? "on-track" : "over"}`;
    card.innerHTML = `
      <div class="mt-class-top">
        <strong>${cls}</strong>
        <span class="mt-count">${members.length} case${members.length > 1 ? "s" : ""}</span>
      </div>
      <div class="mt-class-figs">
        <span class="mt-current">${current}m</span>
        <span class="mt-target">target ${target}m</span>
      </div>
      <div class="mt-bar" role="img" aria-label="${cls}: synthetic MTTR ${current} minutes against a ${target} minute target, ${onTrack ? "on or under target" : "over target"}.">
        <span class="mt-bar-fill"></span>
        <span class="mt-bar-target"></span>
      </div>
      <span class="mt-status">${onTrack ? "On / under target" : "Over target"}</span>
    `;
    // Set bar geometry via CSSOM so the page emits no inline style attributes —
    // lets the Content-Security-Policy omit 'unsafe-inline' for styles.
    card.querySelector(".mt-bar-fill").style.width = `${fillPct}%`;
    card.querySelector(".mt-bar-target").style.left = `${targetPct}%`;
    root.appendChild(card);
  });
}

// Deterministic first-pass note built from the case fields. It never decides or
// executes anything; an operator edits and approves before any action runs.
function generateTriage(scenario, incident) {
  const approvalClause = scenario.payload.auto_execute
    ? "It is low-risk and can be staged without sign-off"
    : "Approval is required before any action runs";
  const firstStep = lowerFirst(scenario.runbook[0].replace(/\.$/, ""));
  return (
    `${scenario.signalCode} on ${incident.partner} reads as ${scenario.title.toLowerCase()} ` +
    `(${scenario.risk.toLowerCase()} risk, owner ${scenario.primaryPersona}). ` +
    `${approvalClause}. Suggested first step — ${firstStep}. ` +
    `Metric to watch: ${scenario.kpi}.`
  );
}

function renderButtons(visible) {
  buttonRoot.innerHTML = "";
  emptyState.hidden = visible.length > 0;

  if (!visible.some((scenario) => scenario.id === state.activeId)) {
    state.activeId = visible[0]?.id || null;
  }

  visible.forEach((scenario) => {
    const incident = incidents[scenario.id];
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "scenario-row";
    button.dataset.id = scenario.id;
    button.setAttribute("aria-current", scenario.id === state.activeId ? "true" : "false");
    button.innerHTML = `
      <span class="row-top">
        <strong class="row-title">${scenario.title}</strong>
        <span class="row-signal">${scenario.signalCode}</span>
      </span>
      <span class="row-sub">${incident.caseId} &middot; ${scenario.primaryPersona} &middot; MTTR ${scenario.mttrMin}m</span>
    `;
    button.addEventListener("click", () => {
      state.activeId = scenario.id;
      render();
      // Master-detail: move focus to the detail heading so keyboard and
      // screen-reader users land on the updated case instead of staying put.
      const title = document.querySelector("#caseTitle");
      if (title) title.focus();
    });
    item.appendChild(button);
    buttonRoot.appendChild(item);
  });
}

function caseContextLabel(scenario) {
  if (scenario.tags.includes("ach")) return "Synthetic ACH return incident";
  if (scenario.tags.includes("event-sync")) return "Synthetic event-sync incident";
  if (scenario.tags.includes("bank-link")) return "Synthetic bank-link incident";
  return "Synthetic funding incident";
}

function renderTrace(scenario) {
  const trace = document.querySelector("#eventTrace");
  trace.innerHTML = "";
  scenario.trace.forEach((step, index) => {
    const item = document.createElement("li");
    item.innerHTML = `<span>${index + 1}</span><p>${step}</p>`;
    trace.appendChild(item);
  });
}

function renderTaxonomy() {
  const root = document.querySelector("#taxonomyGroups");
  root.innerHTML = "";

  taxonomy.forEach((section) => {
    const article = document.createElement("article");
    article.className = "taxonomy-card";
    article.innerHTML = `
      <div class="taxonomy-heading">
        <h3>${section.group}</h3>
        <p>${section.description}</p>
      </div>
      <table class="taxonomy-table">
        <caption class="visually-hidden">${section.group}: code, meaning, and recommended action.</caption>
        <thead>
          <tr>
            <th scope="col">Code</th>
            <th scope="col">Meaning</th>
            <th scope="col">Recommended action</th>
          </tr>
        </thead>
        <tbody>
          ${section.items
            .map(
              ([code, title, action]) => `
              <tr>
                <th scope="row">${code}</th>
                <td>${title}</td>
                <td>${action}</td>
              </tr>`
            )
            .join("")}
        </tbody>
      </table>
    `;
    root.appendChild(article);
  });
}

function render() {
  const visible = filteredScenarios();
  renderButtons(visible);
  renderMetricStrip();

  if (!visible.length) {
    casePanel.hidden = true;
    queueStatus.textContent = "0 incidents. Adjust the search or filter to continue.";
    return;
  }

  casePanel.hidden = false;

  const scenario =
    visible.find((item) => item.id === state.activeId) || visible[0];
  const incident = incidents[scenario.id];
  queueStatus.textContent = `${visible.length} incident${visible.length === 1 ? "" : "s"}; selected ${scenario.title}.`;

  document.querySelectorAll(".scenario-row").forEach((button) => {
    const isActive = button.dataset.id === scenario.id;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-current", isActive ? "true" : "false");
  });

  document.querySelector("#caseRail").textContent = caseContextLabel(scenario);
  document.querySelector("#caseTitle").textContent = scenario.title;
  document.querySelector("#caseRefId").textContent = incident.caseId;
  document.querySelector("#signalCode").textContent = scenario.signalCode;
  document.querySelector("#signalType").textContent = scenario.signalType;
  const executionMode = document.querySelector("#executionMode");
  executionMode.textContent = scenario.payload.auto_execute ? "Auto-safe" : "Approval required";
  executionMode.classList.toggle("is-auto", scenario.payload.auto_execute);
  executionMode.classList.toggle("is-approval", !scenario.payload.auto_execute);
  document.querySelector("#approvalState").textContent = scenario.payload.auto_execute
    ? "Low-risk, runs without sign-off"
    : `Approval: ${scenario.approval}`;
  document.querySelector("#partnerName").textContent = incident.partner;
  document.querySelector("#transferId").textContent = incident.transferId;
  document.querySelector("#occurredAt").textContent = incident.occurredAt;
  document.querySelector("#incidentStatus").textContent = incident.status;
  document.querySelector("#sourceSystem").textContent = incident.sourceSystem;
  document.querySelector("#flowStage").textContent = incident.flowStage;
  document.querySelector("#metricKpi").textContent = scenario.kpi;
  document.querySelector("#caseMttr").textContent = `${scenario.mttrMin}m (target ${scenario.mttrTargetMin}m)`;
  document.querySelector("#primaryPersona").textContent = scenario.primaryPersona;
  document.querySelector("#secondaryPersona").textContent = `Secondary: ${scenario.secondaryPersona}`;
  document.querySelector("#personaWhy").textContent = scenario.personaWhy;
  document.querySelector("#caseProblem").textContent = scenario.problem;
  document.querySelector("#guardrail").textContent = scenario.guardrail;
  document.querySelector("#sourceNote").textContent = scenario.source;
  document.querySelector("#sourceLink").href = scenario.sourceUrl;
  document.querySelector("#sourceConfidence").textContent = scenario.confidence;

  const risk = document.querySelector("#caseRisk");
  risk.className = `risk-pill tone-${scenario.riskTone || "green"}`;
  risk.textContent = `${scenario.risk} risk`;

  const runbook = document.querySelector("#runbook");
  runbook.innerHTML = "";
  scenario.runbook.forEach((step) => {
    const item = document.createElement("li");
    item.textContent = step;
    runbook.appendChild(item);
  });

  const evidence = document.querySelector("#evidenceList");
  evidence.innerHTML = "";
  incident.evidence.forEach((detail) => {
    const item = document.createElement("li");
    item.textContent = detail;
    evidence.appendChild(item);
  });

  renderTrace(scenario);
  document.querySelector("#payload").textContent = JSON.stringify(
    {
      ...scenario.payload,
      synthetic_incident: {
        case_id: incident.caseId,
        partner: incident.partner,
        account_id: incident.accountId,
        transfer_id: incident.transferId,
        occurred_at: incident.occurredAt,
        source_system: incident.sourceSystem,
        flow_stage: incident.flowStage,
        status: incident.status
      }
    },
    null,
    2
  );
  document.querySelector("#aiTriage").textContent = generateTriage(scenario, incident);
  copyState.textContent = "";
}

function syncFilterButtons() {
  document.querySelectorAll(".filter-button").forEach((item) => {
    const isActive = item.dataset.filter === state.filter;
    item.classList.toggle("active", isActive);
    item.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
}

document.querySelectorAll(".filter-button").forEach((button) => {
  button.addEventListener("click", () => {
    state.filter = button.dataset.filter;
    syncFilterButtons();
    render();
  });
});

searchInput.addEventListener("input", (event) => {
  state.query = event.target.value;
  render();
});

copyButton.addEventListener("click", async () => {
  const text = document.querySelector("#payload").textContent;
  try {
    await navigator.clipboard.writeText(text);
    copyState.textContent = "Payload copied.";
  } catch {
    copyState.textContent = "Copy unavailable in this browser context.";
  }
});

renderTaxonomy();
renderMttrByClass();
syncFilterButtons();
render();
