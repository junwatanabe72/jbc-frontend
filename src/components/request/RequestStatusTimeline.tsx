import React from 'react';
import type { Request } from '../../types';

interface RequestStatusTimelineProps {
  request: Request;
}

const RequestStatusTimeline: React.FC<RequestStatusTimelineProps> = ({ request }) => {
  const timelineItems = [
    {
      status: 'submitted',
      label: '申請提出',
      date: request.createdAt,
      completed: true,
    },
    {
      status: 'under_review',
      label: '審査開始',
      date: request.status !== 'submitted' ? request.updatedAt : null,
      completed: request.status !== 'submitted',
    },
    {
      status: request.status === 'approved' ? 'approved' : 'rejected',
      label: request.status === 'approved' ? '承認完了' : '却下',
      date: request.approvedAt || request.reviewedAt,
      completed: request.status === 'approved' || request.status === 'rejected',
    },
    {
      status: 'completed',
      label: '完了',
      date: request.completedAt,
      completed: request.status === 'completed',
    },
  ];

  const getStatusIcon = (status: string, completed: boolean) => {
    if (!completed) {
      return <div className="w-3 h-3 rounded-full border-2 border-gray-300 bg-white"></div>;
    }

    switch (status) {
      case 'submitted':
        return <div className="w-3 h-3 rounded-full bg-blue-500"></div>;
      case 'under_review':
        return <div className="w-3 h-3 rounded-full bg-yellow-500"></div>;
      case 'approved':
        return <div className="w-3 h-3 rounded-full bg-green-500"></div>;
      case 'rejected':
        return <div className="w-3 h-3 rounded-full bg-red-500"></div>;
      case 'completed':
        return <div className="w-3 h-3 rounded-full bg-gray-500"></div>;
      default:
        return <div className="w-3 h-3 rounded-full border-2 border-gray-300 bg-white"></div>;
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-gray-900">申請進捗</h4>
      <div className="flow-root">
        <ul className="-mb-8">
          {timelineItems.map((item, index) => (
            <li key={item.status}>
              <div className="relative pb-8">
                {index !== timelineItems.length - 1 && (
                  <span
                    className={`absolute top-4 left-4 -ml-px h-full w-0.5 ${
                      item.completed ? 'bg-blue-200' : 'bg-gray-200'
                    }`}
                    aria-hidden="true"
                  />
                )}
                <div className="relative flex space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center">
                    {getStatusIcon(item.status, item.completed)}
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p className={`text-sm ${item.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                        {item.label}
                      </p>
                    </div>
                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                      {item.date && (
                        <time dateTime={item.date.toISOString()}>
                          {item.date.toLocaleDateString('ja-JP')}
                        </time>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RequestStatusTimeline;