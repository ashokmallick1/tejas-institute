export type LiveSessionStatus = 'UPCOMING' | 'LIVE' | 'COMPLETED';

export type UserLiveRole = 'STUDENT' | 'TA' | 'INSTRUCTOR' | 'MENTOR';

export interface LiveChatMessage {
  id: string;
  session_id: string;
  sender_name: string;
  sender_role: UserLiveRole;
  sender_avatar?: string;
  message: string;
  timestamp: string;
  is_pinned?: boolean;
  reactions?: Record<string, number>;
}

export interface LiveDoubt {
  id: string;
  session_id: string;
  student_id: string;
  student_name: string;
  student_avatar?: string;
  doubt_text: string;
  timestamp_str: string;
  upvotes: number;
  upvoted_by_user?: boolean;
  status: 'OPEN' | 'ANSWERING_LIVE' | 'RESOLVED';
  answer?: string;
  answered_by?: string;
  answered_at?: string;
}

export interface LivePollOption {
  id: string;
  text: string;
  votes: number;
}

export interface LivePoll {
  id: string;
  session_id: string;
  question: string;
  options: LivePollOption[];
  correct_option_id?: string;
  is_active: boolean;
  duration_seconds: number;
  seconds_remaining?: number;
  total_votes: number;
  user_voted_option_id?: string;
  explanation?: string;
}

export interface LiveClassSession {
  id: string;
  title: string;
  batch_code: string;
  batch_id: string;
  program_id: string;
  program_title: string;
  instructor_name: string;
  instructor_role: string;
  instructor_avatar: string;
  ta_names: string[];
  status: LiveSessionStatus;
  scheduled_at: string;
  duration_mins: number;
  stream_video_url: string;
  active_viewers: number;
  github_repo_url?: string;
  slides_url?: string;
  notebook_url?: string;
  handout_name?: string;
  topic_tags: string[];
  description: string;
  initial_code?: {
    filename: string;
    language: string;
    code: string;
  };
}
