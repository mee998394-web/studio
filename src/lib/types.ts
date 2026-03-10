
export type FileType = 'pdf' | 'doc' | 'image' | 'video' | 'audio' | 'text' | 'other';

export interface UserFile {
  id: string;
  name: string;
  size: number;
  type: string;
  extension: string;
  url: string;
  createdAt: string;
  userId: string;
  tags: string[];
  categories: string[];
  summary?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
}
