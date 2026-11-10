import {
  LiveClassSession,
  LiveChatMessage,
  LiveDoubt,
  LivePoll,
} from '@/types/live-class';

export const SAMPLE_LIVE_SESSIONS: LiveClassSession[] = [
  {
    id: 'live-vllm-01',
    title: 'High-Throughput vLLM & PagedAttention Distributed Serving Lab',
    batch_code: 'TEJAS-AI-2026-A',
    batch_id: 'batch-ai-2026-alpha',
    program_id: 'prog-01',
    program_title: 'AI Engineering & Generative AI',
    instructor_name: 'Prof. Priyadarshi Mohapatra',
    instructor_role: 'Chief AI Architect & Fellow Lead',
    instructor_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    ta_names: ['Er. Arpita Senapati (Platform)', 'Soumya Ranjan (Systems TA)'],
    status: 'LIVE',
    scheduled_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // started 45m ago
    duration_mins: 180,
    stream_video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    active_viewers: 148,
    github_repo_url: 'https://github.com/tejas-institute/vllm-paged-attention-bench',
    slides_url: 'https://slides.tejas.ac.in/vllm-architecture-v2',
    notebook_url: 'https://github.com/tejas-institute/vllm-paged-attention-bench/blob/main/01_paged_attention_benchmark.ipynb',
    handout_name: 'vLLM_PagedAttention_Memory_Profiling_RFC89.pdf',
    topic_tags: ['vLLM', 'PagedAttention', 'KV Cache', 'NVIDIA H100', 'Distributed Serving'],
    description: 'Deep dive into virtual memory management for LLM inference. In this live masterclass, fellows will derive PagedAttention mathematical bounds, configure continuous batching in vLLM, and deploy an inference benchmark cluster on the Chandaka GPU datacenter.',
    initial_code: {
      filename: 'paged_kv_cache.py',
      language: 'python',
      code: `import torch
import torch.nn as nn
from typing import List, Tuple

class PhysicalBlockTable:
    """Simulates vLLM PagedAttention physical block allocator."""
    def __init__(self, num_blocks: int, block_size: int, num_heads: int, head_dim: int):
        self.block_size = block_size
        self.num_heads = num_heads
        self.head_dim = head_dim
        # Allocate non-contiguous physical KV block pool on GPU VRAM
        self.k_cache = torch.zeros((num_blocks, block_size, num_heads, head_dim), dtype=torch.float16, device="cpu")
        self.v_cache = torch.zeros((num_blocks, block_size, num_heads, head_dim), dtype=torch.float16, device="cpu")
        self.free_blocks = list(range(num_blocks))

    def allocate(self, num_needed: int) -> List[int]:
        assert len(self.free_blocks) >= num_needed, "Out of physical block memory!"
        allocated = [self.free_blocks.pop(0) for _ in range(num_needed)]
        return allocated

# Instantiate allocator (Simulating 8x H100 GPU buffer)
allocator = PhysicalBlockTable(num_blocks=1024, block_size=16, num_heads=32, head_dim=128)
blocks = allocator.allocate(4)
print(f"✓ Allocated physical block IDs: {blocks}")
print(f"✓ Total KV Cache footprint allocated: {4 * 16 * 32 * 128 * 2 / (1024*1024):.2f} MB")
`,
    },
  },
  {
    id: 'live-fde-02',
    title: 'Forward Deployment Architecture: Enterprise Zero-Downtime Data Plane Migrations',
    batch_code: 'TEJAS-FDE-2026-A',
    batch_id: 'batch-fde-2026-alpha',
    program_id: 'prog-18',
    program_title: 'Forward Deployment Engineer Fellowship',
    instructor_name: 'Debasis Sahoo',
    instructor_role: 'Principal Forward Deployment Architect',
    instructor_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    ta_names: ['Priyanka Rout (Solutions Eng)', 'Amitabh Sen (Integration Lead)'],
    status: 'UPCOMING',
    scheduled_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // tomorrow
    duration_mins: 150,
    stream_video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    active_viewers: 94,
    github_repo_url: 'https://github.com/tejas-institute/enterprise-data-pipeline-cutover',
    topic_tags: ['FDE', 'Direct Connect', 'Kafka', 'Zero Downtime', 'Schema Registry'],
    description: 'Learn the exact client-site forward deployment protocol: deploying streaming connectors over AWS Direct Connect, dual-writing live transactional databases, and running automated reconciliation audits before enterprise cutover.',
  },
  {
    id: 'live-vlsi-03',
    title: 'UVM Scoreboard Architecture & Functional Coverage Closure in SystemVerilog',
    batch_code: 'TEJAS-VLSI-2026-A',
    batch_id: 'batch-vlsi-2026-alpha',
    program_id: 'prog-11',
    program_title: 'VLSI RTL & Functional Verification',
    instructor_name: 'Dr. Rajesh Mohanty',
    instructor_role: 'Lead Silicon Verification Fellow',
    instructor_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    ta_names: ['Vikram Samanta (FPGA TA)'],
    status: 'COMPLETED',
    scheduled_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    duration_mins: 165,
    stream_video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    active_viewers: 112,
    github_repo_url: 'https://github.com/tejas-institute/uvm-scoreboard-coverage',
    topic_tags: ['SystemVerilog', 'UVM', 'Coverage 100%', 'Xilinx Vivado', 'Assertions'],
    description: 'Masterclass recording covering advanced transaction-level modeling (TLM) FIFO connections, custom predictor classes, and closing 100% cross-coverage bins on a pipelined RISC-V processor.',
  },
];

export const INITIAL_CHAT_MESSAGES: LiveChatMessage[] = [
  {
    id: 'chat-01',
    session_id: 'live-vllm-01',
    sender_name: 'Prof. Priyadarshi Mohapatra',
    sender_role: 'INSTRUCTOR',
    message: 'Welcome everyone! Today we are configuring PagedAttention directly on the Bhubaneswar DGX cluster. Clone the repo and mount your sandbox.',
    timestamp: '10:01 AM',
    is_pinned: true,
  },
  {
    id: 'chat-02',
    session_id: 'live-vllm-01',
    sender_name: 'Er. Arpita Senapati (TA)',
    sender_role: 'TA',
    message: 'TAs are active in the Doubt Queue! If you hit CUDA OOM on block allocation, post your traceback in the Doubts tab.',
    timestamp: '10:04 AM',
  },
  {
    id: 'chat-03',
    session_id: 'live-vllm-01',
    sender_name: 'Rohan Patnaik',
    sender_role: 'STUDENT',
    message: 'Audio and stream look crystal clear in 1080p. Cluster terminal is linked!',
    timestamp: '10:06 AM',
  },
  {
    id: 'chat-04',
    session_id: 'live-vllm-01',
    sender_name: 'Ananya Roy',
    sender_role: 'STUDENT',
    message: 'Checking the block table allocation formula — the physical indexing completely removes external fragmentation 🔥',
    timestamp: '10:14 AM',
  },
  {
    id: 'chat-05',
    session_id: 'live-vllm-01',
    sender_name: 'Debashish Panda',
    sender_role: 'STUDENT',
    message: 'Prof, could you clarify how cross-attention behaves when sharing the KV cache across parallel decoders?',
    timestamp: '10:22 AM',
  },
];

export const INITIAL_DOUBTS: LiveDoubt[] = [
  {
    id: 'dbt-01',
    session_id: 'live-vllm-01',
    student_id: 'user-student-01',
    student_name: 'Rohan Patnaik',
    doubt_text: 'When we set block_size = 16 vs block_size = 32, what is the exact trade-off between memory waste from internal fragmentation and kernel launch overhead?',
    timestamp_str: '22:15 in session',
    upvotes: 38,
    upvoted_by_user: true,
    status: 'ANSWERING_LIVE',
    answer: 'Prof. Priyadarshi is currently demonstrating this live with the memory profiler on screen!',
    answered_by: 'Prof. Priyadarshi Mohapatra',
    answered_at: '10:35 AM',
  },
  {
    id: 'dbt-02',
    session_id: 'live-vllm-01',
    student_id: 'user-student-02',
    student_name: 'Ananya Roy',
    doubt_text: 'In prefix caching across multiple requests with identical system prompts, does vLLM lock the shared physical blocks from being overwritten?',
    timestamp_str: '31:40 in session',
    upvotes: 24,
    upvoted_by_user: false,
    status: 'RESOLVED',
    answer: 'Yes! vLLM increments a reference counter on shared physical blocks. Only when ref_count == 0 does the block return to the free list.',
    answered_by: 'Er. Arpita Senapati (TA)',
    answered_at: '10:41 AM',
  },
  {
    id: 'dbt-03',
    session_id: 'live-vllm-01',
    student_id: 'user-student-03',
    student_name: 'Vikram Samanta',
    doubt_text: 'How does FlashAttention-2 integrate with PagedAttention? Are the GPU shared memory tiles loaded directly from the non-contiguous physical blocks?',
    timestamp_str: '39:05 in session',
    upvotes: 19,
    upvoted_by_user: false,
    status: 'OPEN',
  },
];

export const INITIAL_LIVE_POLL: LivePoll = {
  id: 'poll-01',
  session_id: 'live-vllm-01',
  question: 'What is the primary cause of GPU VRAM memory waste in traditional contiguous KV-cache allocation without paging?',
  options: [
    { id: 'opt-a', text: 'Internal fragmentation from token padding and reserved future slots', votes: 86 },
    { id: 'opt-b', text: 'Floating point numerical roundoff during gradient backprop', votes: 12 },
    { id: 'opt-c', text: 'PCIe bus saturation during CPU-to-GPU tensor copying', votes: 18 },
    { id: 'opt-d', text: 'FlashAttention tile synchronization latency', votes: 9 },
  ],
  correct_option_id: 'opt-a',
  is_active: true,
  duration_seconds: 45,
  seconds_remaining: 28,
  total_votes: 125,
  explanation: 'Traditional contiguous allocation pre-reserves memory for the maximum possible context length (e.g. 8192 tokens) per request, resulting in up to 60-80% wasted memory due to internal fragmentation and pre-allocation.',
};

/**
 * Universal In-Memory & LocalStorage Live Class Service
 */
export class LiveClassService {
  private static STORAGE_PREFIX = 'tejas_live_';

  static getSessions(): LiveClassSession[] {
    return SAMPLE_LIVE_SESSIONS;
  }

  static getSessionById(id: string): LiveClassSession | undefined {
    return SAMPLE_LIVE_SESSIONS.find((s) => s.id === id) || SAMPLE_LIVE_SESSIONS[0];
  }

  static getChatMessages(sessionId: string): LiveChatMessage[] {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(`${this.STORAGE_PREFIX}chat_${sessionId}`);
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_CHAT_MESSAGES.filter((m) => m.session_id === sessionId);
  }

  static addChatMessage(sessionId: string, msg: Omit<LiveChatMessage, 'id' | 'timestamp'>): LiveChatMessage {
    const messages = this.getChatMessages(sessionId);
    const newMsg: LiveChatMessage = {
      ...msg,
      id: `chat-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    const updated = [...messages, newMsg];
    if (typeof window !== 'undefined') {
      localStorage.setItem(`${this.STORAGE_PREFIX}chat_${sessionId}`, JSON.stringify(updated));
    }
    return newMsg;
  }

  static getDoubts(sessionId: string): LiveDoubt[] {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(`${this.STORAGE_PREFIX}doubts_${sessionId}`);
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_DOUBTS.filter((d) => d.session_id === sessionId);
  }

  static addDoubt(sessionId: string, doubtText: string, studentName: string): LiveDoubt {
    const doubts = this.getDoubts(sessionId);
    const newDoubt: LiveDoubt = {
      id: `dbt-${Date.now()}`,
      session_id: sessionId,
      student_id: 'user-student-01',
      student_name: studentName,
      doubt_text: doubtText,
      timestamp_str: 'Just now',
      upvotes: 1,
      upvoted_by_user: true,
      status: 'OPEN',
    };
    const updated = [newDoubt, ...doubts];
    if (typeof window !== 'undefined') {
      localStorage.setItem(`${this.STORAGE_PREFIX}doubts_${sessionId}`, JSON.stringify(updated));
    }
    return newDoubt;
  }

  static toggleUpvoteDoubt(sessionId: string, doubtId: string): LiveDoubt[] {
    const doubts = this.getDoubts(sessionId);
    const updated = doubts.map((d) => {
      if (d.id === doubtId) {
        const isUpvoted = d.upvoted_by_user;
        return {
          ...d,
          upvotes: isUpvoted ? d.upvotes - 1 : d.upvotes + 1,
          upvoted_by_user: !isUpvoted,
        };
      }
      return d;
    });
    if (typeof window !== 'undefined') {
      localStorage.setItem(`${this.STORAGE_PREFIX}doubts_${sessionId}`, JSON.stringify(updated));
    }
    return updated;
  }

  static updateDoubtStatus(sessionId: string, doubtId: string, status: LiveDoubt['status'], answer?: string, answeredBy?: string): LiveDoubt[] {
    const doubts = this.getDoubts(sessionId);
    const updated = doubts.map((d) => {
      if (d.id === doubtId) {
        return {
          ...d,
          status,
          ...(answer ? { answer } : {}),
          ...(answeredBy ? { answered_by: answeredBy } : {}),
          answered_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
      }
      return d;
    });
    if (typeof window !== 'undefined') {
      localStorage.setItem(`${this.STORAGE_PREFIX}doubts_${sessionId}`, JSON.stringify(updated));
    }
    return updated;
  }

  static getActivePoll(sessionId: string): LivePoll | null {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(`${this.STORAGE_PREFIX}poll_${sessionId}`);
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return sessionId === INITIAL_LIVE_POLL.session_id ? INITIAL_LIVE_POLL : null;
  }

  static voteInPoll(sessionId: string, optionId: string): LivePoll | null {
    const poll = this.getActivePoll(sessionId);
    if (!poll) return null;

    const updatedOptions = poll.options.map((opt) => {
      if (opt.id === optionId) {
        return { ...opt, votes: opt.votes + 1 };
      }
      return opt;
    });

    const updatedPoll: LivePoll = {
      ...poll,
      options: updatedOptions,
      total_votes: poll.total_votes + 1,
      user_voted_option_id: optionId,
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem(`${this.STORAGE_PREFIX}poll_${sessionId}`, JSON.stringify(updatedPoll));
    }
    return updatedPoll;
  }

  static verifyAndLogAttendance(sessionId: string, studentId: string): boolean {
    if (typeof window !== 'undefined') {
      const key = `${this.STORAGE_PREFIX}attended_${sessionId}_${studentId}`;
      localStorage.setItem(key, new Date().toISOString());
      return true;
    }
    return false;
  }

  static isAttendanceVerified(sessionId: string, studentId: string): boolean {
    if (typeof window !== 'undefined') {
      const key = `${this.STORAGE_PREFIX}attended_${sessionId}_${studentId}`;
      return Boolean(localStorage.getItem(key));
    }
    return false;
  }
}
