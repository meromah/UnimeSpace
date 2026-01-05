// Default placeholders
export const DEFAULT_PLACEHOLDERS = {
  bio: "No bio available",
  education: "Education not specified",
  joinDate: "Unknown",
  noPosts: "No posts yet",
  noTests: "No tests created yet",
  noComments: "No comments yet",
};

export const SUCCESS_MESSAGES_FOR_UPDATES = {
  name: "Full Name updated successfully!",
  username: "Username updated successfully!",
  biography: "Biography updated successfully!",
  birth_date: "Birth date updated successfully!",
  sex: "Sex updated successfully!",
  enrollment_year_id: "Enrollment year updated successfully!",
};

export const SORT_BY = [
  {
    id: "latest=1",
    label: "Latest",
    requiresAuth: false,
    emptyStateTitle: "Nothing yet!",
    emptyStateMessage: "Be the first to share something!",
  },
  {
    id: "oldest=1",
    label: "Oldest",
    requiresAuth: false,
    emptyStateTitle: "Nothing yet!",
    emptyStateMessage: "Be the first to share something!",
  },
  {
    id: "popular=1",
    label: "Popular",
    requiresAuth: false,
    emptyStateTitle: "Nothing yet!",
    emptyStateMessage: "Be the first to share something!",
  },
  {
    id: "hot=1",
    label: "Hot",
    requiresAuth: false,
    emptyStateTitle: "Nothing yet!",
    emptyStateMessage: "Be the first to share something!",
  }
];

export const SORT_BY_TYPE = [
  {
    id: "all",
    label: "All",
    requiresAuth: false,
    emptyStateTitle: "Nothing yet here!",
    emptyStateMessage: "Be the first to share something!",
  },
  {
    id: "posts",
    label: "Posts",
    requiresAuth: false,
    emptyStateTitle: "No posts yet!",
    emptyStateMessage: "Be the first to share something!",
  },
  {
    id: "tests",
    label: "Tests",
    requiresAuth: false,
    emptyStateTitle: "No tests yet!",
    emptyStateMessage: "Be the first to share something!",
  },
];
export const SORT_BY_BOARD_TYPE = [
  {
    id: "all",
    label: "All",
    requiresAuth: false,
    emptyStateTitle: "Nothing yet here!",
    emptyStateMessage: "Be the first to Create Community!",
  },
  {
    id: "my",
    label: "My boards",
    requiresAuth: true,
    emptyStateTitle: "No boards you created yet!",
    emptyStateMessage: "Create boards using Create Community!",
  },
  {
    id: "subscribed",
    label: "Subscribed",
    requiresAuth: true,
    emptyStateTitle: "No subscribed board yet!",
    emptyStateMessage: "Subscribe to boards, then you can see them in here.",
  },
];
export const SORT_BY_DESC_TYPE = [
  {
    id: "all",
    label: "All",
    requiresAuth: false,
    emptyStateTitle: "Nothing yet here!",
    emptyStateMessage: "Be the first to Create Community!",
  },
  {
    id: "my",
    label: "My descs",
    requiresAuth: true,
    emptyStateTitle: "No descs you created yet!",
    emptyStateMessage: "Create descs using Create Community!",
  },
  {
    id: "subscribed",
    label: "Subscribed",
    requiresAuth: true,
    emptyStateTitle: "No subscribed desc yet!",
    emptyStateMessage: "Subscribe to descs, then you can see them in here.",
  },
];
