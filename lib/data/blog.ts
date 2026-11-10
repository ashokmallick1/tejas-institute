export type BlogCategory = 'AI & ML' | 'Cloud & DevOps' | 'Career' | 'Industry' | 'Student Stories' | 'Semiconductor' | 'Research';

export interface BlogPost {
  slug: string;
  title: string;
  subtitle: string;
  category: BlogCategory;
  tags: string[];
  author: { name: string; role: string; avatar?: string; };
  publishedAt: string; // ISO date
  readTimeMinutes: number;
  featured: boolean;
  coverGradient: string; // tailwind gradient string for cover
  excerpt: string;
  content: string; // full markdown/HTML content (long-form, 800+ words)
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'why-forward-deployment-engineers-are-the-future',
    title: 'Why Forward Deployment Engineers are the Future of Tech',
    subtitle: 'Bridging the gap between core engineering and customer outcomes.',
    category: 'AI & ML',
    tags: ['FDE', 'Career', 'AI'],
    author: { name: 'Prof. Priyadarshi Mohapatra', role: 'Director' },
    publishedAt: '2026-10-01T10:00:00Z',
    readTimeMinutes: 6,
    featured: true,
    coverGradient: 'bg-gradient-flame',
    excerpt: 'Forward Deployment Engineers are bridging the massive gap between raw AI capabilities and actual enterprise integration.',
    content: `
      <h2>The Rise of the Forward Deployment Engineer</h2>
      <p>The traditional software engineering model is undergoing a massive shift. As AI models become more capable, the bottleneck is no longer building the model, but applying it effectively within existing enterprise architectures. This is where Forward Deployment Engineers (FDEs) step in.</p>
      
      <h3>What is an FDE?</h3>
      <p>An FDE is a hybrid role. They possess the deep technical skills of a backend or machine learning engineer, but operate on the front lines with clients. Their primary objective is not just to write code, but to solve specific, high-value business problems using cutting-edge technology.</p>
      <ul>
        <li><strong>Technical Depth:</strong> FDEs must deeply understand system architecture, data pipelines, and ML model deployment.</li>
        <li><strong>Customer Empathy:</strong> They need to translate ambiguous business requirements into technical specifications.</li>
        <li><strong>Rapid Iteration:</strong> FDEs thrive in fast-paced environments, prototyping and deploying solutions in days, not months.</li>
      </ul>

      <h3>Why 2026 is the Year of the FDE</h3>
      <p>With the proliferation of foundational models, companies are rushing to integrate AI. However, generic APIs often fall short of delivering real business value. FDEs customize these models, build necessary RAG pipelines, and ensure secure, compliant integration into proprietary data systems.</p>
      <blockquote>"The value of AI is not in the model itself, but in its contextual application. FDEs provide that context."</blockquote>

      <h3>The Skillset Required</h3>
      <p>To succeed as an FDE, engineers need a strong foundation in:</p>
      <ul>
        <li>Cloud Infrastructure (Kubernetes, AWS/GCP/Azure)</li>
        <li>Backend Engineering (Go, Python, Rust)</li>
        <li>Machine Learning Operations (MLOps)</li>
        <li>System Design and Architecture</li>
      </ul>
      <p>At TEJAS Institute, our curriculum is explicitly designed to cultivate these hybrid engineers, preparing them for the most demanding roles in the industry.</p>
    `
  },
  {
    slug: 'learn-while-you-work-why-it-beats-full-time-mtech',
    title: 'Learn While You Work: Why It Beats a Full-Time M.Tech',
    subtitle: 'Rethinking postgraduate engineering education.',
    category: 'Career',
    tags: ['Education', 'MTech', 'Fellowship'],
    author: { name: 'Dr. Debabrata Jena', role: 'Academic Dean' },
    publishedAt: '2026-09-25T08:00:00Z',
    readTimeMinutes: 5,
    featured: false,
    coverGradient: 'bg-gradient-brand',
    excerpt: 'Traditional M.Tech programs isolate students from real-world problems. The TEJAS Learn-While-You-Work model provides immediate application.',
    content: `
      <h2>The Problem with Traditional Postgrad</h2>
      <p>Traditional M.Tech programs in India often suffer from a severe disconnect between academia and industry. Students spend two years studying theoretical concepts that are frequently outdated by the time they graduate. Furthermore, the lack of real-world exposure means they struggle to apply their knowledge to complex, messy production systems.</p>

      <h3>The TEJAS Philosophy: Applied Learning</h3>
      <p>At TEJAS Institute, we believe the best way to master complex engineering is to build real things. Our "Learn-While-You-Work" model flips the traditional approach.</p>
      <ul>
        <li><strong>Immediate Application:</strong> Fellows learn a concept in the morning and apply it to a production codebase in the afternoon.</li>
        <li><strong>Industry Context:</strong> Learning occurs within the context of real-world constraints, such as cost, scalability, and security.</li>
        <li><strong>Financial Independence:</strong> Fellows earn a stipend while they learn, eliminating the financial burden of a traditional degree.</li>
      </ul>

      <h3>Outcomes Speak Louder Than Degrees</h3>
      <p>Our data shows that engineers who learn while working consistently outperform their peers in problem-solving and system design interviews. They build intuition, not just knowledge.</p>
      <blockquote>"I learned more in my first three months at TEJAS than I did in my entire undergraduate degree." - Former Fellow</blockquote>

      <h3>Redefining Engineering Excellence</h3>
      <p>We are not just training engineers; we are cultivating technical leaders who can architect solutions to the world's most pressing problems. The Learn-While-You-Work model is the cornerstone of this mission.</p>
    `
  },
  {
    slug: 'building-production-rag-pipeline-from-scratch',
    title: 'Building a Production RAG Pipeline from Scratch',
    subtitle: 'A technical deep dive into Retrieval-Augmented Generation architecture.',
    category: 'AI & ML',
    tags: ['RAG', 'Vector DB', 'LLMs'],
    author: { name: 'Rohan Patnaik', role: 'Fellow' },
    publishedAt: '2026-09-15T14:30:00Z',
    readTimeMinutes: 8,
    featured: true,
    coverGradient: 'bg-gradient-to-r from-blue-600 to-cyan-500',
    excerpt: 'A comprehensive guide to architecting, evaluating, and scaling a robust Retrieval-Augmented Generation system.',
    content: `
      <h2>Beyond the Proof of Concept</h2>
      <p>Building a RAG prototype with LangChain and a local vector database is easy. Building a production-ready RAG pipeline that handles millions of documents, maintains low latency, and prevents hallucinations is extremely difficult.</p>

      <h3>Architectural Components</h3>
      <p>A robust RAG system requires several key components:</p>
      <ul>
        <li><strong>Document Ingestion Pipeline:</strong> Robust parsers for various file formats (PDF, DOCX, HTML), OCR integration, and intelligent chunking strategies.</li>
        <li><strong>Embedding Model:</strong> Choosing the right embedding model (e.g., text-embedding-3-large, BGE-m3) based on domain specificity and latency requirements.</li>
        <li><strong>Vector Database:</strong> Scalable vector stores like Pinecone, Milvus, or pgvector for fast similarity search.</li>
        <li><strong>Retrieval Strategy:</strong> Implementing hybrid search (keyword + semantic), re-ranking (Cohere, Cross-Encoders), and metadata filtering.</li>
        <li><strong>Generation & Guardrails:</strong> Prompt engineering, output validation, and mechanisms to prevent prompt injection and hallucinations.</li>
      </ul>

      <h3>The Importance of Chunking Strategy</h3>
      <p>Poor chunking is the most common cause of bad RAG performance. Instead of fixed-size chunks, we recommend semantic chunking—breaking documents based on natural boundaries like paragraphs or sections.</p>
      <code>
      // Example of semantic chunking logic (pseudocode)
      function semanticChunk(document) {
        const sections = splitByHeaders(document);
        return sections.map(section => createChunkWithContext(section));
      }
      </code>

      <h3>Evaluation and Monitoring</h3>
      <p>You cannot improve what you cannot measure. Implement frameworks like Ragas or TruLens to continuously evaluate retrieval context precision, recall, and answer relevance. Monitor embedding drift and generation latency in production.</p>
    `
  },
  {
    slug: 'kubernetes-platform-engineering-2026',
    title: 'The State of Platform Engineering on Kubernetes in 2026',
    subtitle: 'Moving beyond YAML engineering to true self-service platforms.',
    category: 'Cloud & DevOps',
    tags: ['Kubernetes', 'Platform Engineering', 'DevOps'],
    author: { name: 'Ananya Sharma', role: 'Infrastructure Lead' },
    publishedAt: '2026-09-01T09:00:00Z',
    readTimeMinutes: 7,
    featured: false,
    coverGradient: 'bg-gradient-to-r from-purple-500 to-indigo-600',
    excerpt: 'Platform engineering has evolved. We explore the transition from raw Kubernetes primitives to intelligent, self-service developer portals.',
    content: `
      <h2>The End of "YAML Engineering"</h2>
      <p>For years, developers were forced to write complex Kubernetes manifests to deploy simple applications. This created immense friction and slowed down feature delivery. In 2026, the focus has shifted entirely to Platform Engineering.</p>

      <h3>Internal Developer Platforms (IDPs)</h3>
      <p>The goal of Platform Engineering is to build an Internal Developer Platform (IDP) that abstracts away the underlying infrastructure complexity. Tools like Backstage and custom control planes have become standard.</p>
      <ul>
        <li><strong>Golden Paths:</strong> Providing pre-configured, secure templates for common application architectures.</li>
        <li><strong>Self-Service Infrastructure:</strong> Allowing developers to provision databases, caches, and message queues without opening Jira tickets.</li>
        <li><strong>Automated Governance:</strong> Enforcing security and compliance policies automatically via admission controllers (OPA Gatekeeper, Kyverno).</li>
      </ul>

      <h3>The Role of WebAssembly (Wasm) in K8s</h3>
      <p>WebAssembly is increasingly being used alongside containers in Kubernetes environments. Wasm provides incredibly fast startup times and a smaller attack surface, making it ideal for edge workloads and lightweight microservices.</p>
      
      <h3>GitOps is the New Normal</h3>
      <p>ArgoCD and Flux have won the deployment war. Declarative infrastructure management via GitOps is no longer a best practice; it is a mandatory requirement for any serious engineering organization.</p>
    `
  },
  {
    slug: 'bhubaneswar-tech-ecosystem-rising',
    title: 'Bhubaneswar: The Rising Tech Capital of Eastern India',
    subtitle: 'How Odisha is building a robust deep-tech ecosystem.',
    category: 'Industry',
    tags: ['Odisha', 'Tech Hub', 'Ecosystem'],
    author: { name: 'Prof. Priyadarshi Mohapatra', role: 'Director' },
    publishedAt: '2026-08-20T11:00:00Z',
    readTimeMinutes: 5,
    featured: false,
    coverGradient: 'bg-gradient-flame',
    excerpt: 'With massive investments in semiconductor design, AI infrastructure, and talent development, Bhubaneswar is rapidly emerging as a global tech destination.',
    content: `
      <h2>Beyond IT Services</h2>
      <p>For decades, India's tech narrative has been dominated by IT services in cities like Bangalore, Hyderabad, and Pune. However, a silent revolution is happening in the East. Bhubaneswar is transforming itself from a quiet administrative city into a powerhouse of deep-tech innovation.</p>

      <h3>The Semiconductor Push</h3>
      <p>Odisha's recent semiconductor policy has attracted major investments in VLSI design and manufacturing. The state government is actively fostering partnerships with global semiconductor giants, creating thousands of high-skilled jobs.</p>

      <h3>Building the Talent Pipeline</h3>
      <p>Institutes like TEJAS are playing a crucial role in this transformation. By providing world-class training in AI, cloud computing, and hardware engineering, we are ensuring that the local talent pool meets global standards.</p>
      <ul>
        <li><strong>Industry-Academia Collaboration:</strong> Direct partnerships ensure curriculum relevance.</li>
        <li><strong>Incubation Centers:</strong> Providing startups with essential infrastructure and mentorship.</li>
      </ul>

      <h3>The Infrastructure Advantage</h3>
      <p>Bhubaneswar offers a high quality of life, excellent connectivity, and a lower cost of living compared to saturated metros. This makes it highly attractive for both established companies and ambitious startups.</p>
    `
  },
  {
    slug: 'vlsi-renaissance-india-chips',
    title: 'The VLSI Renaissance: India\'s Opportunity in Chip Design',
    subtitle: 'Capitalizing on the global semiconductor restructuring.',
    category: 'Semiconductor',
    tags: ['VLSI', 'Semiconductors', 'Hardware'],
    author: { name: 'Dr. Debabrata Jena', role: 'Academic Dean' },
    publishedAt: '2026-08-10T10:00:00Z',
    readTimeMinutes: 6,
    featured: false,
    coverGradient: 'bg-gradient-brand',
    excerpt: 'India has a historic opportunity to move beyond chip verification and become a global leader in core IC design and architecture.',
    content: `
      <h2>From Verification to Architecture</h2>
      <p>Historically, India's role in the global semiconductor supply chain was largely confined to verification and physical design. However, geopolitical shifts and the increasing demand for specialized silicon (AI accelerators, custom SoCs) have created a unique window of opportunity.</p>

      <h3>The Need for Specialized Talent</h3>
      <p>The bottleneck in the semiconductor industry is no longer just manufacturing capacity (fab); it is the availability of skilled design engineers. We need engineers who understand computer architecture, hardware description languages (Verilog/SystemVerilog), and mixed-signal design.</p>
      
      <h3>TEJAS's Role in the Ecosystem</h3>
      <p>Our specialized hardware engineering track focuses on bridging this gap. We provide fellows with access to industry-standard EDA tools and practical experience in FPGA prototyping and ASIC design flow.</p>
      <ul>
        <li><strong>Open-Source Silicon:</strong> Leveraging RISC-V and open-source tools to democratize chip design.</li>
        <li><strong>AI for EDA:</strong> Exploring how machine learning can accelerate the physical design and routing process.</li>
      </ul>

      <h3>The Path Forward</h3>
      <p>To become a semiconductor powerhouse, India must invest heavily in R&D and foster a culture of product innovation. It is time to start designing chips for the world, not just testing them.</p>
    `
  },
  {
    slug: 'from-fresher-to-ai-engineer-90-days',
    title: 'From Fresher to AI Engineer in 90 Days',
    subtitle: 'A fellow\'s journey through the TEJAS intensive boot camp.',
    category: 'Student Stories',
    tags: ['Bootcamp', 'Success Story', 'AI'],
    author: { name: 'Sneha Dash', role: 'Alumni' },
    publishedAt: '2026-07-25T09:30:00Z',
    readTimeMinutes: 4,
    featured: false,
    coverGradient: 'bg-gradient-to-r from-green-400 to-emerald-600',
    excerpt: 'Sneha shares her experience of transforming from a recent graduate with basic Python skills to deploying LLM applications in production.',
    content: `
      <h2>The Starting Line</h2>
      <p>When I joined TEJAS Institute, I knew some Python and had trained a basic linear regression model in Jupyter. I had no idea how to deploy an application, let alone build a scalable AI system.</p>

      <h3>The Intense First Month</h3>
      <p>The first four weeks were grueling. We dove deep into system programming, Docker, and Kubernetes. The focus was not on AI, but on the infrastructure required to support it. I learned that a model is useless if it cannot be served reliably.</p>

      <h3>Building the Intuition</h3>
      <p>By month two, we started working with large language models. The TEJAS approach is unique: we didn't just use APIs; we studied the underlying transformer architecture, learned about attention mechanisms, and fine-tuned models on custom datasets.</p>
      <ul>
        <li><strong>Week 5:</strong> Implementing self-attention from scratch.</li>
        <li><strong>Week 7:</strong> Fine-tuning Llama-3 on a domain-specific corpus using LoRA.</li>
      </ul>

      <h3>The Capstone Project</h3>
      <p>My final project involved building an autonomous agent that could triage customer support tickets, search a knowledge base, and generate responses. Deploying it to a Kubernetes cluster and monitoring its performance was the most rewarding experience of my career.</p>
      <blockquote>"TEJAS didn't just teach me tools; they taught me how to think like an engineer."</blockquote>
    `
  },
  {
    slug: 'gpu-infrastructure-democratizing-ai',
    title: 'Democratizing AI: The Role of GPU Infrastructure',
    subtitle: 'How accessible compute is driving the next wave of AI startups.',
    category: 'Research',
    tags: ['GPU', 'Infrastructure', 'Compute'],
    author: { name: 'Ananya Sharma', role: 'Infrastructure Lead' },
    publishedAt: '2026-07-10T14:00:00Z',
    readTimeMinutes: 6,
    featured: true,
    coverGradient: 'bg-gradient-to-r from-red-500 to-orange-500',
    excerpt: 'An analysis of the current GPU market, the rise of specialized cloud providers, and how open-source models are changing the compute equation.',
    content: `
      <h2>The Compute Bottleneck</h2>
      <p>The greatest barrier to AI innovation is no longer algorithmic; it is access to compute. Training foundational models requires thousands of GPUs, an investment only a few tech giants can afford. However, the landscape is shifting.</p>

      <h3>The Rise of Alt-Clouds</h3>
      <p>Providers like CoreWeave and Lambda Labs are challenging the dominance of AWS and GCP by offering specialized, low-cost GPU compute instances. This democratization of infrastructure is fueling a surge in AI startups.</p>
      
      <h3>Optimizing Inference</h3>
      <p>While training requires massive clusters, inference (running the model) is becoming more efficient. Techniques like quantization, model pruning, and specialized inference engines (vLLM, TensorRT-LLM) allow powerful models to run on consumer-grade hardware.</p>
      <ul>
        <li><strong>Quantization (INT8, FP8, INT4):</strong> Reducing the memory footprint of models with minimal loss in accuracy.</li>
        <li><strong>PagedAttention:</strong> Optimizing KV cache memory management to serve more concurrent requests.</li>
      </ul>

      <h3>The TEJAS GPU Cluster</h3>
      <p>At TEJAS, we provide our researchers and fellows with access to a state-of-the-art GPU cluster. We believe that unrestricted access to compute is essential for fostering innovation and pushing the boundaries of AI research.</p>
    `
  }
];
