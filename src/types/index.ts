export type UserRole = 'OWNER' | 'MGMT' | 'TENANT' | 'BROKER';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  buildingId?: string;
  tenantId?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

export type EventType = 'meeting' | 'maintenance' | 'inspection' | 'training' | 'other';
export type EventStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

export interface Event {
  id: string;
  title: string;
  description?: string;
  type: EventType;
  status: EventStatus;
  startTime: Date;
  endTime: Date;
  location?: string;
  organizer: string;
  attendees?: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EventState {
  events: Event[];
  selectedDate: Date;
  isLoading: boolean;
  addEvent: (event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  getEventsByDate: (date: Date) => Event[];
  setSelectedDate: (date: Date) => void;
}

export interface Room {
  id: string;
  name: string;
  floor: number;
  capacity: number;
  equipment: string[];
  hourlyRate?: number;
  isActive: boolean;
}

export type BookingStatus = 'pending' | 'approved' | 'rejected' | 'cancelled' | 'completed';

export interface Booking {
  id: string;
  roomId: string;
  userId: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  status: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
  approvedBy?: string;
  approvedAt?: Date;
  rejectionReason?: string;
}

export interface BookingState {
  bookings: Booking[];
  rooms: Room[];
  isLoading: boolean;
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => void;
  updateBooking: (id: string, booking: Partial<Booking>) => void;
  deleteBooking: (id: string) => void;
  getBookingsByRoom: (roomId: string, date: Date) => Booking[];
  getAvailableSlots: (roomId: string, date: Date) => { start: Date; end: Date }[];
  approveBooking: (id: string, approvedBy: string) => void;
  rejectBooking: (id: string, reason: string, rejectedBy: string) => void;
}

export type RequestType = 'maintenance' | 'construction' | 'move_in_out' | 'equipment' | 'booking' | 'parking' | 'emergency' | 'event' | 'other';
export type RequestStatus = 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'completed';
export type RequestPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface RequestDocument {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: Date;
}

export interface Request {
  id: string;
  type: RequestType;
  title: string;
  description: string;
  priority: RequestPriority;
  status: RequestStatus;
  submitterId: string;
  submitterName: string;
  assignedTo?: string;
  reviewedBy?: string;
  reviewedAt?: Date;
  approvedBy?: string;
  approvedAt?: Date;
  rejectionReason?: string;
  completedAt?: Date;
  dueDate?: Date;
  estimatedCost?: number;
  actualCost?: number;
  location?: string;
  documents: RequestDocument[];
  comments: RequestComment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface RequestComment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: Date;
}

export interface RequestState {
  requests: Request[];
  isLoading: boolean;
  addRequest: (request: Omit<Request, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'comments'>) => void;
  updateRequest: (id: string, updates: Partial<Request>) => void;
  deleteRequest: (id: string) => void;
  approveRequest: (id: string, approvedBy: string, comments?: string) => void;
  rejectRequest: (id: string, rejectedBy: string, reason: string) => void;
  addComment: (requestId: string, userId: string, userName: string, content: string) => void;
  getRequestsByUser: (userId: string) => Request[];
  getRequestsByStatus: (status: RequestStatus) => Request[];
  getRequestsByType: (type: RequestType) => Request[];
}

// Building management types
export * from './building';

// Billing and analytics types
export * from './billing';