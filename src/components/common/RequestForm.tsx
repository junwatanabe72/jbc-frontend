import React, { useState } from 'react';
import { useRequestStore } from '../../stores/requestStore';
import { useAuthStore } from '../../stores/authStore';
import FileUpload from './FileUpload';
import type { RequestType, RequestPriority, RequestDocument } from '../../types';

interface RequestFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const RequestForm: React.FC<RequestFormProps> = ({ isOpen, onClose }) => {
  const { addRequest } = useRequestStore();
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    type: 'maintenance' as RequestType,
    title: '',
    description: '',
    priority: 'medium' as RequestPriority,
    location: '',
    estimatedCost: '',
    dueDate: '',
  });
  const [documents, setDocuments] = useState<RequestDocument[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    const requestData = {
      type: formData.type,
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      submitterId: user.id,
      submitterName: user.name,
      location: formData.location,
      estimatedCost: formData.estimatedCost ? parseInt(formData.estimatedCost) : undefined,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
      documents: documents,
    };

    addRequest(requestData);

    // フォームリセット
    setFormData({
      type: 'maintenance',
      title: '',
      description: '',
      priority: 'medium',
      location: '',
      estimatedCost: '',
      dueDate: '',
    });
    setDocuments([]);

    onClose();
    alert('申請を送信しました。');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'maintenance': return 'メンテナンス';
      case 'construction': return '工事';
      case 'move_in_out': return '搬入・搬出';
      case 'equipment': return '設備';
      case 'other': return 'その他';
      default: return type;
    }
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">新規申請作成</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                申請タイプ
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="maintenance">メンテナンス</option>
                <option value="construction">工事</option>
                <option value="move_in_out">搬入・搬出</option>
                <option value="equipment">設備</option>
                <option value="other">その他</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                優先度
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">低</option>
                <option value="medium">中</option>
                <option value="high">高</option>
                <option value="urgent">緊急</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              申請タイトル
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="例: 3F廊下の照明修理"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              詳細説明
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              placeholder="申請内容の詳細を記入してください"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              場所
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="例: 3F 廊下、2F-201号室"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                希望完了日
              </label>
              <input
                type="datetime-local"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                予想費用（円）
              </label>
              <input
                type="number"
                name="estimatedCost"
                value={formData.estimatedCost}
                onChange={handleInputChange}
                min="0"
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              添付ファイル
            </label>
            <FileUpload
              documents={documents}
              onDocumentsChange={setDocuments}
              maxFiles={3}
              maxSizeInMB={5}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              申請提出
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestForm;