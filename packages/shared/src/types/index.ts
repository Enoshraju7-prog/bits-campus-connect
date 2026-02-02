import type { Campus } from '../constants';

export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  bio: string | null;
  profilePhotoUrl: string | null;
  coverPhotoUrl: string | null;
  campus: Campus;
  batchYear: number;
  currentFocus: string | null;
  interests: Interest[];
  isVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Interest {
  id: string;
  name: string;
  category: string;
  icon: string;
}

export interface Connection {
  id: string;
  requesterId: string;
  addresseeId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  requester?: User;
  addressee?: User;
}

export interface Conversation {
  id: string;
  type: 'direct' | 'group';
  name: string | null;
  photoUrl: string | null;
  participants: ConversationParticipant[];
  lastMessage: Message | null;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConversationParticipant {
  userId: string;
  user: User;
  role: 'member' | 'admin';
  joinedAt: Date;
  lastReadAt: Date;
  isMuted: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  sender: User;
  content: string;
  messageType: 'text' | 'image' | 'system';
  mediaUrl: string | null;
  isDeleted: boolean;
  status: 'sent' | 'delivered' | 'read';
  createdAt: Date;
}

export interface Story {
  id: string;
  userId: string;
  user: User;
  contentType: 'image' | 'text';
  mediaUrl: string | null;
  textContent: string | null;
  backgroundColor: string | null;
  viewCount: number;
  expiresAt: Date;
  createdAt: Date;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  rules: string | null;
  iconUrl: string | null;
  bannerUrl: string | null;
  memberCount: number;
  isPrivate: boolean;
  createdBy: string;
  userRole: 'member' | 'moderator' | 'admin' | null;
  isJoined: boolean;
  createdAt: Date;
}

export interface FeedPost {
  id: string;
  authorId: string;
  author: User;
  content: string;
  postType: 'text' | 'image' | 'achievement';
  media: FeedPostMedia[];
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  isDeleted: boolean;
  createdAt: Date;
}

export interface FeedPostMedia {
  id: string;
  mediaUrl: string;
  mediaType: 'image';
  orderIndex: number;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  data: Record<string, unknown>;
  isRead: boolean;
  createdAt: Date;
}

export interface ApiResponse<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Array<{ field: string; message: string }>;
  };
}

export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
