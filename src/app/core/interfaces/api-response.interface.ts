// Base API Response Interface
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: ApiError;
  timestamp?: string;
  path?: string;
}

// Error Response Interface
export interface ApiError {
  code: string;
  message: string;
  details?: ApiErrorDetail[];
}

export interface ApiErrorDetail {
  field: string;
  message: string;
}

// Pagination Interface
export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

// Paginated Response Interface
export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationInfo;
}

// Statistics Interface
export interface Statistics {
  totalEnquiries?: number;
  unreadEnquiries?: number;
  thisMonth?: number;
  lastMonth?: number;
}

// Common Query Parameters
export interface QueryParams {
  page?: number;
  limit?: number;
  offset?: number;
  category?: string;
  status?: string;
  featured?: boolean;
  isPublic?: boolean;
  dateFrom?: string;
  dateTo?: string;
}

// File Upload Response
export interface FileUploadResponse {
  filename: string;
  originalName: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: string;
}

// Authentication Response
export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: AuthUser;
  expiresIn: number;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  permissions: string[];
}

// Refresh Token Response
export interface RefreshTokenResponse {
  token: string;
  expiresIn: number;
}
