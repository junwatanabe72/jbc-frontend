import { create } from 'zustand';
import type { RequestState, Request, RequestStatus, RequestType } from '../types';
import { mockRequests } from '../data/mockRequests';

export const useRequestStore = create<RequestState>((set, get) => ({
  requests: mockRequests,
  isLoading: false,

  addRequest: (requestData) => {
    const newRequest: Request = {
      ...requestData,
      id: `req-${Date.now()}`,
      status: 'submitted',
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    set((state) => ({
      requests: [...state.requests, newRequest],
    }));
  },

  updateRequest: (id, updates) => {
    set((state) => ({
      requests: state.requests.map((request) =>
        request.id === id
          ? { ...request, ...updates, updatedAt: new Date() }
          : request
      ),
    }));
  },

  deleteRequest: (id) => {
    set((state) => ({
      requests: state.requests.filter((request) => request.id !== id),
    }));
  },

  approveRequest: (id, approvedBy, comments) => {
    const { addComment } = get();
    
    set((state) => ({
      requests: state.requests.map((request) =>
        request.id === id
          ? {
              ...request,
              status: 'approved',
              approvedBy,
              approvedAt: new Date(),
              updatedAt: new Date(),
            }
          : request
      ),
    }));

    if (comments) {
      addComment(id, approvedBy, '管理者', comments);
    }
  },

  rejectRequest: (id, rejectedBy, reason) => {
    set((state) => ({
      requests: state.requests.map((request) =>
        request.id === id
          ? {
              ...request,
              status: 'rejected',
              rejectionReason: reason,
              reviewedBy: rejectedBy,
              reviewedAt: new Date(),
              updatedAt: new Date(),
            }
          : request
      ),
    }));
  },

  addComment: (requestId, userId, userName, content) => {
    const newComment = {
      id: `comment-${Date.now()}`,
      userId,
      userName,
      content,
      createdAt: new Date(),
    };

    set((state) => ({
      requests: state.requests.map((request) =>
        request.id === requestId
          ? {
              ...request,
              comments: [...request.comments, newComment],
              updatedAt: new Date(),
            }
          : request
      ),
    }));
  },

  getRequestsByUser: (userId) => {
    const { requests } = get();
    return requests.filter((request) => request.submitterId === userId);
  },

  getRequestsByStatus: (status: RequestStatus) => {
    const { requests } = get();
    return requests.filter((request) => request.status === status);
  },

  getRequestsByType: (type: RequestType) => {
    const { requests } = get();
    return requests.filter((request) => request.type === type);
  },
}));