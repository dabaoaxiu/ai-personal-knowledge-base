export interface NoteRecord {
  id: string;
  content: string;
  summary: string | null;
  tags: string[] | null;
  created_at: string;
}

export interface NoteCardData extends NoteRecord {
  title: string;
  tags: string[];
}

export interface NoteAnalysis {
  summary: string;
  tags: string[];
}

export interface ChatSource {
  id: string;
  title: string;
}

export interface ChatAnswer {
  answer: string;
  sources: ChatSource[];
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  sources?: ChatSource[];
}
