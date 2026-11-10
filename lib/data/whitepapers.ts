export interface Whitepaper {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  tags: string[];
  publishedAt: string;
  pages: number;
  fileSize: string; // e.g. '2.4 MB'
  access: 'open' | 'gated'; // gated requires email
  coverGradient: string;
  abstract: string; // 150-200 words
  keyFindings: string[]; // 5 bullet points
  downloadUrl: string; // use '#' as placeholder
}

export const whitepapers: Whitepaper[] = [
  {
    slug: 'state-of-ai-engineering-india-2026',
    title: 'The State of AI Engineering in India 2026',
    subtitle: 'Comprehensive analysis of the evolving talent landscape and enterprise adoption.',
    category: 'Industry Report',
    tags: ['AI', 'Engineering', 'India', 'Talent'],
    publishedAt: '2026-09-10T00:00:00Z',
    pages: 32,
    fileSize: '4.2 MB',
    access: 'gated',
    coverGradient: 'bg-gradient-brand',
    abstract: 'This extensive report provides a deep dive into the state of AI engineering in India as of 2026. Based on surveys of over 500 enterprise engineering leaders and data from thousands of AI deployments, we analyze the shift from theoretical AI research to applied engineering. The report covers the most demanded skills, the gap between academic curricula and industry requirements, and how leading organizations are restructuring their engineering teams to support widespread AI adoption. We also explore the rising prominence of Forward Deployment Engineers (FDEs) and the specific challenges faced when integrating foundational models into legacy enterprise systems.',
    keyFindings: [
      'Demand for applied AI engineers has outpaced traditional software engineering roles by 3x.',
      'Over 60% of enterprise AI projects fail due to integration and infrastructure challenges, not model performance.',
      'The "Forward Deployment Engineer" is the fastest-growing job title in the Indian tech sector.',
      'Proficiency in vector databases, RAG architecture, and MLOps are the most critical skills for new hires.',
      'Tier-2 cities, particularly Bhubaneswar, are emerging as significant hubs for deep-tech AI talent.'
    ],
    downloadUrl: '#'
  },
  {
    slug: 'forward-deployment-engineering-guide',
    title: 'The Forward Deployment Engineering Guide',
    subtitle: 'A practical framework for integrating AI into enterprise workflows.',
    category: 'Technical Guide',
    tags: ['FDE', 'Architecture', 'Integration'],
    publishedAt: '2026-08-15T00:00:00Z',
    pages: 24,
    fileSize: '2.8 MB',
    access: 'open',
    coverGradient: 'bg-gradient-flame',
    abstract: 'Forward Deployment Engineering is the bridge between powerful AI models and real-world business value. This technical guide outlines the core methodologies, architectural patterns, and necessary toolchains for successful forward deployment. It provides actionable advice on scoping AI projects, designing scalable Retrieval-Augmented Generation (RAG) pipelines, managing data privacy and security, and building robust monitoring systems for LLM applications in production. Designed for senior engineers and technical leads, this guide serves as a blueprint for executing complex AI integration projects.',
    keyFindings: [
      'Successful FDEs require a hybrid skill set encompassing backend engineering, cloud architecture, and applied ML.',
      'Standardized deployment templates significantly reduce the time-to-value for enterprise AI initiatives.',
      'Robust evaluation frameworks are essential for mitigating hallucinations and ensuring output reliability.',
      'Data governance and secure access control must be designed into AI systems from day one.',
      'Continuous iteration and close collaboration with business stakeholders are vital for FDE success.'
    ],
    downloadUrl: '#'
  },
  {
    slug: 'gpu-infrastructure-for-enterprise-ai',
    title: 'GPU Infrastructure for Enterprise AI',
    subtitle: 'Optimizing compute resources for training and inference at scale.',
    category: 'Architecture',
    tags: ['GPU', 'Infrastructure', 'Cloud'],
    publishedAt: '2026-07-20T00:00:00Z',
    pages: 28,
    fileSize: '3.5 MB',
    access: 'gated',
    coverGradient: 'bg-gradient-to-br from-blue-900 to-cyan-500',
    abstract: 'As AI models grow in complexity, managing the underlying compute infrastructure has become a critical challenge. This whitepaper explores the strategies for designing, provisioning, and optimizing GPU clusters for enterprise workloads. We analyze the cost-benefit trade-offs between on-premise deployments, hyperscale cloud providers, and specialized GPU alt-clouds. The paper also delves into advanced techniques for maximizing GPU utilization, including Kubernetes scheduling optimizations, efficient memory management for inference (e.g., PagedAttention), and distributed training strategies.',
    keyFindings: [
      'Hybrid cloud strategies combining on-premise training with cloud-based inference offer the best cost-to-performance ratio.',
      'Inference optimization techniques like quantization and efficient attention mechanisms can reduce compute requirements by up to 4x.',
      'Specialized GPU cloud providers often offer significant cost advantages over traditional hyperscalers for specific AI workloads.',
      'Effective Kubernetes orchestration is essential for managing dynamic, heterogeneous GPU clusters.',
      'Monitoring and FinOps practices are crucial for controlling the escalating costs of AI infrastructure.'
    ],
    downloadUrl: '#'
  },
  {
    slug: 'platform-engineering-maturity-model',
    title: 'Platform Engineering Maturity Model',
    subtitle: 'Assessing and accelerating your Internal Developer Platform journey.',
    category: 'DevOps',
    tags: ['Platform Engineering', 'IDP', 'Kubernetes'],
    publishedAt: '2026-06-05T00:00:00Z',
    pages: 20,
    fileSize: '2.1 MB',
    access: 'open',
    coverGradient: 'bg-gradient-to-br from-purple-700 to-pink-500',
    abstract: 'Platform engineering has emerged as the definitive approach to managing developer productivity and infrastructure complexity. This whitepaper introduces a comprehensive Maturity Model for assessing an organization\'s progress in building Internal Developer Platforms (IDPs). We define four stages of maturity—from ad-hoc scripting to fully self-service, intelligent platforms. The guide provides specific metrics, organizational structures, and technological milestones to help engineering teams navigate their transition and achieve high-performing platform operations.',
    keyFindings: [
      'Organizations with high platform maturity deploy code 5x faster than those with low maturity.',
      'Treating the platform as a product, with developers as customers, is the primary driver of IDP adoption.',
      'Self-service infrastructure provisioning significantly reduces developer cognitive load and operational bottlenecks.',
      'Golden paths and automated governance are critical for balancing developer velocity with organizational security.',
      'Successful platform teams prioritize user experience (UX) and comprehensive documentation.'
    ],
    downloadUrl: '#'
  },
  {
    slug: 'odisha-deeptech-talent-report-2026',
    title: 'Odisha Deep-Tech Talent Report 2026',
    subtitle: 'Analyzing the growth of eastern India\'s premier technology hub.',
    category: 'Industry Report',
    tags: ['Odisha', 'Talent', 'Deep-Tech'],
    publishedAt: '2026-05-12T00:00:00Z',
    pages: 16,
    fileSize: '1.8 MB',
    access: 'open',
    coverGradient: 'bg-gradient-flame',
    abstract: 'This report analyzes the rapid emergence of Bhubaneswar and the wider state of Odisha as a significant hub for deep-tech innovation in India. We examine the confluence of government policy, academic investments, and industry partnerships that are driving this growth. The report provides detailed statistics on the availability of specialized talent in areas such as semiconductor design, AI engineering, and cloud architecture. It also highlights case studies of successful startups and established enterprises that have scaled operations in the region.',
    keyFindings: [
      'Bhubaneswar has seen a 40% year-over-year increase in deep-tech engineering roles.',
      'Proactive government policies have been instrumental in attracting major semiconductor investments to the state.',
      'Collaborations between industry and academia (like the TEJAS Institute) are successfully bridging the skills gap.',
      'The region offers a highly favorable cost-of-living to quality-of-talent ratio compared to traditional tech hubs.',
      'Odisha is rapidly becoming a center of excellence for hardware engineering and VLSI design.'
    ],
    downloadUrl: '#'
  },
  {
    slug: 'learn-while-you-work-outcomes-study',
    title: 'Learn-While-You-Work Outcomes Study',
    subtitle: 'Evaluating the efficacy of applied learning models in technical education.',
    category: 'Education',
    tags: ['Education', 'Pedagogy', 'Career'],
    publishedAt: '2026-04-01T00:00:00Z',
    pages: 18,
    fileSize: '1.9 MB',
    access: 'gated',
    coverGradient: 'bg-gradient-to-br from-green-600 to-teal-400',
    abstract: 'Traditional postgraduate engineering programs often fail to prepare students for the realities of modern software development. This study evaluates the effectiveness of the "Learn-While-You-Work" model employed at the TEJAS Institute. By comparing the career trajectories and technical competencies of TEJAS fellows against graduates of conventional M.Tech programs, we demonstrate the superior outcomes of applied learning. The report analyzes metrics such as time-to-productivity, problem-solving capabilities, and long-term career growth.',
    keyFindings: [
      'Fellows in applied learning programs reach full productivity 60% faster than traditional graduates.',
      'The model significantly improves engineers\' ability to handle ambiguity and design complex systems.',
      'Integration of academic learning with real-world production constraints leads to better retention of technical concepts.',
      'The financial independence provided by the model broadens access to high-quality technical education.',
      'Employers consistently rate "Learn-While-You-Work" graduates as more adaptable and pragmatic engineers.'
    ],
    downloadUrl: '#'
  }
];
