export interface DomainProject {
  id: string;
  programSlug: string;
  title: string;
  difficulty: 'Foundation' | 'Intermediate' | 'Advanced' | 'Expert';
  estimatedWeeks: number;
  tags: string[];
  problemStatement: string; 
  context: string; 
  deliverables: string[]; 
  evaluationCriteria: string[]; 
  techStack: string[];
  hiringRoles: string[]; 
  sampleCompanies: string[]; 
  isCapstone: boolean;
}

export const AI_ENGINEERING_PROJECTS: DomainProject[] = [
  {
    id: 'ai-1',
    programSlug: 'ai-engineering-generative-ai',
    title: 'Multi-tenant RAG System for Legal Corpus',
    difficulty: 'Advanced',
    estimatedWeeks: 6,
    tags: ['RAG', 'Vector DB', 'Multi-tenant', 'LLM', 'LegalTech'],
    problemStatement: 'Law firms manage millions of sensitive documents across thousands of clients, necessitating a robust, scalable retrieval-augmented generation (RAG) system. The current search infrastructure relies on legacy keyword matching, resulting in poor recall and excessive time spent by paralegals hunting for relevant case law or contract clauses. The challenge is to build a multi-tenant RAG architecture that strictly isolates data between different clients (tenants) while querying a corpus of over 50,000 dense legal documents. You must implement robust chunking strategies suitable for complex legal text, semantic search with hybrid retrieval capabilities, and secure LLM generation that cites sources accurately without hallucinating non-existent precedents, all while maintaining sub-second retrieval latency.',
    context: 'A fast-growing LegalTech SaaS provider in Bangalore is onboarding top-tier law firms. They need to ensure absolute data privacy (no cross-tenant leakage) while providing cutting-edge semantic search and summarization for complex litigation preparation.',
    deliverables: [
      'Multi-tenant vector database schema and ingestion pipeline',
      'Hybrid search implementation (dense + sparse retrieval)',
      'LLM integration with source citation and hallucination guardrails',
      'API endpoints for document upload, processing, and querying',
      'Load testing report demonstrating latency and scalability'
    ],
    evaluationCriteria: [
      'Strict tenant isolation in all queries',
      'Retrieval accuracy (nDCG@10) on complex legal queries',
      'System latency and throughput under load',
      'Quality and factual accuracy of LLM-generated summaries'
    ],
    techStack: ['Python', 'FastAPI', 'Qdrant / Pinecone', 'LangChain', 'OpenAI API', 'Celery'],
    hiringRoles: ['AI Engineer', 'Backend Engineer - AI', 'Machine Learning Engineer'],
    sampleCompanies: ['SpotDraft', 'MikeLegal', 'Harvey AI', 'Casetext'],
    isCapstone: true
  },
  {
    id: 'ai-2',
    programSlug: 'ai-engineering-generative-ai',
    title: 'Real-time AI Customer Support Agent with Escalation',
    difficulty: 'Intermediate',
    estimatedWeeks: 4,
    tags: ['Conversational AI', 'Customer Support', 'State Management', 'NLP'],
    problemStatement: 'A fast-growing direct-to-consumer (D2C) brand is overwhelmed by customer support tickets during flash sales, resulting in high response times and lost revenue. They require a real-time AI customer support agent capable of resolving routine queries (order tracking, return policies, product details) autonomously. The core technical challenge lies in managing conversational state and intent recognition accurately enough to know exactly when to escalate to a human agent. If the user expresses extreme frustration, requests a refund exceeding a threshold, or asks a complex technical question, the system must seamlessly hand off the context to a human operator via Zendesk or Freshdesk without losing the conversational history.',
    context: 'An e-commerce D2C brand specializing in electronics sees 10x traffic spikes during festive seasons. Their current chatbot is rules-based and frustrates users, leading to high cart abandonment and poor NPS scores.',
    deliverables: [
      'Conversational AI agent using LLMs and state management',
      'Integration with a mock e-commerce database for order status',
      'Sentiment analysis and rule-based escalation logic',
      'Webhook integration for seamless human handoff',
      'Conversation logs and analytics dashboard'
    ],
    evaluationCriteria: [
      'Intent classification accuracy',
      'Appropriateness of escalation triggers',
      'Response latency and conversational coherence',
      'System robustness against adversarial inputs'
    ],
    techStack: ['Python', 'LlamaIndex', 'OpenAI API', 'Redis', 'WebSockets', 'Zendesk API'],
    hiringRoles: ['Conversational AI Engineer', 'NLP Engineer', 'Software Engineer - AI'],
    sampleCompanies: ['Yellow.ai', 'Haptik', 'Gupshup', 'Kapture CRM'],
    isCapstone: false
  },
  {
    id: 'ai-3',
    programSlug: 'ai-engineering-generative-ai',
    title: 'Medical Report Summarisation and ICD-10 Coding',
    difficulty: 'Advanced',
    estimatedWeeks: 5,
    tags: ['Fine-tuning', 'Healthcare', 'Information Extraction', 'Llama-3'],
    problemStatement: 'Hospitals process thousands of unstructured clinical notes and discharge summaries daily. Human coders must manually read these reports to assign appropriate ICD-10 billing codes, a process that is slow, error-prone, and expensive. The objective is to build an AI system that ingests messy, unstructured medical reports, summarizes the key clinical findings, and automatically suggests the most accurate ICD-10 diagnostic codes. This requires fine-tuning an open-source model (like Llama-3) on domain-specific medical datasets to understand complex medical jargon, abbreviations, and clinical context, ensuring high precision in code assignment while adhering to strict privacy and data security standards.',
    context: 'A healthcare analytics firm is building tools for large hospital chains in India and the US. Automating the medical coding process can reduce billing cycles from weeks to hours and significantly reduce claim rejections.',
    deliverables: [
      'Data preprocessing pipeline for clinical notes',
      'Fine-tuned Llama-3 model for summarization and coding',
      'Evaluation pipeline measuring precision/recall on ICD-10 codes',
      'Inference API with batch processing capabilities',
      'Model card detailing performance and limitations'
    ],
    evaluationCriteria: [
      'Accuracy of ICD-10 code prediction (F1 score)',
      'Quality and conciseness of medical summaries',
      'Efficiency of the fine-tuning process (LoRA/QLoRA)',
      'Handling of medical abbreviations and edge cases'
    ],
    techStack: ['PyTorch', 'Hugging Face Transformers', 'PEFT/LoRA', 'vLLM', 'FastAPI'],
    hiringRoles: ['Machine Learning Engineer', 'AI Researcher', 'Data Scientist'],
    sampleCompanies: ['Innovaccer', 'Optum', 'CitiusTech', 'IKS Health'],
    isCapstone: true
  },
  {
    id: 'ai-4',
    programSlug: 'ai-engineering-generative-ai',
    title: 'Multilingual Product Description Generator',
    difficulty: 'Intermediate',
    estimatedWeeks: 4,
    tags: ['GenAI', 'E-commerce', 'Multilingual', 'Prompt Engineering'],
    problemStatement: 'An e-commerce marketplace with over 1 million SKUs struggles to maintain high-quality, localized product descriptions across multiple regional languages. Sellers often provide sparse attributes (e.g., "Red, Cotton, Size M"), resulting in poor SEO and low conversion rates. You need to build a Generative AI pipeline that takes raw product attributes and automatically generates compelling, SEO-optimized product titles and descriptions in English, Hindi, Tamil, and Bengali. The system must ensure brand voice consistency, avoid hallucinating features not present in the attributes, and scale to process thousands of new SKUs daily asynchronously.',
    context: 'A major Indian e-commerce player is expanding into tier-2 and tier-3 cities. Localized, rich content is critical for user trust and search discovery, but manual translation and copywriting at this scale is financially unviable.',
    deliverables: [
      'Prompt engineering framework for attribute-to-text generation',
      'Multilingual generation pipeline using LLMs',
      'Quality assurance module (detecting hallucinations or policy violations)',
      'Asynchronous task queue for batch processing SKUs',
      'A/B testing setup design for generated descriptions'
    ],
    evaluationCriteria: [
      'Grammatical correctness and fluency in target languages',
      'Strict adherence to provided product attributes (zero hallucination)',
      'SEO optimization of generated titles',
      'Pipeline throughput (SKUs processed per minute)'
    ],
    techStack: ['Python', 'OpenAI/Anthropic API', 'Celery', 'Redis', 'PostgreSQL'],
    hiringRoles: ['AI Engineer', 'Backend Developer', 'Applied Scientist'],
    sampleCompanies: ['Flipkart', 'Meesho', 'Myntra', 'Udaan'],
    isCapstone: false
  },
  {
    id: 'ai-5',
    programSlug: 'ai-engineering-generative-ai',
    title: 'AI-powered Resume Screener (10k/day)',
    difficulty: 'Advanced',
    estimatedWeeks: 5,
    tags: ['Document Parsing', 'Semantic Matching', 'Bias Mitigation', 'Scale'],
    problemStatement: 'Enterprise recruitment teams receive up to 10,000 applications daily, making manual screening impossible. Keyword-based applicant tracking systems (ATS) often discard highly qualified candidates who use different terminology. The goal is to build an AI-powered resume screening system that goes beyond keyword matching. It must parse complex PDFs, extract structured data (skills, experience, education), and perform semantic matching against job descriptions. Crucially, the system must implement strict guardrails to mitigate algorithmic bias (e.g., anonymizing names, gender, and institutions) and provide an explainable matching score to justify why a candidate was shortlisted.',
    context: 'A global IT services firm needs a fairer, faster way to shortlist candidates from massive talent pools. The solution must integrate with existing HR systems while adhering to emerging AI fairness regulations.',
    deliverables: [
      'Robust PDF/Word parsing and OCR pipeline',
      'Information extraction module (NER and structured data mapping)',
      'Semantic matching engine using vector embeddings',
      'Bias mitigation layer (PII masking prior to scoring)',
      'Dashboard showing candidate scores and explainability metrics'
    ],
    evaluationCriteria: [
      'Precision and recall in extracting structured resume data',
      'Effectiveness of PII masking and bias mitigation',
      'Correlation of semantic matching scores with expert human screening',
      'System ability to handle high throughput (10k resumes/day)'
    ],
    techStack: ['Python', 'Spacy', 'Hugging Face (Sentence Transformers)', 'Elasticsearch', 'Docker'],
    hiringRoles: ['AI Software Engineer', 'NLP Data Scientist', 'Machine Learning Engineer'],
    sampleCompanies: ['TCS', 'Infosys', 'Eightfold.ai', 'Phenom'],
    isCapstone: true
  },
  {
    id: 'ai-6',
    programSlug: 'ai-engineering-generative-ai',
    title: 'Code Review Bot for GitHub Actions',
    difficulty: 'Intermediate',
    estimatedWeeks: 4,
    tags: ['DevOps', 'GenAI', 'Code Analysis', 'GitHub API'],
    problemStatement: 'In fast-paced fintech startups, senior engineers spend excessive time reviewing boilerplate pull requests (PRs) for style violations, basic security flaws, and missing tests. This bottlenecks the deployment pipeline. You must develop an AI-powered code review bot integrated directly into GitHub Actions. The bot will automatically analyze PR diffs, detect potential bugs, suggest security improvements, and leave contextual comments directly on specific lines of code. It must distinguish between trivial changes and complex logic, ensuring it only flags meaningful issues to avoid creating alert fatigue for developers.',
    context: 'A fintech startup dealing with payments needs to maintain high code quality and security without slowing down their CI/CD pipeline. Automated, intelligent PR reviews are essential for scaling the engineering team.',
    deliverables: [
      'GitHub App/Action integration for triggering on PR events',
      'Code diff parsing and context chunking pipeline',
      'LLM integration tailored for code understanding and review',
      'Automated line-specific commenting system via GitHub API',
      'Configurable ruleset for ignoring specific files or trivial changes'
    ],
    evaluationCriteria: [
      'Relevance and actionability of generated code comments',
      'Absence of redundant or overly pedantic suggestions (low false positives)',
      'Successful end-to-end integration with GitHub workflows',
      'Execution speed (review completed within 2 minutes of PR creation)'
    ],
    techStack: ['TypeScript/Node.js', 'GitHub Actions API', 'OpenAI API (GPT-4)', 'Probot'],
    hiringRoles: ['Developer Productivity Engineer', 'AI Engineer', 'Platform Engineer'],
    sampleCompanies: ['Razorpay', 'Zerodha', 'Cred', 'Postman'],
    isCapstone: false
  },
  {
    id: 'ai-7',
    programSlug: 'ai-engineering-generative-ai',
    title: 'Earnings Call Sentiment Analyser',
    difficulty: 'Advanced',
    estimatedWeeks: 5,
    tags: ['Finance', 'Audio Processing', 'Sentiment Analysis', 'Real-time'],
    problemStatement: 'Equity research analysts need real-time insights during corporate earnings calls, but listening and manually noting nuances is slow. A delay of minutes can mean lost trading opportunities. You are tasked with building a pipeline that ingests live audio streams from earnings calls, performs highly accurate speech-to-text (handling financial jargon and accents), and conducts real-time sentiment analysis on the transcript. The system must extract key financial metrics mentioned and flag shifts in executive tone (e.g., evasiveness during Q&A) to provide an immediate summary dashboard for analysts.',
    context: 'A quantitative hedge fund wants an edge by reacting to corporate earnings calls faster than human analysts. The system must be robust enough to handle poor audio quality and highly domain-specific financial terminology.',
    deliverables: [
      'Real-time audio ingestion and transcription pipeline (Whisper/Deepgram)',
      'Streaming NLP pipeline for sentiment and entity extraction',
      'Financial metric extraction module',
      'Web dashboard displaying live transcript, sentiment timeline, and key flags',
      'Historical analysis report comparing generated insights to actual stock movement'
    ],
    evaluationCriteria: [
      'Word Error Rate (WER) on financial audio data',
      'Latency from audio ingestion to dashboard update (< 5 seconds)',
      'Accuracy of sentiment classification (positive/negative/neutral/evasive)',
      'Reliability of the streaming architecture'
    ],
    techStack: ['Python', 'Kafka', 'Deepgram / Whisper API', 'FinBERT', 'React', 'WebSockets'],
    hiringRoles: ['Quantitative Developer', 'AI Engineer', 'Data Engineer'],
    sampleCompanies: ['JP Morgan', 'Goldman Sachs', 'Tower Research', 'AlphaGrep'],
    isCapstone: true
  },
  {
    id: 'ai-8',
    programSlug: 'ai-engineering-generative-ai',
    title: 'AI Dubbing Pipeline (English to Hindi/Telugu)',
    difficulty: 'Expert',
    estimatedWeeks: 6,
    tags: ['Audio/Video', 'Multilingual', 'TTS', 'Voice Cloning'],
    problemStatement: 'Educational content creators have vast libraries of English videos but struggle to penetrate regional Indian markets due to the high cost and time required for professional dubbing. The project requires building an automated AI dubbing pipeline. It must extract audio from video, separate background noise from speech, transcribe the English speech, translate it to Hindi and Telugu while preserving context and pacing, and synthesize the regional audio using voice cloning (matching the original speaker’s tone). Crucially, the pipeline must attempt rudimentary lip-sync detection to adjust audio pacing and output a seamlessly dubbed video file.',
    context: 'An EdTech unicorn is aggressively expanding into regional markets. They need a scalable, low-cost solution to localize thousands of hours of high-quality educational videos without losing the engaging persona of the original instructors.',
    deliverables: [
      'Audio separation and transcription pipeline',
      'Context-aware translation module preserving timing metadata',
      'Voice cloning and Text-to-Speech (TTS) integration',
      'Audio-video muxing and synchronization script',
      'Quality evaluation framework for dubbing naturalness'
    ],
    evaluationCriteria: [
      'Accuracy and naturalness of translation',
      'Quality and similarity of cloned voices',
      'Synchronization accuracy (minimal audio drift from video)',
      'End-to-end processing time per minute of video'
    ],
    techStack: ['Python', 'FFmpeg', 'Whisper', 'ElevenLabs / Bark', 'Spleeter'],
    hiringRoles: ['AI Video Engineer', 'Machine Learning Engineer', 'Generative AI Specialist'],
    sampleCompanies: ['PhysicsWallah', 'Unacademy', 'Murf AI', 'Dubverse'],
    isCapstone: true
  },
  {
    id: 'ai-9',
    programSlug: 'ai-engineering-generative-ai',
    title: 'Fraud Detection via Transaction Narrative Analysis',
    difficulty: 'Intermediate',
    estimatedWeeks: 4,
    tags: ['Fintech', 'Fraud Detection', 'NLP', 'Classification'],
    problemStatement: 'Traditional fraud detection systems rely heavily on structured metadata (amount, location, time), often missing complex, coordinated fraud rings that use subtle communication in transaction narratives (e.g., UPI remarks or wire transfer memos). You must build an AI system that utilizes Large Language Models to analyze unstructured transaction narratives and conversational context between transacting parties. The model must identify suspicious patterns, obfuscated language, or coercion tactics, outputting a risk score that supplements existing rules-based fraud engines. The system must process transactions within milliseconds to block fraudulent transfers in real-time.',
    context: 'A leading UPI payment app in India is seeing a rise in social engineering scams where users are tricked into sending money with innocent-looking remarks. They need an NLP-powered layer to catch what structured rules miss.',
    deliverables: [
      'Data preparation pipeline for transaction logs and remarks',
      'Fine-tuned classification model or optimized LLM prompt chain',
      'Low-latency API for real-time risk scoring',
      'Explainability module detailing why a transaction was flagged',
      'Performance report on false positive/negative rates'
    ],
    evaluationCriteria: [
      'Precision and recall in identifying fraudulent narratives',
      'API latency (must be under 100ms for real-time blocking)',
      'Model robustness against intentionally misspelled or obfuscated text',
      'Quality of the generated explanations for human review'
    ],
    techStack: ['Python', 'FastAPI', 'XGBoost', 'Hugging Face Models', 'Redis'],
    hiringRoles: ['Machine Learning Engineer - Risk', 'Data Scientist', 'AI Engineer'],
    sampleCompanies: ['PhonePe', 'Paytm', 'Groww', 'Navi'],
    isCapstone: false
  },
  {
    id: 'ai-10',
    programSlug: 'ai-engineering-generative-ai',
    title: 'AI Teaching Assistant with Answer Guardrails',
    difficulty: 'Intermediate',
    estimatedWeeks: 4,
    tags: ['EdTech', 'Agentic Workflow', 'Guardrails', 'Education'],
    problemStatement: 'EdTech platforms want to deploy AI chatbots to help students with CBSE and JEE preparation, but they face a critical risk: LLMs often hallucinate incorrect formulas or give away the final answer instead of guiding the student step-by-step. The challenge is to build a highly constrained AI teaching assistant. It must use a provided curriculum database to ground its knowledge, and employ strict output guardrails to ensure it never provides direct answers to homework questions. Instead, it must employ a Socratic method, asking guiding questions and identifying the specific step where the student made a conceptual error.',
    context: 'A premier test-prep institute wants an AI tool that acts like a strict but helpful tutor. The brand reputation depends entirely on the AI NOT giving wrong answers to competitive exam questions and NOT doing the student’s work for them.',
    deliverables: [
      'RAG system integrated with NCERT/JEE syllabus content',
      'Prompt engineering framework enforcing the Socratic method',
      'Implementation of output guardrails (e.g., using NeMo Guardrails)',
      'Chat interface for student interaction',
      'Transcript analyzer to review AI tutoring quality'
    ],
    evaluationCriteria: [
      'Strict adherence to the "no direct answers" policy',
      'Factual accuracy of mathematical and scientific explanations',
      'Effectiveness of the guiding questions in problem-solving',
      'Latency and user experience of the chat interface'
    ],
    techStack: ['Python', 'LangChain', 'NeMo Guardrails', 'Pinecone', 'Next.js'],
    hiringRoles: ['AI Engineer', 'Prompt Engineer', 'Product Engineer - EdTech'],
    sampleCompanies: ['Byjus', 'Vedantu', 'Toppr', 'Allen Digital'],
    isCapstone: false
  }
];

export const AGENTIC_AI_PROJECTS: DomainProject[] = [
  {
    id: 'ag-1',
    programSlug: 'agentic-ai-automation',
    title: 'Autonomous Procurement Agent',
    difficulty: 'Advanced',
    estimatedWeeks: 5,
    tags: ['Agents', 'Web Scraping', 'Procurement', 'Automation'],
    problemStatement: 'Corporate procurement processes are painfully slow, involving manual vendor research, email-based quote comparisons, and tedious ERP data entry. You must build an autonomous procurement agent using a framework like AutoGen or LangGraph. Given a requisition (e.g., "Need 50 Dell XPS 15 laptops"), the agent must autonomously search the web or specific vendor catalogs, extract pricing and specifications, compare them against corporate policies, draft a comparison matrix, and generate a draft Purchase Order (PO) in a mock ERP system. The agent must be able to handle unexpected website structures and ask for human confirmation before finalizing financial commitments.',
    context: 'A large manufacturing firm wants to automate its indirect procurement. The agent needs to navigate the messy reality of B2B vendor websites, PDF quotes, and rigid internal compliance rules without constant human hand-holding.',
    deliverables: [
      'Multi-agent workflow design (Researcher, Evaluator, Purchaser)',
      'Web scraping and document parsing tools integrated with agents',
      'Stateful execution graph with human-in-the-loop (HITL) checkpoints',
      'Mock ERP integration via REST APIs',
      'Execution logs demonstrating autonomous decision-making'
    ],
    evaluationCriteria: [
      'Agent ability to recover from web scraping failures',
      'Accuracy of data extraction from vendor quotes',
      'Proper implementation of human-in-the-loop approval',
      'Efficiency and reliability of the overall workflow'
    ],
    techStack: ['Python', 'LangGraph / AutoGen', 'Playwright', 'OpenAI API', 'FastAPI'],
    hiringRoles: ['AI Automation Engineer', 'Agentic AI Developer', 'Backend Engineer'],
    sampleCompanies: ['Udaan', 'Zetwerk', 'SAP Ariba (Ecosystem)', 'Karkhana.io'],
    isCapstone: true
  },
  {
    id: 'ag-2',
    programSlug: 'agentic-ai-automation',
    title: 'Multi-agent CI/CD Debugger',
    difficulty: 'Advanced',
    estimatedWeeks: 6,
    tags: ['DevOps', 'CI/CD', 'Multi-Agent', 'Auto-remediation'],
    problemStatement: 'When a CI/CD pipeline fails, developers spend hours sifting through thousands of lines of build logs, test outputs, and deployment errors to find the root cause. The objective is to build a multi-agent system that acts as a DevOps copilot. When a build fails, an "Investigator Agent" analyzes the logs and git history. A "Solver Agent" hypothesizes the fix (e.g., updating a dependency, fixing a typo, resolving a merge conflict). Finally, an "Executor Agent" writes the fix, commits the code to a new branch, and opens a Pull Request automatically, summarizing the issue and the proposed solution.',
    context: 'A high-velocity engineering team at a SaaS startup is drowning in flaky tests and build failures. Automating the triage and remediation of common pipeline errors will save thousands of engineering hours annually.',
    deliverables: [
      'Integration with GitHub Actions / GitLab CI for failure webhooks',
      'Log parsing and summarization agent',
      'Code modification and git automation agent',
      'Orchestration layer managing agent communication',
      'Test suite to evaluate the system on historical build failures'
    ],
    evaluationCriteria: [
      'Accuracy in identifying the root cause from complex logs',
      'Correctness of the code fixes proposed in PRs',
      'Robustness of the agent in handling unfamiliar errors (graceful degradation)',
      'Security of the agent executing code modifications'
    ],
    techStack: ['Python', 'CrewAI', 'GitHub API', 'Docker', 'Bash'],
    hiringRoles: ['Platform Engineer', 'DevOps AI Engineer', 'SRE'],
    sampleCompanies: ['Atlassian', 'Harness', 'BrowserStack', 'Postman'],
    isCapstone: true
  },
  {
    id: 'ag-3',
    programSlug: 'agentic-ai-automation',
    title: 'AI Research Agent (arXiv Digest)',
    difficulty: 'Intermediate',
    estimatedWeeks: 3,
    tags: ['Research', 'Summarisation', 'Scheduled Tasks', 'Agents'],
    problemStatement: 'AI practitioners struggle to keep up with the overwhelming volume of daily paper publications on arXiv. You are required to build an autonomous research agent that runs daily. It must query the arXiv API for specific domains (e.g., "Large Language Models", "Agentic AI"), filter out low-relevance papers using semantic scoring, download the PDFs, extract the methodology and key results, and synthesize a structured, easy-to-read daily digest. The agent must then format this into a professional HTML email and distribute it to a mailing list, maintaining a database of previously processed papers to avoid duplicates.',
    context: 'An AI consultancy firm requires its engineers to stay on the bleeding edge. A reliable, intelligent agent that curates the noise into actionable insights is a massive productivity multiplier.',
    deliverables: [
      'Scheduled task runner for daily execution',
      'arXiv API integration and PDF parsing tools',
      'LLM pipeline for extracting methodology and results',
      'HTML email generation and SMTP integration',
      'Database schema for tracking processed papers and user preferences'
    ],
    evaluationCriteria: [
      'Relevance of the filtered papers',
      'Accuracy and clarity of the generated summaries',
      'Reliability of the daily execution pipeline',
      'Quality of the PDF parsing (handling math and tables)'
    ],
    techStack: ['Python', 'Celery/Cron', 'LangChain', 'PyPDF', 'SendGrid'],
    hiringRoles: ['AI Engineer', 'Python Developer', 'Applied Researcher'],
    sampleCompanies: ['Fractal Analytics', 'Mu Sigma', 'Tredence', 'Tiger Analytics'],
    isCapstone: false
  },
  {
    id: 'ag-4',
    programSlug: 'agentic-ai-automation',
    title: 'Customer Onboarding Agent (Neo-bank)',
    difficulty: 'Intermediate',
    estimatedWeeks: 4,
    tags: ['Fintech', 'Onboarding', 'Workflow Automation', 'Agents'],
    problemStatement: 'Neo-banks require frictionless customer onboarding, but backend processes (KYC verification, credit checks, account provisioning, and card dispatch) are often disjointed and manual. Build an intelligent agentic workflow that manages the entire lifecycle. When a user submits documents, a "Verification Agent" triggers OCR and fraud checks. Upon approval, a "Provisioning Agent" creates the account in the core banking system via API. Finally, a "Fulfillment Agent" triggers the physical card dispatch and sends a welcome email. The system must handle state transitions reliably, manage API failures with retries, and escalate discrepancies (e.g., failed KYC) to a human compliance officer.',
    context: 'A fast-growing Indian neo-bank needs to scale its user acquisition from 1,000 to 10,000 users a day. Manual interventions in onboarding lead to drop-offs; the process must be entirely autonomous yet fully compliant with RBI guidelines.',
    deliverables: [
      'Agentic state machine mapping the onboarding workflow',
      'Integration with mock OCR and identity verification APIs',
      'Mock Core Banking System (CBS) integration',
      'Error handling and retry logic for third-party APIs',
      'Human-in-the-loop dashboard for compliance escalation'
    ],
    evaluationCriteria: [
      'Reliability of the state machine (no dropped applications)',
      'Correctness of branching logic (approval vs. rejection vs. manual review)',
      'Resilience to API timeouts and failures',
      'Clarity of the audit trail for compliance purposes'
    ],
    techStack: ['TypeScript', 'Temporal.io / LangGraph', 'Node.js', 'PostgreSQL', 'Express'],
    hiringRoles: ['Backend Engineer', 'Workflow Automation Specialist', 'Fintech Developer'],
    sampleCompanies: ['Jupiter', 'Fi Money', 'Razorpay', 'Pine Labs'],
    isCapstone: false
  },
  {
    id: 'ag-5',
    programSlug: 'agentic-ai-automation',
    title: 'Autonomous Competitive Intelligence Agent',
    difficulty: 'Advanced',
    estimatedWeeks: 5,
    tags: ['Web Scraping', 'Analytics', 'Agents', 'Data Pipelines'],
    problemStatement: 'Marketing and product teams need constant updates on competitor pricing, feature releases, and messaging changes. Manually monitoring 50+ competitor websites is tedious. You will build an autonomous agent that periodically crawls a predefined list of competitor websites, identifies structural changes, extracts new pricing tiers, and analyzes blog posts for new feature announcements. The agent must utilize visual diffing and LLMs to understand the semantic meaning of website changes, filtering out noise (like UI updates) and generating a weekly actionable intelligence report detailing strategic moves by competitors.',
    context: 'A B2B SaaS company operates in a hyper-competitive market. Being the first to know when a rival drops their price or launches an AI feature allows them to adjust their sales scripts and marketing campaigns instantly.',
    deliverables: [
      'Distributed web crawling infrastructure for target sites',
      'Change detection algorithms (visual and DOM-based)',
      'LLM integration for semantic analysis of changes',
      'Dashboard for visualizing pricing trends and feature matrices',
      'Automated weekly intelligence report generation'
    ],
    evaluationCriteria: [
      'Ability to consistently bypass basic anti-bot protections',
      'Accuracy in identifying meaningful changes vs. noise',
      'Quality of the synthesized intelligence report',
      'Scalability of the crawling infrastructure'
    ],
    techStack: ['Python', 'Playwright/Puppeteer', 'BeautifulSoup', 'OpenAI API', 'Metabase'],
    hiringRoles: ['Data Engineer', 'AI Automation Engineer', 'Growth Engineer'],
    sampleCompanies: ['Freshworks', 'Zoho', 'CleverTap', 'MoEngage'],
    isCapstone: true
  },
  {
    id: 'ag-6',
    programSlug: 'agentic-ai-automation',
    title: 'Supply Chain Disruption Agent',
    difficulty: 'Expert',
    estimatedWeeks: 6,
    tags: ['Supply Chain', 'Real-time', 'Agents', 'Risk Management'],
    problemStatement: 'Global supply chains are fragile. A port strike in Europe or a factory fire in Asia can halt production in India for weeks. You must build an intelligent agent that continuously monitors global news feeds, weather APIs, and logistics alerts. When a disruptive event occurs, the agent must cross-reference it with the company’s internal Bill of Materials (BOM) and supplier database. It must immediately alert the procurement team, calculate the estimated impact on production schedules, and proactively suggest alternative pre-approved suppliers, drafting initial outreach emails to secure alternative inventory.',
    context: 'An automotive manufacturer relies on thousands of components globally. Delayed reaction to a supply shock costs millions in idle factory time. The agent must act as a 24/7 global risk watchtower.',
    deliverables: [
      'Real-time ingestion pipeline for news and weather APIs',
      'Named Entity Recognition (NER) to link events to specific suppliers/regions',
      'Graph database integration linking suppliers to internal parts',
      'Automated alerting system with impact analysis',
      'Agentic workflow for identifying and contacting alternative suppliers'
    ],
    evaluationCriteria: [
      'Speed of threat detection and notification',
      'Accuracy in linking external events to internal supply chain risk',
      'Relevance of the suggested alternative suppliers',
      'System stability processing continuous data streams'
    ],
    techStack: ['Python', 'Kafka', 'Neo4j', 'LangChain', 'News API'],
    hiringRoles: ['Supply Chain AI Engineer', 'Data Scientist', 'Solutions Architect'],
    sampleCompanies: ['TVS Motor', 'Mahindra', 'Delhivery', 'Locus'],
    isCapstone: true
  },
  {
    id: 'ag-7',
    programSlug: 'agentic-ai-automation',
    title: 'AI Legal Due Diligence Agent',
    difficulty: 'Advanced',
    estimatedWeeks: 5,
    tags: ['LegalTech', 'Document Analysis', 'Agents', 'Compliance'],
    problemStatement: 'During Mergers & Acquisitions (M&A), legal teams spend thousands of hours reviewing virtual data rooms filled with contracts to identify risks (e.g., change of control clauses, non-competes, undisclosed liabilities). Build an AI agent system that autonomously navigates a mock virtual data room. It must categorize documents, read through complex contracts, extract specific high-risk clauses, and compile a comprehensive Due Diligence Red Flag Report. The agent must be capable of answering follow-up questions from human lawyers regarding its findings, citing specific pages and paragraphs in the source documents.',
    context: 'A top-tier law firm requires a tool to accelerate the M&A due diligence process. The agent must not replace the lawyer but act as an exhaustive first-pass reviewer that never misses a hidden clause.',
    deliverables: [
      'Document ingestion and categorization pipeline',
      'Clause extraction agent using specialized prompts',
      'Risk scoring and flagging logic',
      'Interactive chat interface for querying the data room',
      'Automated generation of the Due Diligence Report'
    ],
    evaluationCriteria: [
      'Recall in finding critical clauses (must be near 100%)',
      'Accuracy of the risk assessment',
      'Precision of the source citations in the chat interface',
      'Ability to process large volumes of PDFs efficiently'
    ],
    techStack: ['Python', 'LlamaIndex', 'Anthropic Claude', 'FastAPI', 'React'],
    hiringRoles: ['Legal Knowledge Engineer', 'AI Developer', 'NLP Specialist'],
    sampleCompanies: ['Cyril Amarchand Mangaldas (Tech Arm)', 'PwC', 'EY', 'KPMG'],
    isCapstone: true
  },
  {
    id: 'ag-8',
    programSlug: 'agentic-ai-automation',
    title: 'Hospital Bed Allocation Agent',
    difficulty: 'Intermediate',
    estimatedWeeks: 4,
    tags: ['Healthcare', 'Operations', 'Agents', 'Optimization'],
    problemStatement: 'Large hospitals struggle with optimal bed allocation, leading to emergency room overcrowding while beds remain unassigned in other wards. Build an agentic system that integrates with a mock Hospital Management Information System (HMIS). The agent must monitor real-time admission requests, patient acuity (severity), required specialties, and current bed availability. It must autonomously assign beds, prioritizing critical patients, optimizing ward grouping by specialty, and predicting upcoming discharges to pre-allocate beds. It must alert administrators when ICU capacity reaches critical thresholds.',
    context: 'A corporate hospital chain in India needs to improve patient throughput and reduce ER wait times. The bed manager is overwhelmed; an intelligent agent can optimize the complex puzzle of patient routing 24/7.',
    deliverables: [
      'Mock HMIS API integration',
      'Agentic workflow for real-time bed assignment',
      'Prioritization algorithm incorporating patient acuity and wait time',
      'Predictive module for estimating discharge times',
      'Operations dashboard for hospital administrators'
    ],
    evaluationCriteria: [
      'Efficiency of the allocation algorithm (minimizing wait times)',
      'Adherence to hard constraints (e.g., cardiac patients in cardiac wards)',
      'Accuracy of the discharge prediction logic',
      'System responsiveness to sudden influxes (e.g., accidents)'
    ],
    techStack: ['Python', 'Pandas', 'FastAPI', 'Redis (Pub/Sub)', 'Vue.js'],
    hiringRoles: ['Operations Research Analyst', 'AI Software Engineer', 'Healthcare IT Specialist'],
    sampleCompanies: ['Apollo Hospitals', 'Max Healthcare', 'Practo', 'Tata 1mg'],
    isCapstone: false
  },
  {
    id: 'ag-9',
    programSlug: 'agentic-ai-automation',
    title: 'Real-estate Lead Qualification Agent',
    difficulty: 'Intermediate',
    estimatedWeeks: 3,
    tags: ['PropTech', 'Sales', 'Conversational AI', 'Agents'],
    problemStatement: 'Real estate developers receive thousands of inbound inquiries via WhatsApp and web forms, but only a small fraction are serious buyers. Sales teams waste time calling unqualified leads. You must build a conversational AI agent deployed on WhatsApp that immediately engages new leads. The agent must qualify the lead by determining their budget, preferred location, and timeline (BANT framework) through natural conversation. If the lead is qualified, the agent must autonomously check the sales team’s calendar and schedule a site visit, logging all details into a mock CRM.',
    context: 'A major property developer in Mumbai wants to instantly engage leads generated from Facebook ads. The agent must sound human, empathetic, and gently persistent to secure the site visit appointment.',
    deliverables: [
      'WhatsApp API integration',
      'Conversational agent programmed with the BANT qualification framework',
      'Calendar API integration for scheduling',
      'CRM integration for logging lead data',
      'Analytics dashboard tracking conversion rates'
    ],
    evaluationCriteria: [
      'Conversational flow and user experience',
      'Accuracy in extracting qualification criteria from unstructured chat',
      'Successful execution of the scheduling workflow',
      'Robustness against off-topic user messages'
    ],
    techStack: ['Node.js', 'WhatsApp Business API', 'Dialogflow / OpenAI', 'Google Calendar API', 'Hubspot API'],
    hiringRoles: ['Conversational AI Developer', 'Full Stack Engineer', 'Sales Tech Engineer'],
    sampleCompanies: ['Lodha Group', 'Godrej Properties', 'NoBroker', 'Housing.com'],
    isCapstone: false
  },
  {
    id: 'ag-10',
    programSlug: 'agentic-ai-automation',
    title: 'Autonomous DevOps Incident Responder',
    difficulty: 'Expert',
    estimatedWeeks: 6,
    tags: ['DevOps', 'SRE', 'Agents', 'Auto-remediation'],
    problemStatement: 'When production systems go down at 3 AM, Site Reliability Engineers (SREs) follow documented runbooks to diagnose and fix the issue (e.g., restarting a pod, scaling a database, clearing a cache). Build an autonomous incident response agent. When a PagerDuty alert fires, the agent must acknowledge it, read the corresponding runbook, securely query the production environment (e.g., checking Kubernetes pod status, pulling recent Prometheus metrics), execute safe remediation commands via SSH or API, and post a detailed post-mortem draft to Slack. It must have strict guardrails preventing destructive actions (e.g., dropping databases).',
    context: 'A high-scale cloud provider wants to achieve "Zero Touch Ops" for Level 1 incidents. The agent must safely automate repetitive runbook tasks, waking up human engineers only for novel or critical failures.',
    deliverables: [
      'Integration with alerting systems (PagerDuty/Datadog)',
      'Agentic workflow that maps alerts to runbook steps',
      'Secure execution environment for querying infrastructure (read-only initially)',
      'Execution of safe remediation actions (e.g., scaling up resources)',
      'Automated Slack reporting and post-mortem generation'
    ],
    evaluationCriteria: [
      'Strict adherence to security and execution guardrails',
      'Accuracy of diagnosis based on metrics and logs',
      'Successful execution of remediation steps',
      'Quality and clarity of the incident communication to the team'
    ],
    techStack: ['Go / Python', 'Kubernetes API', 'Prometheus', 'Slack API', 'LangGraph'],
    hiringRoles: ['Site Reliability Engineer (SRE)', 'Platform AI Engineer', 'Cloud Architect'],
    sampleCompanies: ['Swiggy', 'Zomato', 'Dream11', 'Gojek'],
    isCapstone: true
  }
];

export const MLOPS_PROJECTS: DomainProject[] = [
  {
    id: 'mlops-1',
    programSlug: 'mlops-llmops-engineering',
    title: 'End-to-end ML Platform (Tracking & Serving)',
    difficulty: 'Advanced',
    estimatedWeeks: 6,
    tags: ['MLOps', 'Platform', 'Serving', 'Tracking'],
    problemStatement: 'Data science teams often struggle to transition models from Jupyter notebooks to production, suffering from a lack of version control, irreproducible experiments, and fragile deployment scripts. You must build a unified ML platform. It must include an experiment tracking server (like MLflow) to log parameters and metrics, a model registry to version artifacts, and a serving infrastructure (using BentoML or Ray Serve) to deploy models as scalable REST APIs. The platform must support containerization of models and provide a CI/CD pipeline that automatically tests and deploys new model versions when promoted in the registry.',
    context: 'A fast-growing e-commerce company needs a standardized way for its 20 data scientists to collaborate, deploy pricing models, and monitor them without relying on a dedicated engineering team for every release.',
    deliverables: [
      'Configured MLflow tracking server and model registry',
      'Model serving pipeline using BentoML/Ray',
      'Dockerized deployment configuration',
      'CI/CD pipeline (GitHub Actions) for model promotion',
      'Comprehensive documentation for data scientists on how to use the platform'
    ],
    evaluationCriteria: [
      'Reproducibility of ML experiments',
      'Latency and scalability of the serving infrastructure',
      'Reliability of the automated deployment pipeline',
      'Security of the model artifacts and APIs'
    ],
    techStack: ['Python', 'MLflow', 'BentoML', 'Docker', 'GitHub Actions', 'AWS/GCP'],
    hiringRoles: ['MLOps Engineer', 'Platform Engineer', 'Machine Learning Engineer'],
    sampleCompanies: ['Myntra', 'Ola', 'MakeMyTrip', 'Fractal Analytics'],
    isCapstone: true
  },
  {
    id: 'mlops-2',
    programSlug: 'mlops-llmops-engineering',
    title: 'LLM Fine-tuning Pipeline with RLHF',
    difficulty: 'Expert',
    estimatedWeeks: 6,
    tags: ['LLMOps', 'Fine-tuning', 'RLHF', 'Pipeline'],
    problemStatement: 'Deploying off-the-shelf LLMs often results in generic or unaligned responses for specific business use cases. Companies need automated pipelines to continuously align models with human preferences. You will build an LLMOps pipeline that automates the Supervised Fine-Tuning (SFT) and Reinforcement Learning from Human Feedback (RLHF) processes. The pipeline must ingest human-annotated preference data, trigger training jobs on GPU instances, manage checkpoints, evaluate the tuned model against a baseline using automated LLM-as-a-judge metrics, and seamlessly swap the production model if the new version passes quality thresholds.',
    context: 'An AI-first legal tech startup requires their custom models to strictly adhere to a professional tone and never hallucinate legal citations. Continuous alignment via RLHF is critical to maintaining quality as laws change.',
    deliverables: [
      'Data ingestion and formatting pipeline for RLHF datasets',
      'Automated training scripts for SFT and Reward Model training',
      'Evaluation framework using LLM-as-a-judge',
      'Pipeline orchestration (e.g., Airflow/Prefect) for the training loop',
      'Dashboard for monitoring training metrics (Weights & Biases)'
    ],
    evaluationCriteria: [
      'Robustness of the training orchestration',
      'Accuracy and reliability of the automated evaluation',
      'Efficiency of GPU resource utilization during training',
      'End-to-end automation capability (no manual script running)'
    ],
    techStack: ['PyTorch', 'Hugging Face TRL', 'Ray', 'Airflow', 'Weights & Biases'],
    hiringRoles: ['LLMOps Engineer', 'AI Platform Engineer', 'Machine Learning Engineer'],
    sampleCompanies: ['Sarvam AI', 'Krutrim', 'Glean', 'Cohere'],
    isCapstone: true
  },
  {
    id: 'mlops-3',
    programSlug: 'mlops-llmops-engineering',
    title: 'Canary Deployment System for ML Models',
    difficulty: 'Advanced',
    estimatedWeeks: 5,
    tags: ['Deployment', 'Kubernetes', 'Monitoring', 'Safety'],
    problemStatement: 'Deploying a new machine learning model directly to 100% of traffic is highly risky; a degraded model can cause immediate revenue loss. You must engineer a canary deployment system on Kubernetes. When a new model version is approved, the system must route exactly 5% of production traffic to it. It must simultaneously monitor business metrics (e.g., click-through rate) and operational metrics (latency, error rate). If the canary underperforms the baseline model over a 1-hour window, the system must automatically roll back. If it succeeds, it should gradually ramp traffic to 100%.',
    context: 'A ride-hailing app updates its dynamic pricing model weekly. A bad model can overprice rides, causing immediate user churn. Safe, automated rollout with auto-rollback is non-negotiable.',
    deliverables: [
      'Kubernetes deployment configuration (Istio / Flagger)',
      'Metrics collection system (Prometheus)',
      'Automated analysis script comparing baseline vs. canary metrics',
      'Rollout and auto-rollback orchestration logic',
      'Load generation script to simulate traffic and failures'
    ],
    evaluationCriteria: [
      'Accuracy of traffic routing (exact percentages)',
      'Speed and reliability of the auto-rollback mechanism upon failure',
      'Statistical validity of the comparison metrics',
      'System stability under high simulated load'
    ],
    techStack: ['Kubernetes', 'Istio', 'Flagger', 'Prometheus', 'Grafana'],
    hiringRoles: ['MLOps Engineer', 'SRE - Machine Learning', 'Backend Engineer'],
    sampleCompanies: ['Uber', 'Rapido', 'Swiggy', 'Blinkit'],
    isCapstone: true
  },
  {
    id: 'mlops-4',
    programSlug: 'mlops-llmops-engineering',
    title: 'Enterprise Feature Store (10M Users)',
    difficulty: 'Advanced',
    estimatedWeeks: 5,
    tags: ['Data Engineering', 'Feature Store', 'Real-time', 'Batch'],
    problemStatement: 'Data scientists spend 80% of their time recalculating the same features (e.g., "user_total_spend_30d") for different models, leading to training-serving skew and wasted compute. Build an enterprise feature store using Feast. It must handle batch ingestion from a data warehouse (e.g., BigQuery/Snowflake) for model training, and real-time ingestion via Kafka for online serving. The system must guarantee single-digit millisecond latency for feature retrieval during online inference, serving a user base of 10 million simulated profiles, while ensuring strict consistency between the offline and online stores.',
    context: 'A major fintech company needs to calculate real-time fraud scores. The model requires both historical data (batch) and real-time transaction aggregates (streaming) delivered instantly to the inference API.',
    deliverables: [
      'Feast repository configuration (entities, feature views)',
      'Batch ingestion pipeline from a mock data warehouse',
      'Streaming ingestion pipeline via Kafka',
      'Online serving API backed by Redis',
      'Latency and data consistency testing report'
    ],
    evaluationCriteria: [
      'Online feature retrieval latency (< 10ms at P99)',
      'Consistency between offline (training) and online (serving) data',
      'Throughput capacity of the ingestion pipelines',
      'Ease of adding new features to the registry'
    ],
    techStack: ['Python', 'Feast', 'Kafka', 'Redis', 'PostgreSQL', 'Docker'],
    hiringRoles: ['Data Engineer', 'MLOps Engineer', 'Backend Engineer'],
    sampleCompanies: ['Paytm', 'PhonePe', 'Navi', 'Cred'],
    isCapstone: true
  },
  {
    id: 'mlops-5',
    programSlug: 'mlops-llmops-engineering',
    title: 'Model Drift Monitoring & Retraining Dashboard',
    difficulty: 'Intermediate',
    estimatedWeeks: 4,
    tags: ['Monitoring', 'Drift', 'Automation', 'MLOps'],
    problemStatement: 'Models degrade over time as real-world data distributions change (data drift) or the relationship between inputs and outputs changes (concept drift). You must build a comprehensive monitoring system that logs live inference requests and compares them against the original training dataset. Implement statistical tests (e.g., KS-test, Population Stability Index) to detect drift. When drift crosses a defined threshold, the system must trigger an alert (Slack/Email) and automatically queue a retraining pipeline in Airflow, generating a dashboard that visualizes the drift over time.',
    context: 'A credit scoring model degrades as macroeconomic conditions change. Without automated drift detection, the business might approve bad loans for months before realizing the model is outdated.',
    deliverables: [
      'Data logging architecture for production inferences',
      'Statistical drift detection algorithms',
      'Grafana/Evidently AI dashboard for visualizing drift metrics',
      'Alerting integration with Slack',
      'Automated trigger logic for Airflow DAGs'
    ],
    evaluationCriteria: [
      'Accuracy and sensitivity of the drift detection tests',
      'Low latency impact of logging on the inference API',
      'Reliability of the automated alerting and retraining triggers',
      'Clarity and usability of the monitoring dashboard'
    ],
    techStack: ['Python', 'Evidently AI / Alibi Detect', 'Airflow', 'Grafana', 'FastAPI'],
    hiringRoles: ['MLOps Engineer', 'Data Scientist', 'Operations Analyst'],
    sampleCompanies: ['Upstox', 'PolicyBazaar', 'Pine Labs', 'Lendingkart'],
    isCapstone: false
  },
  {
    id: 'mlops-6',
    programSlug: 'mlops-llmops-engineering',
    title: 'GPU Cost Optimiser & Spot Instance Scheduler',
    difficulty: 'Advanced',
    estimatedWeeks: 4,
    tags: ['Cloud', 'Cost Optimization', 'Kubernetes', 'Training'],
    problemStatement: 'Training deep learning models on on-demand cloud GPUs is exorbitantly expensive. Teams can save up to 80% by using spot/preemptible instances, but these instances can be terminated without warning, ruining hours of training. Build a fault-tolerant job scheduler on Kubernetes. It must intercept training job requests, provision GPU spot instances, and actively monitor them. Crucially, it must implement aggressive checkpointing. If an instance is preempted, the scheduler must automatically provision a new instance, load the last checkpoint, and resume training seamlessly without human intervention.',
    context: 'An AI startup is burning through its cloud credits training vision models. Implementing a robust spot-instance architecture is a matter of survival to extend their runway.',
    deliverables: [
      'Kubernetes controller/operator for job scheduling',
      'Infrastructure as Code (Terraform) for spot instance pools',
      'Training script wrapper enforcing continuous checkpointing',
      'State recovery mechanism upon instance preemption',
      'Cost analysis report comparing on-demand vs spot execution'
    ],
    evaluationCriteria: [
      'Reliability of the checkpoint recovery mechanism',
      'Speed of provisioning and resuming on new instances',
      'Total cost savings demonstrated in the simulation',
      'System resilience to high preemption rates'
    ],
    techStack: ['Go / Python', 'Kubernetes', 'Terraform', 'AWS EC2 / GCP Compute', 'PyTorch (Checkpointing)'],
    hiringRoles: ['Cloud Engineer', 'MLOps Engineer', 'SRE'],
    sampleCompanies: ['Qure.ai', 'Wysa', 'Pixis', 'Observe.AI'],
    isCapstone: false
  },
  {
    id: 'mlops-7',
    programSlug: 'mlops-llmops-engineering',
    title: 'A/B Testing Framework for LLMs in Production',
    difficulty: 'Intermediate',
    estimatedWeeks: 4,
    tags: ['LLMOps', 'A/B Testing', 'Analytics', 'Gateway'],
    problemStatement: 'Prompt engineering and model selection (e.g., GPT-4 vs. Claude 3.5) require rigorous testing in production. You must build an A/B testing framework specifically designed for LLM applications. The system must act as an API gateway that routes requests to different models or prompts based on user segments or deterministic hashing. It must log the inputs, outputs, latency, token usage, and user feedback (thumbs up/down or implicit conversion metrics), providing a statistical dashboard to determine the winning variant based on cost, speed, and quality.',
    context: 'A SaaS company writing marketing copy wants to switch from OpenAI to an open-source model (Llama 3) to save costs, but they must prove that output quality and user engagement will not drop.',
    deliverables: [
      'LLM API Gateway with dynamic routing logic',
      'Telemetry logging for latency, tokens, and user feedback',
      'Statistical analysis engine (calculating statistical significance)',
      'Dashboard visualizing A/B test results',
      'Configuration management for defining new experiments dynamically'
    ],
    evaluationCriteria: [
      'Accuracy of the deterministic routing mechanism',
      'Statistical soundness of the A/B test evaluation',
      'Minimal latency overhead added by the gateway',
      'Robustness of telemetry data collection'
    ],
    techStack: ['Node.js / Go', 'PostgreSQL', 'Redis', 'LiteLLM', 'Metabase'],
    hiringRoles: ['LLMOps Engineer', 'Backend Engineer', 'Product Data Scientist'],
    sampleCompanies: ['VWO', 'Postman', 'Chargebee', 'Darwinbox'],
    isCapstone: false
  },
  {
    id: 'mlops-8',
    programSlug: 'mlops-llmops-engineering',
    title: 'Self-healing Data Pipeline for ML (dbt)',
    difficulty: 'Advanced',
    estimatedWeeks: 5,
    tags: ['Data Engineering', 'Data Quality', 'dbt', 'Pipelines'],
    problemStatement: 'Machine learning models are only as good as the data feeding them ("garbage in, garbage out"). Upstream schema changes or missing values routinely break ML pipelines. Build a robust data transformation pipeline using dbt integrated with Great Expectations for data quality. The pipeline must validate incoming data against strict contracts. If a non-critical error is found (e.g., missing non-essential column), it should impute the data and alert the team. If a critical error is found (e.g., target variable is null), it must halt the pipeline, preventing bad data from entering the feature store, and trigger an automated incident ticket.',
    context: 'A retail analytics company trains forecasting models nightly. Silent data failures have previously caused the system to order zero inventory, causing severe stockouts. Data quality must be enforced strictly.',
    deliverables: [
      'dbt project with complex SQL transformations',
      'Great Expectations suite defining data contracts',
      'Orchestration logic (Airflow/Dagster) with conditional branching',
      'Automated alerting and ticketing (Jira/Slack)',
      'Data lineage documentation'
    ],
    evaluationCriteria: [
      'Comprehensiveness of the data quality rules',
      'Reliability of the pipeline halting mechanism on critical errors',
      'Effectiveness of the imputation logic for non-critical errors',
      'Clarity of the alerts provided to data engineers'
    ],
    techStack: ['SQL', 'dbt', 'Great Expectations', 'Airflow', 'Snowflake / BigQuery'],
    hiringRoles: ['Analytics Engineer', 'Data Engineer', 'MLOps Engineer'],
    sampleCompanies: ['Zepto', 'Dunzo', 'Licious', 'Cure.fit'],
    isCapstone: true
  },
  {
    id: 'mlops-9',
    programSlug: 'mlops-llmops-engineering',
    title: 'LLM Gateway (Rate Limiting, Caching, Costs)',
    difficulty: 'Intermediate',
    estimatedWeeks: 4,
    tags: ['LLMOps', 'Infrastructure', 'Cost Control', 'Caching'],
    problemStatement: 'As multiple teams within an enterprise start building LLM applications, API costs spiral out of control, and rate limits are frequently hit. You are tasked with building a centralized LLM API Gateway. It must intercept all outbound requests to providers (OpenAI, Anthropic), enforce team-level rate limits and monthly cost quotas, provide semantic caching (returning the same response for rephrased questions to save money), and implement automatic failover to fallback models if the primary API experiences downtime.',
    context: 'An IT services conglomerate has 50 different internal AI projects. Finance needs to track cost per project, and engineering needs to ensure reliable uptime despite external API outages.',
    deliverables: [
      'API Gateway capable of proxying LLM requests',
      'Redis-based semantic caching layer using vector embeddings',
      'Token counting and cost attribution engine',
      'Rate limiting and quota management system',
      'Failover logic across multiple model providers'
    ],
    evaluationCriteria: [
      'Accuracy of cost attribution per tenant/team',
      'Cache hit rate and latency improvements',
      'Reliability of the failover mechanism during simulated outages',
      'System throughput and minimal latency overhead'
    ],
    techStack: ['Go / Rust / Python', 'Redis', 'LiteLLM', 'PostgreSQL', 'Docker'],
    hiringRoles: ['Platform Engineer', 'LLMOps Engineer', 'Backend Developer'],
    sampleCompanies: ['TCS', 'Wipro', 'HCL', 'Tech Mahindra'],
    isCapstone: false
  },
  {
    id: 'mlops-10',
    programSlug: 'mlops-llmops-engineering',
    title: 'RLHF Data Collection & QA Platform',
    difficulty: 'Intermediate',
    estimatedWeeks: 4,
    tags: ['LLMOps', 'Data Platform', 'Human-in-the-loop', 'QA'],
    problemStatement: 'Building proprietary LLMs requires massive amounts of high-quality human preference data. Managing hundreds of freelance annotators via spreadsheets is chaotic and error-prone. Build a dedicated RLHF data collection platform. It must present annotators with a clean UI showing an prompt and two model responses. They must rate the responses and explain their choice. Crucially, the backend must implement quality control mechanisms: randomly inserting "gold standard" test questions to score annotator reliability, and requiring consensus among multiple annotators for edge cases before committing the data to the final training set.',
    context: 'A foundation model startup needs to align their new Hindi-English model. The bottleneck is not compute, but gathering 100,000 high-quality human preference pairs quickly and reliably.',
    deliverables: [
      'Web application UI for data annotation and comparison',
      'Backend system managing tasks, annotators, and roles',
      'Quality control logic (honeypot questions, inter-annotator agreement)',
      'Export pipeline formatting data for standard RLHF training (JSONL)',
      'Admin dashboard tracking annotator performance and throughput'
    ],
    evaluationCriteria: [
      'Usability and speed of the annotation UI',
      'Effectiveness of the QA mechanisms in identifying bad annotators',
      'Correctness of the data export formats',
      'Scalability of the database schema for concurrent users'
    ],
    techStack: ['React', 'Node.js / Django', 'PostgreSQL', 'Tailwind CSS'],
    hiringRoles: ['Full Stack Engineer', 'AI Data Operations', 'Platform Engineer'],
    sampleCompanies: ['Scale AI', 'Labelbox', 'Snorkel', 'Krutrim'],
    isCapstone: false
  }
];

export const DATA_ENGINEERING_PROJECTS: DomainProject[] = [
  {
    id: 'de-1',
    programSlug: 'data-engineering-ai-platforms',
    title: 'Real-time Clickstream Pipeline (Kafka/Flink)',
    difficulty: 'Advanced',
    estimatedWeeks: 5,
    tags: ['Streaming', 'Real-time', 'Analytics', 'Kafka'],
    problemStatement: 'E-commerce product managers need to monitor user behavior in real-time to detect anomalies, like a broken checkout button or a sudden drop in cart additions during a flash sale. Batch processing every 24 hours is too slow. You must build a highly scalable, real-time clickstream ingestion pipeline. It must capture raw events from simulated web/mobile clients via an API, publish them to Kafka, process and aggregate the streams (sessionization, windowed aggregations) using Apache Flink, and write the processed data into ClickHouse for sub-second querying by a Superset dashboard.',
    context: 'A major online retailer is preparing for "Big Billion Days". They need a dashboard that updates instantly, allowing business teams to react to traffic patterns and technical failures within seconds, not days.',
    deliverables: [
      'Event generation script simulating millions of user interactions',
      'Kafka cluster configuration and topic design',
      'Flink jobs for stateful stream processing and sessionization',
      'ClickHouse schema design for fast OLAP queries',
      'Real-time Apache Superset dashboard'
    ],
    evaluationCriteria: [
      'End-to-end latency (event generation to dashboard visibility)',
      'System ability to handle high throughput without dropping messages',
      'Correctness of stateful window aggregations in Flink',
      'Query performance on the ClickHouse database'
    ],
    techStack: ['Apache Kafka', 'Apache Flink', 'ClickHouse', 'Apache Superset', 'Python'],
    hiringRoles: ['Data Engineer', 'Streaming Data Engineer', 'Big Data Developer'],
    sampleCompanies: ['Flipkart', 'Meesho', 'Swiggy', 'Dream11'],
    isCapstone: true
  },
  {
    id: 'de-2',
    programSlug: 'data-engineering-ai-platforms',
    title: 'Data Lakehouse Migration (Oracle to Iceberg)',
    difficulty: 'Expert',
    estimatedWeeks: 6,
    tags: ['Migration', 'Lakehouse', 'Iceberg', 'ETL'],
    problemStatement: 'An enterprise is tied to an expensive, rigid on-premise Oracle ERP system and wants to modernize by migrating to a cloud-native Data Lakehouse. The project requires migrating a massive historical dataset to Amazon S3 (or GCS) using the Apache Iceberg open table format. You must build an initial bulk load process, followed by an automated incremental pipeline that handles schema evolution (e.g., when a column is added in Oracle, it reflects in Iceberg without breaking). The final architecture must allow data scientists to query the data via Apache Spark, treating the S3 bucket like a transactional database.',
    context: 'A legacy manufacturing giant is modernizing its data stack to reduce licensing costs and enable AI/ML workloads, which were impossible on the old transactional system due to performance constraints.',
    deliverables: [
      'Data extraction scripts for bulk and incremental loads',
      'Apache Iceberg table configuration and partitioning strategy',
      'Spark jobs for writing data into the Lakehouse',
      'Implementation of schema evolution handling',
      'Performance benchmarking report (query speed and storage cost)'
    ],
    evaluationCriteria: [
      'Data parity between source (Oracle) and target (Iceberg)',
      'Efficiency of the incremental update process',
      'Successful handling of schema changes',
      'Optimization of the Iceberg table (compaction and sorting)'
    ],
    techStack: ['Apache Spark', 'Apache Iceberg', 'Python', 'AWS S3 / GCS', 'Debezium'],
    hiringRoles: ['Data Engineer', 'Cloud Data Architect', 'Big Data Engineer'],
    sampleCompanies: ['Tata Steel', 'Reliance Retail', 'L&T', 'TCS'],
    isCapstone: true
  },
  {
    id: 'de-3',
    programSlug: 'data-engineering-ai-platforms',
    title: 'Multi-source CDC Pipeline to Snowflake',
    difficulty: 'Advanced',
    estimatedWeeks: 5,
    tags: ['CDC', 'Integration', 'Data Warehouse', 'Snowflake'],
    problemStatement: 'A modern enterprise relies on multiple siloed systems: PostgreSQL for user data, MongoDB for unstructured product catalogs, and Salesforce for CRM. The executive team demands a unified "Customer 360" view in Snowflake. You must implement a Change Data Capture (CDC) pipeline using Debezium and Kafka. It must instantly capture inserts, updates, and deletes from the operational databases without impacting their performance, transport them reliably, and apply the changes to the target Snowflake warehouse, resolving schema mismatches and creating a clean, integrated dimensional model.',
    context: 'A B2B SaaS platform needs a single source of truth for billing, product usage, and sales interactions to accurately calculate customer lifetime value and churn risk.',
    deliverables: [
      'Debezium connectors configured for PostgreSQL and MongoDB',
      'Kafka infrastructure for message transport',
      'Snowpipe / Kafka Connect integration into Snowflake',
      'SQL-based transformation logic in Snowflake (dbt optional)',
      'Monitoring dashboard for pipeline latency and data freshness'
    ],
    evaluationCriteria: [
      'Accuracy of data replication (no missing or duplicated records)',
      'Latency from source update to Snowflake availability',
      'Resilience of the pipeline to network interruptions',
      'Cleanliness of the final dimensional data model'
    ],
    techStack: ['Debezium', 'Kafka', 'Snowflake', 'PostgreSQL', 'MongoDB'],
    hiringRoles: ['Data Integration Engineer', 'Data Engineer', 'Analytics Engineer'],
    sampleCompanies: ['Freshworks', 'Chargebee', 'BrowserStack', 'Postman'],
    isCapstone: true
  },
  {
    id: 'de-4',
    programSlug: 'data-engineering-ai-platforms',
    title: 'Enterprise Data Quality Framework (500 rules)',
    difficulty: 'Intermediate',
    estimatedWeeks: 4,
    tags: ['Data Quality', 'Governance', 'Alerting', 'Automation'],
    problemStatement: 'As a data warehouse grows to hundreds of tables, silent data corruption becomes the biggest threat to trust. Dashboards show incorrect revenue figures due to upstream bugs. You must implement an automated, scalable data quality framework. It must execute over 500 distinct checks (nullness, uniqueness, referential integrity, expected ranges) across a mock database nightly. The system must not just fail pipelines; it must categorize errors by severity, track quality metrics over time, and dispatch highly specific, actionable alerts to the owning engineering team via Slack, including the exact rows that failed.',
    context: 'A fast-growing delivery startup is experiencing "data downtime". The CEO lost trust in the BI reports after a dashboard erroneously showed a 50% drop in active users due to a broken ETL job.',
    deliverables: [
      'Great Expectations or Soda Core configuration',
      'Parameterized test suite for 500+ rules',
      'Automated execution pipeline via Airflow or Dagster',
      'Data Quality Dashboard visualizing health scores',
      'Slack integration for contextual alerting'
    ],
    evaluationCriteria: [
      'Scalability of the test execution (completing within SLA)',
      'Comprehensiveness of the rules (catching diverse data anomalies)',
      'Actionability of the alerts',
      'Ease of adding new rules by non-engineers'
    ],
    techStack: ['Python', 'Great Expectations / Soda', 'Airflow', 'Slack API', 'BigQuery'],
    hiringRoles: ['Data Quality Engineer', 'Data Engineer', 'Data Governance Analyst'],
    sampleCompanies: ['Swiggy', 'Zomato', 'Urban Company', 'Nykaa'],
    isCapstone: false
  },
  {
    id: 'de-5',
    programSlug: 'data-engineering-ai-platforms',
    title: 'Universal Semantic Layer (dbt + Cube.js)',
    difficulty: 'Intermediate',
    estimatedWeeks: 4,
    tags: ['Semantic Layer', 'dbt', 'Analytics', 'BI'],
    problemStatement: 'Different departments calculate "Monthly Recurring Revenue (MRR)" differently, leading to chaotic executive meetings where BI tools show conflicting numbers. The solution is to build a Universal Semantic Layer. You will use dbt to transform raw data into a clean physical schema, and then implement Cube.js on top to define strict, governed business metrics. This semantic layer must act as a single API endpoint serving data to BI dashboards (Tableau/PowerBI), custom internal React apps, and Jupyter notebooks, ensuring everyone consumes the exact same definitions.',
    context: 'A maturing tech company is moving from a decentralized analytics free-for-all to centralized governance. Consistency and trust in data metrics are paramount for the upcoming IPO preparation.',
    deliverables: [
      'dbt project with well-documented data models',
      'Cube.js configuration defining metrics, dimensions, and joins',
      'REST/GraphQL API endpoints exposing the metrics',
      'Implementation of caching strategies in Cube.js for performance',
      'Sample frontend integration demonstrating metric consumption'
    ],
    evaluationCriteria: [
      'Accuracy and consistency of the metric calculations',
      'Performance of the semantic layer APIs under concurrent load',
      'Clarity of the metric definitions and documentation',
      'Robustness of the caching configuration'
    ],
    techStack: ['dbt', 'Cube.js', 'PostgreSQL / Snowflake', 'React', 'YAML'],
    hiringRoles: ['Analytics Engineer', 'BI Engineer', 'Data Architect'],
    sampleCompanies: ['Razorpay', 'CleverTap', 'MoEngage', 'Mindtickle'],
    isCapstone: false
  },
  {
    id: 'de-6',
    programSlug: 'data-engineering-ai-platforms',
    title: 'Real-time Personalisation Engine',
    difficulty: 'Advanced',
    estimatedWeeks: 5,
    tags: ['Real-time', 'Machine Learning', 'Data Engineering', 'Redis'],
    problemStatement: 'Modern apps need to change content instantly based on the user’s last click. If a user clicks on three "running shoe" products, the home page must immediately update to feature athletic wear. Build the data infrastructure for a real-time personalization engine. You must construct a streaming pipeline that captures click events, updates user feature vectors (historical preferences + real-time session context) in an in-memory database like Redis within 50 milliseconds, and exposes a high-throughput API for the frontend to query the most relevant product recommendations.',
    context: 'An OTT platform wants to recommend the next video to watch before the current video’s credits finish rolling. Batch processing cannot meet the sub-second latency requirement.',
    deliverables: [
      'Streaming event ingestion pipeline',
      'Feature computation logic updating state in Redis',
      'Recommendation API evaluating features and rules',
      'Load testing suite to verify sub-50ms latency',
      'Mock frontend to visualize real-time personalization'
    ],
    evaluationCriteria: [
      'End-to-end latency from event generation to API response',
      'Accuracy of the real-time feature updates',
      'System throughput capacity',
      'Resilience of the in-memory database setup'
    ],
    techStack: ['Python / Go', 'Kafka', 'Redis', 'FastAPI', 'Docker'],
    hiringRoles: ['Data Engineer', 'Backend Engineer - Data', 'ML Engineer'],
    sampleCompanies: ['Disney+ Hotstar', 'JioCinema', 'Myntra', 'ShareChat'],
    isCapstone: true
  },
  {
    id: 'de-7',
    programSlug: 'data-engineering-ai-platforms',
    title: 'GDPR/DPDP Compliance Pipeline (PII Masking)',
    difficulty: 'Intermediate',
    estimatedWeeks: 4,
    tags: ['Security', 'Compliance', 'PII', 'Data Governance'],
    problemStatement: 'With the enforcement of the DPDP Act in India and GDPR globally, storing plaintext Personally Identifiable Information (PII) like phone numbers, Aadhaar, and credit cards is a massive legal liability. You must build a compliance-focused data pipeline. It must scan raw incoming data streams, automatically detect PII using pattern matching and ML-based NER models, apply appropriate masking or tokenization before writing to the data lake, and maintain a secure, audited vault for re-identification by authorized personnel only. It must also support automated "Right to be Forgotten" deletion requests.',
    context: 'A healthcare aggregator handles millions of patient records. A data breach would destroy the company. Security and compliance must be deeply embedded in the data ingestion architecture.',
    deliverables: [
      'PII detection module (Regex + ML)',
      'Data masking and tokenization pipeline',
      'Secure token vault architecture',
      'Automated deletion workflow for user data requests',
      'Comprehensive audit logging system'
    ],
    evaluationCriteria: [
      'Precision and recall of PII detection (no false negatives)',
      'Security of the tokenization mechanism',
      'Efficiency of the pipeline (minimal impact on throughput)',
      'Completeness of the audit logs'
    ],
    techStack: ['Python', 'Spacy / Presidio', 'Kafka', 'PostgreSQL (Vault)', 'AWS KMS / HashiCorp Vault'],
    hiringRoles: ['Data Security Engineer', 'Data Engineer', 'Compliance Engineer'],
    sampleCompanies: ['Innovaccer', 'Tata 1mg', 'PolicyBazaar', 'Zerodha'],
    isCapstone: false
  },
  {
    id: 'de-8',
    programSlug: 'data-engineering-ai-platforms',
    title: 'Automated Data Catalog and Lineage (100TB)',
    difficulty: 'Intermediate',
    estimatedWeeks: 4,
    tags: ['Data Discovery', 'Lineage', 'Metadata', 'Governance'],
    problemStatement: 'In massive organizations, analysts spend weeks just finding the right table and understanding where its data came from. An undocumented 100TB data warehouse is a liability, not an asset. You must deploy and configure a modern Data Catalog (like DataHub or Amundsen). The system must automatically crawl metadata from multiple databases (Snowflake, Postgres, Hive), parse complex SQL queries to automatically map column-level data lineage, and provide a search interface for users to discover datasets, view their owners, and understand their update frequency.',
    context: 'A telecom giant has hundreds of thousands of tables created by different teams over a decade. They need a "Google Search for their internal data" to improve analyst productivity and enable AI initiatives.',
    deliverables: [
      'Deployment of DataHub / Amundsen via Docker/Helm',
      'Metadata ingestion scripts targeting multiple sources',
      'Automated SQL parsing for column-level lineage generation',
      'Configuration of data ownership and tagging rules',
      'User guide for the discovery platform'
    ],
    evaluationCriteria: [
      'Completeness of the ingested metadata',
      'Accuracy of the automated lineage mapping',
      'Search relevance and UI usability',
      'Reliability of the scheduled metadata updates'
    ],
    techStack: ['DataHub / Amundsen', 'Python', 'SQLGlot (for parsing)', 'Docker', 'Airflow'],
    hiringRoles: ['Data Platform Engineer', 'Data Architect', 'Data Governance Lead'],
    sampleCompanies: ['Airtel', 'Jio', 'HDFC Bank', 'ICICI Bank'],
    isCapstone: false
  },
  {
    id: 'de-9',
    programSlug: 'data-engineering-ai-platforms',
    title: 'IOT Data Ingestion & Anomaly Detection',
    difficulty: 'Advanced',
    estimatedWeeks: 5,
    tags: ['IoT', 'Time-series', 'Anomaly Detection', 'Scale'],
    problemStatement: 'A fleet of 10,000 commercial delivery trucks continuously transmits telemetry data (GPS, engine temperature, tire pressure) every second. You must architect an IoT data platform capable of handling this massive influx of time-series data. The pipeline must ingest the high-frequency MQTT streams, store them efficiently in a Time-Series Database (like TimescaleDB or InfluxDB), and run continuous queries to detect anomalies—such as an engine overheating or sudden route deviations—triggering immediate alerts to the fleet management dashboard.',
    context: 'A national logistics and supply chain company is looking to reduce vehicle breakdowns and optimize fuel efficiency. Proactive maintenance driven by real-time IoT data will save millions in operational costs.',
    deliverables: [
      'IoT data simulator generating high-frequency streams',
      'MQTT broker configuration and data ingestion pipeline',
      'Time-Series Database schema optimization (hypertables/compression)',
      'Continuous queries for real-time anomaly detection',
      'Fleet monitoring visualization dashboard'
    ],
    evaluationCriteria: [
      'System ability to handle high write throughput (10k+ events/sec)',
      'Query performance on large historical time-series windows',
      'Accuracy and speed of the anomaly alerting',
      'Storage efficiency and data retention strategies'
    ],
    techStack: ['Python / Go', 'MQTT (Mosquitto)', 'TimescaleDB / InfluxDB', 'Grafana', 'Kafka'],
    hiringRoles: ['IoT Data Engineer', 'Backend Engineer', 'Platform Engineer'],
    sampleCompanies: ['Delhivery', 'Rivigo', 'BlackBuck', 'TVS Supply Chain'],
    isCapstone: true
  },
  {
    id: 'de-10',
    programSlug: 'data-engineering-ai-platforms',
    title: 'Cross-border Data Mesh (Unified Governance)',
    difficulty: 'Expert',
    estimatedWeeks: 6,
    tags: ['Data Mesh', 'Architecture', 'Governance', 'Decentralization'],
    problemStatement: 'A multinational corporation operates 5 regional domains (US, EU, India, APAC, LATAM), each using different data stacks (AWS, GCP, Azure) due to local data residency laws. A centralized data lake is legally and technically impossible. You must design and implement a prototype Data Mesh architecture. Each region will expose highly curated "Data Products" via standard APIs or federated queries (e.g., using Trino/Presto). You must build the central governance plane that enforces global access policies, data contracts, and monitors cross-regional data consumption without physically moving the raw data.',
    context: 'A global pharmaceutical company must share R&D data across continents without violating GDPR or local data sovereignty laws. They need a decentralized architecture with centralized oversight.',
    deliverables: [
      'Deployment of a federated query engine (Trino)',
      'Implementation of mock regional data domains across different databases',
      'Centralized access control layer and policy enforcement',
      'Definition and implementation of Data Contracts',
      'Data Product discovery registry'
    ],
    evaluationCriteria: [
      'Successful execution of cross-regional federated queries',
      'Robustness of the access control (e.g., blocking EU data access from unauthorized US users)',
      'Performance and latency of federated queries',
      'Clarity of the Data Mesh architectural documentation'
    ],
    techStack: ['Trino / Presto', 'Docker', 'PostgreSQL / MinIO', 'Open Policy Agent (OPA)', 'Python'],
    hiringRoles: ['Data Architect', 'Principal Data Engineer', 'Enterprise Architect'],
    sampleCompanies: ['Dr. Reddy\'s', 'Sun Pharma', 'Tata Motors', 'Infosys (Internal)'],
    isCapstone: true
  }
];

export const PROJECTS_BY_PROGRAM: Record<string, DomainProject[]> = {
  'ai-engineering-generative-ai': AI_ENGINEERING_PROJECTS,
  'agentic-ai-automation': AGENTIC_AI_PROJECTS,
  'mlops-llmops-engineering': MLOPS_PROJECTS,
  'data-engineering-ai-platforms': DATA_ENGINEERING_PROJECTS
};

export const ALL_PROJECTS: DomainProject[] = [
  ...AI_ENGINEERING_PROJECTS,
  ...AGENTIC_AI_PROJECTS,
  ...MLOPS_PROJECTS,
  ...DATA_ENGINEERING_PROJECTS
];
