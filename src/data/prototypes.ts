export type Prototype = {
  slug: string;
  label: string;
  audience: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  primaryCta: string;
  secondaryCta: string;
  theme: "field" | "basalt" | "signal" | "clear" | "lead";
  heroMetric: string;
  heroMetricLabel: string;
  proof: string[];
  pains: string[];
  services: {
    title: string;
    body: string;
  }[];
  process: string[];
  agentic: {
    title: string;
    body: string;
    tools: string[];
  };
  visualTitle: string;
  visualBody: string;
  visualImage?: string;
  contactPrompt: string;
};

export const prototypes: Prototype[] = [
  {
    slug: "agentic-rag",
    label: "Agentic RAG",
    audience: "teams that want private, current, and maintainable LLM systems",
    eyebrow: "Agentic RAG and self-hostable AI systems",
    title: "Build agentic RAG systems your team can own, evaluate, and improve.",
    subtitle:
      "Verran Labs helps technical teams deploy retrieval, tool-using agents, local model runners, vector search, and evaluation workflows without defaulting to vendor lock-in or unmanaged API sprawl.",
    primaryCta: "Design an agentic RAG system",
    secondaryCta: "See the stack options",
    theme: "basalt",
    heroMetric: "Open stack",
    heroMetricLabel: "for private retrieval and agent workflows",
    proof: [
      "RAG over live DoD cyber threat feeds",
      "NLP pipelines for entity extraction, CVE linking, and retrieval",
      "Secure deployment and container handoff experience",
      "Evaluation-first AI workflow design",
    ],
    pains: [
      "Sensitive knowledge cannot leave controlled environments",
      "Teams want LLM capability without another subscription dependency",
      "RAG answers are not evaluated or trusted",
      "Agents have no clear tool boundaries or human approval points",
      "Open-source components exist, but the production path is unclear",
    ],
    services: [
      {
        title: "Self-hosted RAG architecture",
        body: "Design retrieval over internal documents, feeds, tickets, reports, or engineering knowledge using open-source-friendly components where they fit.",
      },
      {
        title: "Local and private model serving",
        body: "Compare Ollama, llama.cpp, vLLM, OpenAI-compatible endpoints, and managed APIs against data sensitivity, latency, cost, and maintenance.",
      },
      {
        title: "Agent workflow boundaries",
        body: "Define what the agent can retrieve, summarize, write, call, or escalate, with human review where mistakes are expensive.",
      },
      {
        title: "Evaluation and handoff",
        body: "Create answer-quality checks, retrieval tests, refusal cases, observability, documentation, and deployment handoff for the first useful system.",
      },
    ],
    process: [
      "Map the knowledge sources, actions, and security boundaries.",
      "Prototype retrieval, model routing, and agent tool use.",
      "Evaluate, package, document, and hand off the production path.",
    ],
    agentic: {
      title: "Agentic RAG should be current without being fragile.",
      body: "The practical opportunity is a provider-flexible system: local or private models when ownership matters, API endpoints when speed matters, and evaluation around both. The goal is not to chase every model release. It is to give the business a reliable way to adopt better models and agents as the ecosystem changes.",
      tools: [
        "Ollama, llama.cpp, vLLM, and OpenAI-compatible local endpoints",
        "Qdrant or similar vector search for retrieval over private data",
        "LangGraph, LlamaIndex, or Haystack-style orchestration with human review",
      ],
    },
    visualTitle: "Private retrieval plus bounded agent actions",
    visualBody:
      "A modern RAG system is more than search plus chat. It needs ingestion, retrieval, model routing, tool permissions, evaluation, observability, and a path for humans to stay in control.",
    visualImage: "/assets/secure-agentic-data-workflow-offer-stack.png",
    contactPrompt:
      "Want an agentic RAG system that can use private knowledge without creating a new vendor or security mess?",
  },
  {
    slug: "workflow-sprint",
    label: "Workflow Sprint",
    audience: "Engineering, operations, and technical founders",
    eyebrow: "AI Workflow Automation Sprint",
    title: "Turn one painful manual workflow into a production-ready AI roadmap.",
    subtitle:
      "Verran Labs maps the current workflow, identifies the fastest safe automation path, and gives your team a build plan grounded in data, systems, risk, and ROI.",
    primaryCta: "Map a workflow",
    secondaryCta: "See the sprint",
    theme: "field",
    heroMetric: "2-4 weeks",
    heroMetricLabel: "to a fundable production plan",
    proof: [
      "RAG over live DoD cyber threat feeds",
      "Agentic coding and LLM workflow adoption",
      "NiFi and Python ingestion pipelines",
      "AWS-deployed ML workflows",
    ],
    pains: [
      "Models stuck in notebooks",
      "Reports rebuilt by hand",
      "No clean deployment path",
      "LLM tools adopted without guardrails",
      "Unclear ROI or build scope",
    ],
    services: [
      {
        title: "Workflow map",
        body: "Document the current handoffs, tools, data sources, decision points, and failure modes.",
      },
      {
        title: "Automation assessment",
        body: "Separate high-value automation candidates from ideas that are not ready or not worth funding.",
      },
      {
        title: "Production path",
        body: "Define the architecture, delivery risks, data boundaries, and first useful build milestone.",
      },
      {
        title: "Agentic enablement",
        body: "Identify where tools like Cursor, Codex, Claude Code, Grok, or self-hosted models can safely accelerate real work.",
      },
    ],
    process: [
      "Inventory the workflow and data sources.",
      "Score opportunities by value, risk, and implementation effort.",
      "Deliver the architecture, roadmap, and next build scope.",
    ],
    agentic: {
      title: "Adopt LLM work where it changes the workflow, not just the tooling.",
      body: "Verran Labs helps teams decide when to use hosted API endpoints, self-hosted models, coding agents, retrieval systems, or internal assistants, then wraps them with evaluation, access controls, documentation, and operating procedures.",
      tools: [
        "Cursor, Codex, Claude Code, and agentic development workflows",
        "Grok, Claude, OpenAI, or other model APIs",
        "Self-hosted models where privacy, latency, or cost require it",
      ],
    },
    visualTitle: "From scattered workflow to first useful system",
    visualBody:
      "A practical sprint for teams that know the work is too manual, but need a credible path before funding the build.",
    visualImage: "/assets/secure-agentic-data-workflow-offer-stack.png",
    contactPrompt:
      "Have a triage, reporting, inspection, or analysis workflow that should be easier to run?",
  },
  {
    slug: "secure-rag",
    label: "Secure RAG/NLP",
    audience: "Defense, cyber, GovCon, and sensitive data teams",
    eyebrow: "Secure AI systems",
    title: "Ship secure RAG and NLP workflows for sensitive technical data.",
    subtitle:
      "For cyber and defense teams that need retrieval, enrichment, classification, and analyst workflows to move beyond prototypes and into controlled deployment.",
    primaryCta: "Discuss a secure workflow",
    secondaryCta: "Review proof points",
    theme: "basalt",
    heroMetric: "RAG/NLP",
    heroMetricLabel: "for cyber and operational data",
    proof: [
      "TS/SCI and secure government environment experience",
      "Entity extraction, classification, CVE linking, and retrieval",
      "Container hardening and DevSecOps deployment",
      "LLM evaluation and deployment boundary design",
    ],
    pains: [
      "Analysts searching across scattered feeds",
      "Sensitive deployment constraints",
      "No evaluation loop for retrieval quality",
      "Prototype demos that cannot be handed off",
      "Unclear hosted API vs self-hosted model tradeoffs",
    ],
    services: [
      {
        title: "Data ingestion",
        body: "Bring 1-3 sources into a controlled retrieval or enrichment workflow with explicit boundaries.",
      },
      {
        title: "Evaluation harness",
        body: "Define how retrieval quality, refusal behavior, classification, and analyst usefulness will be checked.",
      },
      {
        title: "Deployment handoff",
        body: "Package the workflow as an API, app, or internal service with documentation and next-step roadmap.",
      },
      {
        title: "Model route selection",
        body: "Compare API endpoints, private deployments, and self-hosted model options against mission, security, and operating needs.",
      },
    ],
    process: [
      "Confirm data sensitivity and system boundaries.",
      "Build the first retrieval or enrichment workflow.",
      "Document evaluation, deployment, and handoff requirements.",
    ],
    agentic: {
      title: "Secure agentic systems need boundaries before they need autonomy.",
      body: "Use LLMs and agents for retrieval, enrichment, code assistance, analyst support, and workflow automation only after defining what data they can access, what actions they can take, how outputs are evaluated, and where humans remain in control.",
      tools: [
        "Claude Code, Codex, Cursor, and controlled engineering-agent workflows",
        "Hosted model APIs for fast iteration and evaluation",
        "Self-hosted or private deployments for sensitive workloads",
      ],
    },
    visualTitle: "A secure path from threat data to analyst decisions",
    visualBody:
      "Designed for teams that need useful AI workflows without hand-waving around evaluation, deployment, or sensitive data constraints.",
    visualImage: "/assets/cyber-threat-intel-agentic-triage-workflow.png",
    contactPrompt:
      "Working on a RAG, NLP, cyber triage, or threat intelligence workflow that needs production discipline?",
  },
  {
    slug: "industrial-vision",
    label: "Industrial Vision",
    audience: "Manufacturing, aerospace, hardware, and quality teams",
    eyebrow: "Computer vision inspection systems",
    title: "Automate inspection and engineering review without losing human judgment.",
    subtitle:
      "Verran Labs helps hardware and industrial teams turn images, telemetry, and review steps into production-ready computer vision workflows with feedback loops.",
    primaryCta: "Assess an inspection workflow",
    secondaryCta: "View system pattern",
    theme: "signal",
    heroMetric: "6-10 weeks",
    heroMetricLabel: "for a focused inspection pilot",
    proof: [
      "PCB X-ray inspection experience",
      "Satellite imagery and manufacturing tooling",
      "Biomedical imaging and model validation background",
      "Human-in-the-loop AI workflow design",
    ],
    pains: [
      "Manual visual inspection bottlenecks",
      "Inconsistent quality classification",
      "Technician feedback not captured",
      "Images and telemetry underused",
      "LLM copilots disconnected from engineering context",
    ],
    services: [
      {
        title: "Image and label review",
        body: "Assess available data, inspection categories, edge cases, and what a useful baseline can prove.",
      },
      {
        title: "Review interface",
        body: "Create a practical workflow for model output, human review, exceptions, and feedback capture.",
      },
      {
        title: "Monitoring plan",
        body: "Define the retraining, drift, quality, and acceptance criteria needed before broader rollout.",
      },
      {
        title: "Engineering copilots",
        body: "Use LLM assistants to accelerate review notes, failure analysis, documentation, and technician feedback workflows.",
      },
    ],
    process: [
      "Review samples, labels, and inspection decisions.",
      "Build a baseline model and review flow.",
      "Plan deployment, monitoring, and feedback capture.",
    ],
    agentic: {
      title: "Agentic workflows can connect inspection evidence to engineering action.",
      body: "For industrial teams, the opportunity is not only computer vision. It is pairing models with review interfaces, technician feedback, retrieval over engineering context, and coding agents that help maintain the internal tools around the workflow.",
      tools: [
        "LLM-assisted defect review and report drafting",
        "Cursor, Codex, and Claude Code for internal tool acceleration",
        "API or self-hosted model choices based on data sensitivity",
      ],
    },
    visualTitle: "Computer vision that fits the inspection process",
    visualBody:
      "The goal is not a model demo. The goal is a review system technicians and engineers can trust, correct, and improve.",
    visualImage: "/assets/secure-rag-evaluation-deployment-harness.png",
    contactPrompt:
      "Have inspection images, review queues, or quality checks that are slowing engineering down?",
  },
  {
    slug: "ops-automation",
    label: "Ops Automation",
    audience: "Ops-heavy companies with recurring reports and manual data work",
    eyebrow: "Ops data automation",
    title: "Replace recurring spreadsheet work with maintainable data systems.",
    subtitle:
      "For teams where leaders need the same reports, dashboards, and data cleanup every week, but the process still depends on fragile manual work.",
    primaryCta: "Automate a report",
    secondaryCta: "Explore examples",
    theme: "clear",
    heroMetric: "3-6 weeks",
    heroMetricLabel: "to a useful internal system",
    proof: [
      "Production ingestion pipelines with Python",
      "Dashboards and reporting automation",
      "AWS Lambda, S3, ECS, ECR, and Docker workflows",
      "LLM-assisted reporting and internal workflow automation",
    ],
    pains: [
      "Weekly reporting rebuilt manually",
      "Data lives across spreadsheets, SQL, CSVs, and SaaS exports",
      "Dashboards are stale or not trusted",
      "No owner for the recurring data workflow",
      "Teams experimenting with LLMs but not changing the process",
    ],
    services: [
      {
        title: "Pipeline cleanup",
        body: "Move brittle recurring data steps into documented, repeatable Python, SQL, or cloud workflows.",
      },
      {
        title: "Decision dashboard",
        body: "Create a compact internal view that makes the recurring operating decision easier to make.",
      },
      {
        title: "Scheduled delivery",
        body: "Automate refreshes, exports, alerts, and handoff documentation so the system can keep running.",
      },
      {
        title: "Internal assistants",
        body: "Add LLM help where it reduces recurring analysis, routing, summarization, documentation, or support work.",
      },
    ],
    process: [
      "Find the report or cleanup step with obvious time savings.",
      "Build a repeatable pipeline and review surface.",
      "Schedule, document, and hand off the workflow.",
    ],
    agentic: {
      title: "LLM adoption should show up as fewer manual loops.",
      body: "Verran Labs helps operations teams use API-based or self-hosted LLMs for summarization, routing, report drafting, internal Q&A, and data cleanup while keeping the underlying pipeline maintainable.",
      tools: [
        "Model APIs for summarization, classification, and routing",
        "Agentic coding tools to maintain internal automations faster",
        "Self-hosted options when data or cost constraints demand it",
      ],
    },
    visualTitle: "Operational reporting that runs without a weekly scramble",
    visualBody:
      "A practical path for founders, operators, and data leads who need less spreadsheet work and more reliable decisions.",
    visualImage: "/assets/ops-data-pipeline-remediation-agent.png",
    contactPrompt:
      "Have a recurring report, data cleanup, or dashboard process that should stop depending on manual effort?",
  },
  {
    slug: "fractional-ai-lead",
    label: "Fractional AI Lead",
    audience: "Teams that need senior AI execution without a full-time hire",
    eyebrow: "Fractional Production AI Lead",
    title: "Get senior production AI judgment before the roadmap hardens.",
    subtitle:
      "Architecture review, implementation support, MLOps guidance, code review, and stakeholder translation for teams moving AI work into production.",
    primaryCta: "Talk through the roadmap",
    secondaryCta: "See engagement shape",
    theme: "lead",
    heroMetric: "1-2 days/week",
    heroMetricLabel: "senior technical execution",
    proof: [
      "Defense cyber, manufacturing, imaging, and AWS deployment",
      "Secure RAG, NLP, computer vision, and data automation",
      "Production handoff across software, data, and ML systems",
      "Agentic engineering workflows with practical governance",
    ],
    pains: [
      "Too many AI ideas and no production filter",
      "Junior team needs implementation guidance",
      "Architecture choices are hard to reverse",
      "Stakeholders need technical tradeoffs translated",
      "Teams want Cursor, Codex, Claude Code, or Grok but need adoption strategy",
    ],
    services: [
      {
        title: "Architecture review",
        body: "Pressure-test technical direction before the team commits to a costly path.",
      },
      {
        title: "Implementation support",
        body: "Pair on the hard parts: data contracts, deployment, evaluation, MLOps, and handoff.",
      },
      {
        title: "Stakeholder translation",
        body: "Turn ambiguous AI work into scopes, risks, milestones, and decisions leadership can fund.",
      },
      {
        title: "Agentic adoption",
        body: "Help teams choose and operationalize LLM tools, coding agents, hosted APIs, or self-hosted models without creating unmanaged risk.",
      },
    ],
    process: [
      "Review current roadmap, prototype, and team constraints.",
      "Define the highest-leverage technical support cadence.",
      "Ship decisions, reviews, and implementation support each week.",
    ],
    agentic: {
      title: "Bring agentic tools into the engineering system deliberately.",
      body: "The goal is to make teams faster without making delivery messier. That means choosing where Cursor, Codex, Claude Code, Grok, hosted APIs, and self-hosted models belong, then setting review, evaluation, security, and handoff practices around them.",
      tools: [
        "Agentic development practices for technical teams",
        "Hosted API endpoint and self-hosted model tradeoff reviews",
        "Governance, evaluation, and team enablement playbooks",
      ],
    },
    visualTitle: "A senior production filter for AI work",
    visualBody:
      "Best for teams that have momentum but need an operator who can connect ML, data, cloud, security, and delivery reality.",
    visualImage: "/assets/social-preview-1200x630.jpg",
    contactPrompt:
      "Need senior production AI help before hiring, scaling, or committing to a major implementation path?",
  },
];

export const getPrototype = (slug: string) =>
  prototypes.find((prototype) => prototype.slug === slug);
