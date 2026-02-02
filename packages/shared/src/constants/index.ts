export const CAMPUS_COLORS = {
  pilani: '#DC2626',
  goa: '#059669',
  hyderabad: '#7C3AED',
  dubai: '#D97706',
} as const;

export type Campus = 'pilani' | 'goa' | 'hyderabad' | 'dubai';

export const CAMPUSES: Campus[] = ['pilani', 'goa', 'hyderabad', 'dubai'];

export const BITS_EMAIL_REGEX =
  /^[a-z]\d{8}@(pilani|goa|hyderabad|dubai)\.bits-pilani\.ac\.in$/i;

export const JWT_ACCESS_EXPIRY = '15m';
export const JWT_REFRESH_EXPIRY = '7d';
export const OTP_EXPIRY_SECONDS = 600; // 10 minutes
export const OTP_MAX_RESENDS_PER_HOUR = 3;

export const PAGINATION_DEFAULT_LIMIT = 20;
export const PAGINATION_MAX_LIMIT = 100;

export const MAX_BIO_LENGTH = 500;
export const MAX_USERNAME_LENGTH = 20;
export const MIN_USERNAME_LENGTH = 3;
export const MAX_INTERESTS = 10;
export const MAX_GROUP_MEMBERS = 256;
export const MAX_STORIES_PER_DAY = 10;
export const STORY_EXPIRY_HOURS = 24;
export const MAX_MESSAGE_LENGTH = 2000;
export const MAX_POST_LENGTH = 2000;
export const MAX_COMMUNITY_POST_LENGTH = 10000;
export const MAX_IMAGES_PER_POST = 4;

export const NOTIFICATION_TYPES = {
  CONNECTION_REQUEST: 'connection_request',
  CONNECTION_ACCEPTED: 'connection_accepted',
  NEW_MESSAGE: 'new_message',
  GROUP_ADDED: 'group_added',
  STORY_REACTION: 'story_reaction',
  STORY_REPLY: 'story_reply',
  POST_LIKE: 'post_like',
  POST_COMMENT: 'post_comment',
  COMMENT_REPLY: 'comment_reply',
  COMMUNITY_POST: 'community_post',
  POST_UPVOTE: 'post_upvote',
  COMMENT_MENTION: 'comment_mention',
  WELCOME: 'welcome',
  SYSTEM_ANNOUNCEMENT: 'system_announcement',
} as const;

export const INTEREST_CATEGORIES = {
  Sports: [
    'Cricket', 'Football', 'Basketball', 'Badminton', 'Tennis',
    'Table Tennis', 'Chess', 'Swimming', 'Athletics', 'Volleyball',
  ],
  Technology: [
    'Web Development', 'Mobile Development', 'AI/ML', 'Data Science',
    'Cybersecurity', 'Blockchain', 'Cloud Computing', 'DevOps', 'IoT',
  ],
  Finance: [
    'Stock Trading', 'Crypto', 'Personal Finance', 'Quant Finance',
    'Investing', 'Economics',
  ],
  'Arts & Entertainment': [
    'Music', 'Dance', 'Photography', 'Videography', 'Film Making',
    'Short Films', 'Writing', 'Poetry', 'Stand-up Comedy', 'Theatre',
  ],
  Gaming: [
    'PC Gaming', 'Mobile Gaming', 'Console Gaming', 'Esports',
    'Game Development',
  ],
  Academics: [
    'Research', 'Competitive Programming', 'Robotics', 'Electronics',
    'Mathematics', 'Physics',
  ],
  Lifestyle: [
    'Fitness', 'Travel', 'Food', 'Reading', 'Anime', 'Movies',
    'TV Series', 'Fashion', 'Cooking',
  ],
  'Social Impact': [
    'Environment', 'Education', 'Social Entrepreneurship', 'Volunteering',
  ],
} as const;
