import {
  UserProfile,
  Course,
  Batch,
  Enrollment,
  AttendanceRecord,
  Assignment,
  AssignmentSubmission,
  Assessment,
  StudentProject,
  Certificate,
  StudentApplication,
  AnnouncementItem,
  NotificationItem,
} from '@/types';
import { PROGRAMS } from './programs';

export const DEMO_PROFILES: Record<string, UserProfile> = {
  student: {
    id: 'user-student-01',
    email: 'student@tejas.ac.in',
    full_name: 'Rohan Patnaik',
    role: 'STUDENT',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    phone: '+91 98765 43210',
    headline: 'Fellow in Agentic AI & Generative Systems',
    bio: 'Electrical & CS engineering graduate building multi-agent autonomous engineering pipelines at TEJAS Labs Bhubaneswar.',
    location: 'Bhubaneswar, Odisha, India',
    education: 'B.Tech in Computer Science, Odisha University of Technology and Research (OUTR)',
    skills: ['Python', 'PyTorch', 'LangGraph', 'vLLM', 'FastAPI', 'Docker', 'Next.js'],
    github_url: 'https://github.com/rohan-tejas-fellow',
    linkedin_url: 'https://linkedin.com/in/rohan-patnaik',
    portfolio_url: 'https://rohan-tejas.dev',
    is_public: true,
    created_at: '2026-01-15T10:00:00Z',
    updated_at: '2026-03-28T14:30:00Z',
  },
  trainer: {
    id: 'user-trainer-01',
    email: 'trainer@tejas.ac.in',
    full_name: 'Prof. Priyadarshi Mohapatra',
    role: 'TRAINER',
    avatar_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&auto=format&fit=crop&q=80',
    phone: '+91 98765 11223',
    headline: 'Principal AI & MLOps Architect',
    bio: 'Former Staff MLOps Engineer at leading enterprise labs. Specializes in multi-gpu cluster training, low-latency vLLM inference, and agent architectures.',
    location: 'Bhubaneswar, Odisha, India',
    education: 'M.Tech in Distributed Systems, IIT Kharagpur',
    skills: ['Generative AI', 'Agentic Systems', 'Kubernetes', 'PyTorch', 'vLLM', 'Model Context Protocol'],
    github_url: 'https://github.com/priyadarshi-tejas',
    linkedin_url: 'https://linkedin.com/in/priyadarshi-mohapatra',
    portfolio_url: 'https://tejas.ac.in/faculty/priyadarshi',
    is_public: true,
    created_at: '2025-11-01T10:00:00Z',
    updated_at: '2026-03-25T11:00:00Z',
  },
  mentor: {
    id: 'user-mentor-01',
    email: 'mentor@tejas.ac.in',
    full_name: 'Er. Arpita Senapati',
    role: 'MENTOR',
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
    phone: '+91 98765 99887',
    headline: 'Lead Cloud Infrastructure & Platform Specialist',
    bio: 'Platform Engineer with deep expertise in bare-metal Kubernetes, Terraform, and high-performance computing pipelines.',
    location: 'Bhubaneswar, Odisha, India',
    education: 'B.Tech in Information Technology, VSSUT Burla',
    skills: ['AWS', 'GCP', 'Terraform', 'Kubernetes', 'Golang', 'CI/CD Pipelines'],
    github_url: 'https://github.com/arpita-tejas',
    linkedin_url: 'https://linkedin.com/in/arpita-senapati',
    is_public: true,
    created_at: '2025-12-10T10:00:00Z',
    updated_at: '2026-03-20T09:00:00Z',
  },
  admin: {
    id: 'user-admin-01',
    email: 'admin@tejas.ac.in',
    full_name: 'Dr. Subhashree Dash',
    role: 'SUPER_ADMIN',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    phone: '+91 98765 00000',
    headline: 'Director of Academic Affairs & Systems Architect',
    bio: 'PhD in Computer Systems with 18+ years leading deep-tech research and higher education innovation.',
    location: 'Bhubaneswar, Odisha, India',
    education: 'PhD Computer Science, IISc Bangalore',
    skills: ['Distributed Systems', 'Academic Governance', 'DeepTech Strategy', 'Cloud Infrastructure'],
    github_url: 'https://github.com/sdash-tejas',
    linkedin_url: 'https://linkedin.com/in/dr-subhashree-dash',
    is_public: true,
    created_at: '2025-10-01T10:00:00Z',
    updated_at: '2026-03-29T10:00:00Z',
  },
  counselor: {
    id: 'user-counselor-01',
    email: 'admissions@tejas.ac.in',
    full_name: 'Priyanka Rout',
    role: 'COUNSELLOR',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    phone: '+91 94370 99887',
    headline: 'Head of Admissions & Fellow Selection',
    bio: 'Lead counselor evaluating technical aptitude, career trajectories, and fellowship candidates for TEJAS cohort admissions.',
    location: 'Bhubaneswar, Odisha, India',
    education: 'MBA & B.Tech, XIM University Bhubaneswar',
    skills: ['Admissions Triage', 'Candidate Evaluation', 'Technical Counselling', 'Scholarship Allocation'],
    is_public: true,
    created_at: '2025-10-01T10:00:00Z',
    updated_at: '2026-03-20T10:00:00Z',
  },
  tester: {
    id: 'user-tester-01',
    email: 'qa.lead@tejas.ac.in',
    full_name: 'Subhranshu Jena',
    role: 'TESTER',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    phone: '+91 94371 55667',
    headline: 'Principal QA Architect & Automation Lead',
    bio: 'Quality Engineering Architect leading end-to-end multi-device Playwright suites and in-app verification cycles for TEJAS platform.',
    location: 'Bhubaneswar, Odisha, India',
    education: 'B.Tech Computer Science, KIIT Bhubaneswar',
    skills: ['Playwright', 'Multi-Device Testing', 'API Automation', 'Test Matrix SOP', 'CI/CD Pipelines'],
    is_public: true,
    created_at: '2025-11-01T10:00:00Z',
    updated_at: '2026-03-29T10:00:00Z',
  },
};

export const SAMPLE_COURSES: Course[] = [
  {
    id: 'course-ai-01',
    program_id: 'prog-01',
    title: 'Foundations of Modern Deep Learning & Transformers',
    slug: 'deep-learning-transformers',
    description: 'Master the mathematical foundations of scaled dot-product attention, multi-head projection layers, and transformer block topology.',
    order_idx: 1,
    estimated_hours: 32,
    status: 'PUBLISHED',
    modules: [
      {
        id: 'mod-01',
        course_id: 'course-ai-01',
        title: 'Module 1: Attention Mechanisms & Scaled Dot-Product',
        description: 'Mathematical intuition and hands-on PyTorch implementation of Query, Key, and Value matrix transformations.',
        order_idx: 1,
        lessons: [
          {
            id: 'les-01',
            module_id: 'mod-01',
            title: '1.1 The Intuition Behind Query, Key and Value Vectors',
            slug: 'intuition-q-k-v',
            lesson_type: 'VIDEO',
            order_idx: 1,
            duration_mins: 28,
            is_free_preview: true,
            is_completed: true,
            content_markdown: `
# Query, Key, Value Projections

In this lesson, we break down why self-attention operates as a soft dictionary lookup mechanism.

### Mathematical Formulation
$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$$

### Key Architectural Takeaways
1. **Queries ($Q$)** represent what a token is looking for in context.
2. **Keys ($K$)** represent what information other tokens offer.
3. **Values ($V$)** contain the actual information payload being synthesized.
4. The scaling factor $\\sqrt{d_k}$ prevents dot products from growing excessively large, maintaining healthy gradients during softmax backpropagation.
            `,
            video: {
              id: 'vid-01',
              lesson_id: 'les-01',
              r2_video_key: 'videos/ai-01/les-01/master.mp4',
              video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
              duration_seconds: 1680,
              resolution: '1080p 60fps',
              transcript: 'Welcome fellows to TEJAS Institute of Advanced Technology. In today’s session we will build self-attention from pure tensor mechanics...',
            },
            resources: [
              {
                id: 'res-01',
                lesson_id: 'les-01',
                title: 'Attention_Derivations_Cheatsheet.pdf',
                r2_file_key: 'courses/ai-01/materials/attention_cheatsheet.pdf',
                download_url: '#',
                file_type: 'PDF',
                file_size_bytes: 2450000,
                is_downloadable: true,
              },
              {
                id: 'res-02',
                lesson_id: 'les-01',
                title: 'attention_tensor_lab.ipynb',
                r2_file_key: 'courses/ai-01/materials/attention_tensor_lab.ipynb',
                download_url: '#',
                file_type: 'Jupyter Notebook',
                file_size_bytes: 420000,
                is_downloadable: true,
              },
            ],
          },
          {
            id: 'les-02',
            module_id: 'mod-01',
            title: '1.2 Implementing Multi-Head Attention in PyTorch from Scratch',
            slug: 'implementing-mha-pytorch',
            lesson_type: 'VIDEO',
            order_idx: 2,
            duration_mins: 42,
            is_free_preview: false,
            is_completed: true,
            content_markdown: `
# Multi-Head Attention PyTorch Implementation

Writing clean, batched tensor operations without explicit python loops.

\`\`\`python
import torch
import torch.nn as nn
import math

class MultiHeadAttention(nn.Module):
    def __init__(self, d_model: int, num_heads: int):
        super().__init__()
        assert d_model % num_heads == 0, "d_model must be divisible by num_heads"
        self.d_model = d_model
        self.num_heads = num_heads
        self.head_dim = d_model // num_heads

        self.q_proj = nn.Linear(d_model, d_model)
        self.k_proj = nn.Linear(d_model, d_model)
        self.v_proj = nn.Linear(d_model, d_model)
        self.out_proj = nn.Linear(d_model, d_model)

    def forward(self, q, k, v, mask=None):
        batch_size = q.size(0)
        # Project and reshape: (B, num_heads, seq_len, head_dim)
        Q = self.q_proj(q).view(batch_size, -1, self.num_heads, self.head_dim).transpose(1, 2)
        K = self.k_proj(k).view(batch_size, -1, self.num_heads, self.head_dim).transpose(1, 2)
        V = self.v_proj(v).view(batch_size, -1, self.num_heads, self.head_dim).transpose(1, 2)

        scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(self.head_dim)
        if mask is not None:
            scores = scores.masked_fill(mask == 0, -1e9)
        
        attn_weights = torch.softmax(scores, dim=-1)
        context = torch.matmul(attn_weights, V)
        
        # Concatenate heads and project
        context = context.transpose(1, 2).contiguous().view(batch_size, -1, self.d_model)
        return self.out_proj(context)
\`\`\`
            `,
            video: {
              id: 'vid-02',
              lesson_id: 'les-02',
              r2_video_key: 'videos/ai-01/les-02/master.mp4',
              video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
              duration_seconds: 2520,
              resolution: '1080p 60fps',
              transcript: 'In this lab walkthrough, we implement batched matrix multiplication using torch.matmul...',
            },
          },
          {
            id: 'les-03',
            module_id: 'mod-01',
            title: '1.3 Assessment: Scaled Dot-Product & Gradient Dynamics',
            slug: 'assessment-scaled-dot-product',
            lesson_type: 'QUIZ',
            order_idx: 3,
            duration_mins: 20,
            is_free_preview: false,
            is_completed: false,
          },
        ],
      },
      {
        id: 'mod-02',
        course_id: 'course-ai-01',
        title: 'Module 2: Enterprise RAG & Hybrid Retrieval Pipelines',
        description: 'Combining dense embedding models, BM25 sparse indexers, and cross-encoder rerankers.',
        order_idx: 2,
        lessons: [
          {
            id: 'les-04',
            module_id: 'mod-02',
            title: '2.1 Vector Embeddings & High-Dimensional Distance Metrics',
            slug: 'vector-embeddings-metrics',
            lesson_type: 'VIDEO',
            order_idx: 1,
            duration_mins: 35,
            is_free_preview: false,
            is_completed: false,
            video: {
              id: 'vid-04',
              lesson_id: 'les-04',
              r2_video_key: 'videos/ai-01/les-04/master.mp4',
              video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
              duration_seconds: 2100,
              resolution: '1080p',
            },
          },
          {
            id: 'les-05',
            module_id: 'mod-02',
            title: '2.2 Lab Assignment: Building a Hybrid Search Engine with Reciprocal Rank Fusion',
            slug: 'lab-hybrid-search-rrf',
            lesson_type: 'ASSIGNMENT',
            order_idx: 2,
            duration_mins: 60,
            is_free_preview: false,
            is_completed: false,
          },
        ],
      },
    ],
  },
];

export const SAMPLE_BATCH: Batch = {
  id: 'batch-ai-2026-alpha',
  program_id: 'prog-01',
  program_title: 'AI Engineering & Generative AI',
  name: 'AI Engineering 2026 Batch Alpha',
  code: 'TEJAS-AI-2026-A',
  start_date: '2026-02-01',
  end_date: '2026-07-31',
  trainer_id: 'user-trainer-01',
  trainer_name: 'Prof. Priyadarshi Mohapatra',
  mentor_id: 'user-mentor-01',
  mentor_name: 'Er. Arpita Senapati',
  max_capacity: 25,
  enrolled_count: 21,
  status: 'IN_PROGRESS',
};

export const SAMPLE_ENROLLMENTS: Enrollment[] = [
  {
    id: 'enroll-01',
    student_id: 'user-student-01',
    program_id: 'prog-01',
    program: PROGRAMS[0],
    batch_id: 'batch-ai-2026-alpha',
    batch: SAMPLE_BATCH,
    status: 'ACTIVE',
    progress_percentage: 82.5,
    enrolled_at: '2026-02-01T00:00:00Z',
  },
];

export const SAMPLE_ATTENDANCE: AttendanceRecord[] = [
  { id: 'att-1', batch_id: 'batch-ai-2026-alpha', student_id: 'user-student-01', session_date: '2026-03-22', session_topic: 'Multi-Head Attention Lab & Tensor Debugging', status: 'PRESENT' },
  { id: 'att-2', batch_id: 'batch-ai-2026-alpha', student_id: 'user-student-01', session_date: '2026-03-24', session_topic: 'FlashAttention & Kernel Optimization', status: 'PRESENT' },
  { id: 'att-3', batch_id: 'batch-ai-2026-alpha', student_id: 'user-student-01', session_date: '2026-03-26', session_topic: 'Vector DB Indexing & HNSW Benchmarking', status: 'PRESENT' },
  { id: 'att-4', batch_id: 'batch-ai-2026-alpha', student_id: 'user-student-01', session_date: '2026-03-28', session_topic: 'Cross-Encoder Re-Ranking & RAG Evaluation', status: 'LATE', remarks: 'Arrived 10 mins late due to lab setup' },
  { id: 'att-5', batch_id: 'batch-ai-2026-alpha', student_id: 'user-student-01', session_date: '2026-03-30', session_topic: 'vLLM PagedAttention High-Throughput Serving', status: 'PRESENT' },
];

export const SAMPLE_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-01',
    module_id: 'mod-01',
    module_title: 'Attention Mechanisms & Scaled Dot-Product',
    title: 'Custom PyTorch Scaled Dot-Product Attention with Causal Masking',
    instructions: 'Implement a vectorized MultiHeadAttention layer in PyTorch without using torch.nn.MultiheadAttention. Verify numerical correctness against standard reference with torch.allclose. Provide an interactive Jupyter notebook and GitHub repository.',
    max_score: 100,
    due_date: '2026-04-05T23:59:59Z',
  },
  {
    id: 'asg-02',
    module_id: 'mod-02',
    module_title: 'Enterprise RAG & Hybrid Retrieval Pipelines',
    title: 'Reciprocal Rank Fusion Hybrid Search with BM25 & Qdrant',
    instructions: 'Construct a FastAPI service that indexes 10,000 deep-tech research papers. Ingest embeddings into Qdrant, compute BM25 scores, and apply reciprocal rank fusion with parameter k=60. Measure NDCG@10 on the test benchmark.',
    max_score: 100,
    due_date: '2026-04-15T23:59:59Z',
  },
];

export const SAMPLE_SUBMISSIONS: AssignmentSubmission[] = [
  {
    id: 'sub-01',
    assignment_id: 'asg-01',
    assignment_title: 'Custom PyTorch Scaled Dot-Product Attention with Causal Masking',
    student_id: 'user-student-01',
    student_name: 'Rohan Patnaik',
    student_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    submission_text: 'Implemented full causal masking and compared gradient flow with PyTorch 2.0 SDPA. Achieved 99.999% numerical match and benchmarked forward-backward latency on TEJAS GPU cluster.',
    github_repo_url: 'https://github.com/rohan-tejas-fellow/pytorch-mha-from-scratch',
    live_demo_url: 'https://mha-benchmark.tejas-labs.internal',
    status: 'APPROVED',
    score: 96,
    feedback: 'Excellent work Rohan! Clean tensor transposition and clean documentation. For the next iteration, consider benchmarking against flash-attn kernels.',
    reviewed_by: 'user-mentor-01',
    reviewer_name: 'Er. Arpita Senapati',
    reviewed_at: '2026-03-27T16:00:00Z',
    submitted_at: '2026-03-25T20:15:00Z',
  },
];

export const SAMPLE_PROJECTS: StudentProject[] = [
  {
    id: 'proj-01',
    program_id: 'prog-01',
    program_title: 'AI Engineering & Generative AI',
    student_id: 'user-student-01',
    student_name: 'Rohan Patnaik',
    mentor_id: 'user-mentor-01',
    mentor_name: 'Er. Arpita Senapati',
    title: 'NeuroQuery: Real-time Multi-Modal Health Document RAG with Hybrid Sparse/Dense Search',
    tagline: 'Sub-150ms semantic search across clinical records with FHIR compatibility',
    description: 'Designed an enterprise retrieval-augmented generation engine that ingests complex clinical trial PDFs, extracts tables and charts via vision models, and yields citations grounded in verified medical literature.',
    objectives: [
      'Ingest 50,000 clinical research papers with layout-aware chunking',
      'Deploy hybrid BM25 + BGE-large dense vector retrieval with cross-encoder re-ranking',
      'Serve quantized Llama-3-70B on TEJAS GPU cluster with vLLM',
      'Benchmark latency under concurrent user load to achieve sub-150ms TTFT'
    ],
    tech_stack: ['PyTorch', 'vLLM', 'FastAPI', 'Qdrant', 'Next.js', 'Docker', 'BGE Embeddings'],
    github_url: 'https://github.com/rohan-tejas-fellow/neuroquery-rag',
    deployment_url: 'https://neuroquery.tejas.ac.in',
    status: 'BUILDING',
    mentor_feedback: 'Solid architecture! Ensure you incorporate automated faithfulness checks via Ragas before the demonstration phase.',
    score: 92,
    is_featured: true,
    created_at: '2026-02-15T09:00:00Z',
  },
  {
    id: 'proj-02',
    program_id: 'prog-02',
    program_title: 'Agentic AI & AI Automation Engineering',
    student_id: 'user-student-02',
    student_name: 'Ananya Roy',
    title: 'SRE-Copilot: Autonomous Incident Triage Agent for Kubernetes Cluster Failures',
    tagline: 'Multi-agent diagnostic loop utilizing Model Context Protocol (MCP) to resolve alert storms',
    description: 'An autonomous multi-agent system that responds to Prometheus alerts, inspects pod logs, performs root-cause correlation, and drafts verified remediation PRs.',
    objectives: [
      'Implement supervisor-worker state graph in LangGraph',
      'Build secure read-only Kubernetes MCP tools for telemetry extraction',
      'Integrate human-in-the-loop approval gates for automated rollbacks'
    ],
    tech_stack: ['LangGraph', 'Model Context Protocol', 'Kubernetes API', 'Temporal', 'Python'],
    github_url: 'https://github.com/tejas-institute/sre-copilot-agent',
    deployment_url: 'https://sre-agent.tejas.ac.in',
    status: 'DEMONSTRATED',
    mentor_feedback: 'Demonstrated exceptional autonomy and safe boundary enforcement. Awarded Top Innovation at TEJAS Demo Day.',
    score: 98,
    is_featured: true,
    created_at: '2026-01-20T11:00:00Z',
  },
  {
    id: 'proj-03',
    program_id: 'prog-11',
    program_title: 'VLSI RTL & Functional Verification',
    student_id: 'user-student-03',
    student_name: 'Vikram Samanta',
    title: 'RISC-V 5-Stage Pipelined Processor Core with Complete UVM Testbench',
    tagline: 'Synthesizable SystemVerilog RV32I core with 100% functional coverage closure',
    description: 'Designed a 5-stage synthesizable RISC-V RV32I core with hazard detection, branch prediction, forwarding paths, and a comprehensive Universal Verification Methodology (UVM) testbench suite.',
    objectives: [
      'Write RTL for fetch, decode, execute, memory, and writeback stages in SystemVerilog',
      'Implement UVM verification environment (Scoreboard, Coverage Collector, Sequencers)',
      'Achieve 100% branch and statement coverage on instruction set compliance test suite'
    ],
    tech_stack: ['SystemVerilog', 'UVM', 'ModelSim', 'Xilinx Vivado', 'GTKWave'],
    github_url: 'https://github.com/tejas-institute/riscv-rv32i-uvm',
    status: 'COMPLETED',
    score: 95,
    is_featured: true,
    created_at: '2026-01-10T10:00:00Z',
  },
];

export const SAMPLE_CERTIFICATE: Certificate = {
  id: 'cert-8921',
  certificate_id: 'TEJAS-2026-AI-8921',
  student_id: 'user-student-01',
  student_name: 'Rohan Patnaik',
  program_id: 'prog-01',
  program_title: 'Fellowship in AI Engineering & Generative AI',
  issued_at: '2026-03-15T00:00:00Z',
  grade: 'Distinction (Grade A+)',
  verification_hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  verification_url: 'https://tejas.ac.in/verify/TEJAS-2026-AI-8921',
  skills_covered: [
    'Transformer Attention Architectures',
    'Enterprise RAG & Hybrid Retrieval',
    'LoRA / QLoRA Foundational Model Fine-Tuning',
    'vLLM Low-Latency Serving & Inference Optimization',
    'Production Guardrails & Agentic Workflows'
  ],
  authorized_signatory: 'Dr. Subhashree Dash',
  signatory_title: 'Director of Academic Affairs & Systems Architect, TEJAS',
};

export const SAMPLE_ASSESSMENT: Assessment = {
  id: 'asm-ai-01',
  module_id: 'mod-01',
  program_id: 'prog-01',
  title: 'Attention Mechanism & Tensor Dynamics Benchmark',
  description: 'Test your understanding of self-attention mechanics, tensor dimension transformations, scaling factors, and multi-head parallelization.',
  time_limit_mins: 15,
  pass_percentage: 75,
  max_attempts: 3,
  questions: [
    {
      id: 'q1',
      assessment_id: 'asm-ai-01',
      question_text: 'Why is the dot-product of Query and Key divided by $\\sqrt{d_k}$ in scaled dot-product attention?',
      question_type: 'MCQ',
      options: [
        { id: 'opt_a', text: 'To ensure the output tensor matches the dimension of the Value vector.' },
        { id: 'opt_b', text: 'To prevent large dot product values from pushing the softmax function into regions with vanishingly small gradients.' },
        { id: 'opt_c', text: 'To convert the attention score matrix into a positive semi-definite matrix.' },
        { id: 'opt_d', text: 'To reduce the GPU memory footprint during backpropagation.' }
      ],
      correct_answer: 'opt_b',
      explanation: 'For large values of d_k, the dot products grow large in magnitude, pushing the softmax function into regions where gradients are extremely small. Dividing by sqrt(d_k) stabilizes the variance of the dot products to 1.',
      points: 2,
      order_idx: 1,
    },
    {
      id: 'q2',
      assessment_id: 'asm-ai-01',
      question_text: 'In causal decoder-only models (such as GPT-4 or Llama-3), how is future token leakage prevented during training?',
      question_type: 'MCQ',
      options: [
        { id: 'opt_a', text: 'By removing subsequent token rows from the embedding matrix.' },
        { id: 'opt_b', text: 'By applying an upper-triangular mask of negative infinity (-inf) to the attention logits prior to softmax.' },
        { id: 'opt_c', text: 'By running sequential recurrent loops across token sequences.' },
        { id: 'opt_d', text: 'By dropping future tokens using stochastic dropout layers.' }
      ],
      correct_answer: 'opt_b',
      explanation: 'Setting upper-triangular positions to -inf ensures that after softmax, those attention weights become exactly 0, preventing earlier tokens from attending to subsequent tokens.',
      points: 2,
      order_idx: 2,
    },
    {
      id: 'q3',
      assessment_id: 'asm-ai-01',
      question_text: 'Which memory optimization technique stores Key and Value caches in non-contiguous physical memory pages to eliminate GPU VRAM fragmentation?',
      question_type: 'MCQ',
      options: [
        { id: 'opt_a', text: 'FlashAttention-2' },
        { id: 'opt_b', text: 'PagedAttention (vLLM)' },
        { id: 'opt_c', text: 'DeepSpeed ZeRO-3' },
        { id: 'opt_d', text: 'Tensor Parallelism' }
      ],
      correct_answer: 'opt_b',
      explanation: 'PagedAttention, developed for vLLM, applies virtual memory paging principles to the KV cache, preventing memory fragmentation and enabling up to 4x higher throughput.',
      points: 2,
      order_idx: 3,
    },
    {
      id: 'q4',
      assessment_id: 'asm-ai-01',
      question_text: 'What is the theoretical computational complexity of standard self-attention with respect to sequence length N?',
      question_type: 'MCQ',
      options: [
        { id: 'opt_a', text: 'O(N)' },
        { id: 'opt_b', text: 'O(N log N)' },
        { id: 'opt_c', text: 'O(N^2)' },
        { id: 'opt_d', text: 'O(2^N)' }
      ],
      correct_answer: 'opt_c',
      explanation: 'Computing the QK^T matrix requires multiplying an (N x d) matrix by a (d x N) matrix, which results in an (N x N) attention matrix, yielding quadratic O(N^2) complexity.',
      points: 2,
      order_idx: 4,
    },
  ],
};

export const SAMPLE_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: 'ann-1',
    batch_id: 'batch-ai-2026-alpha',
    program_id: 'prog-01',
    title: 'TEJAS Demo Day: Final Stage Demonstration Schedule Announced',
    content: 'Fellows of Batch Alpha will present their production prototypes to our industry hiring partners and venture directors on Saturday, 18th April 2026 at the Main Auditorium, Bhubaneswar Campus. Ensure all GitHub repos and live endpoints are verified.',
    author_name: 'Dr. Subhashree Dash (Director)',
    is_pinned: true,
    created_at: '2026-03-28T09:00:00Z',
  },
  {
    id: 'ann-2',
    batch_id: 'batch-ai-2026-alpha',
    program_id: 'prog-01',
    title: 'GPU Cluster Maintenance & Driver Upgrade Notice',
    content: 'The Bhubaneswar H100 cluster will undergo planned CUDA 12.6 driver upgrades on Sunday between 02:00 AM - 05:00 AM IST. All batch jobs running via Slurm will be paused and resumed automatically.',
    author_name: 'Er. Arpita Senapati (Platform Lead)',
    is_pinned: false,
    created_at: '2026-03-25T14:30:00Z',
  },
];

export const SAMPLE_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    user_id: 'user-student-01',
    title: 'Assignment Graded: 96/100',
    message: 'Er. Arpita Senapati reviewed your PyTorch Attention implementation with distinction remarks.',
    link_url: '/dashboard/student',
    is_read: false,
    created_at: '2026-03-27T16:05:00Z',
  },
  {
    id: 'notif-2',
    user_id: 'user-student-01',
    title: 'Upcoming Assessment Reminder',
    message: 'Assessment on Attention Mechanisms & Tensor Dynamics is available now.',
    link_url: '/dashboard/student/courses/course-ai-01/learn/les-03',
    is_read: false,
    created_at: '2026-03-28T10:00:00Z',
  },
  {
    id: 'notif-3',
    user_id: 'user-student-01',
    title: 'Certificate Issued',
    message: 'Your verifiable completion credential for AI Foundations has been minted.',
    link_url: '/verify/TEJAS-2026-AI-8921',
    is_read: true,
    created_at: '2026-03-15T12:00:00Z',
  },
];

export const SAMPLE_APPLICATIONS: StudentApplication[] = [
  {
    id: 'app-01',
    full_name: 'Ananya Dash',
    email: 'ananya.dash.tech@gmail.com',
    phone: '+91 94370 12345',
    education: 'B.Tech Computer Science, NIT Rourkela (2025)',
    experience: '6 months internship as Backend Cloud Engineer',
    program_id: 'prog-fde',
    program_title: 'Forward Deployment Engineer (FDE) Fellowship',
    current_skills: 'Python, Docker, FastAPI, PostgreSQL, Kubernetes',
    career_goal: 'Work as Forward Deployment Engineer deploying mission-critical systems.',
    preferred_mode: 'IN_PERSON_BHUBANESWAR',
    city: 'Bhubaneswar',
    status: 'SHORTLISTED',
    admin_notes: 'Exceptional systems intuition. Clean GitHub repositories. Scheduled for Chief Architect FDE interview.',
    created_at: '2026-03-28T09:30:00Z',
    ai_score: 95,
    ai_summary: 'Top 2% candidate for FDE Fellowship. Strong distributed systems fundamentals from NIT Rourkela.',
    ai_recommendation: 'Fast-track to Director round. Offer 25% Founder Fellowship.',
    sentiment: 'HIGH_INTENT',
    source: 'WEBSITE',
    counselor_name: 'Priyanka Rout',
    deal_value_inr: 120000,
    github_profile: 'https://github.com/ananya-dash',
  },
  {
    id: 'app-02',
    full_name: 'Debashish Panda',
    email: 'debashish.p@gmail.com',
    phone: '+91 94370 88765',
    education: 'B.Tech Electrical & Electronics, KIIT Bhubaneswar (2025)',
    experience: '1 year as Junior Firmware Engineer',
    program_id: 'prog-13',
    program_title: 'EV Battery, BMS, Power Electronics & Charging',
    current_skills: 'Embedded C, MATLAB, CAN Protocol, STM32',
    career_goal: 'Join top tier EV powertrain engineering teams and design cell supervisory circuits.',
    preferred_mode: 'HYBRID_BHUBANESWAR',
    city: 'Bhubaneswar',
    status: 'SHORTLISTED',
    admin_notes: 'Strong fundamentals in circuit analysis. Recommended for Batch Beta interview.',
    created_at: '2026-03-20T11:20:00Z',
    ai_score: 89,
    ai_summary: 'Hardware-verified embedded firmware background. Direct match for EV Battery & BMS Lab.',
    ai_recommendation: 'Recommend lab demonstration on Bhubaneswar battery test bench.',
    sentiment: 'HIGH_INTENT',
    source: 'CAMPUS_OUTREACH',
    counselor_name: 'Amitabh Sen',
    deal_value_inr: 85000,
  },
  {
    id: 'app-03',
    full_name: 'Pooja Agarwal',
    email: 'pooja.agarwal.tech@gmail.com',
    phone: '+91 98610 56789',
    education: 'M.Sc Statistics, Ravenshaw University Cuttack',
    experience: '2 years as Data Analyst at financial analytics firm',
    program_id: 'prog-01',
    program_title: 'AI Engineering & Generative AI',
    current_skills: 'Python, Pandas, SQL, Linear Algebra, PyTorch',
    career_goal: 'Transition into enterprise Generative AI and RAG architecture.',
    preferred_mode: 'IN_PERSON_BHUBANESWAR',
    city: 'Cuttack',
    status: 'COUNSELLING',
    admin_notes: 'Academic background very suitable for deep learning math track. Discussing EMI fee options.',
    created_at: '2026-03-25T15:40:00Z',
    ai_score: 84,
    ai_summary: 'Strong mathematical foundation in statistics and linear algebra. Ideal for Transformer mechanics.',
    ai_recommendation: 'Provide 3-month zero-interest EMI financing roadmap.',
    sentiment: 'PRICE_SENSITIVE',
    source: 'LINKEDIN',
    counselor_name: 'Priyanka Rout',
    deal_value_inr: 95000,
  },
  {
    id: 'app-04',
    full_name: 'Siddharth Mishra',
    email: 'sid.mishra.dev@outlook.com',
    phone: '+91 70081 23456',
    education: 'B.Tech Computer Science, ITER SOA University',
    experience: 'Final Year Student',
    program_id: 'prog-02',
    program_title: 'Agentic AI & AI Automation Engineering',
    current_skills: 'FastAPI, LangChain, Next.js, Docker',
    career_goal: 'Build autonomous cognitive agents for enterprise automation.',
    preferred_mode: 'IN_PERSON_BHUBANESWAR',
    city: 'Bhubaneswar',
    status: 'ENROLLED',
    admin_notes: 'Admission confirmed. Enrolled in Batch Alpha.',
    created_at: '2026-03-18T10:15:00Z',
    ai_score: 91,
    ai_summary: 'High motivation with proven hackathon shipping velocity. Enrolled in Batch Alpha.',
    ai_recommendation: 'Assigned to Agentic Architecture Sprint 1.',
    sentiment: 'HIGH_INTENT',
    source: 'REFERRAL',
    counselor_name: 'Amitabh Sen',
    deal_value_inr: 95000,
  },
  {
    id: 'app-05',
    full_name: 'Soumya Ranjan Nayak',
    email: 'soumya.nayak.vlsi@gmail.com',
    phone: '+91 97760 33445',
    education: 'B.Tech Electronics & Telecommunication, VSSUT Burla (2024)',
    experience: 'Fresher / GATE Qualified',
    program_id: 'prog-09',
    program_title: 'VLSI RTL Design & Verification',
    current_skills: 'Verilog, Digital Logic, SystemVerilog, FPGA Basys3',
    career_goal: 'Silicon verification engineer at semiconductor MNC (Qualcomm/Intel/AMD).',
    preferred_mode: 'IN_PERSON_BHUBANESWAR',
    city: 'Sambalpur',
    status: 'CONTACTED',
    admin_notes: 'Initial phone screening done. Impressed by Xilinx FPGA synthesis lab facilities.',
    created_at: '2026-03-29T14:10:00Z',
    ai_score: 87,
    ai_summary: 'Solid RTL digital logic basics. High match for Bhubaneswar Semiconductor Lab.',
    ai_recommendation: 'Invite for offline physical lab tour at Infocity campus.',
    sentiment: 'WARM',
    source: 'CAMPUS_OUTREACH',
    counselor_name: 'Priyanka Rout',
    deal_value_inr: 85000,
  },
  {
    id: 'app-06',
    full_name: 'Rakesh Behera',
    email: 'rakesh.behera.infra@gmail.com',
    phone: '+91 90900 11223',
    education: 'B.Tech IT, OUTR (CET) Bhubaneswar (2025)',
    experience: 'Cloud enthusiast with personal homelab',
    program_id: 'prog-05',
    program_title: 'Kubernetes & Cloud Infrastructure Engineering',
    current_skills: 'Linux, Bash, Docker, Terraform, AWS',
    career_goal: 'Platform & SRE engineer building high-resilience Kubernetes clusters.',
    preferred_mode: 'IN_PERSON_BHUBANESWAR',
    city: 'Bhubaneswar',
    status: 'NEW',
    admin_notes: 'Application received via website catalog. Awaiting initial counselor callback.',
    created_at: '2026-04-01T16:20:00Z',
    ai_score: 79,
    ai_summary: 'Self-driven sysadmin fundamentals. Good platform engineering track match.',
    ai_recommendation: 'Conduct triage call within 24 hours.',
    sentiment: 'WARM',
    source: 'WEBSITE',
    counselor_name: 'Amitabh Sen',
    deal_value_inr: 90000,
  },
];
