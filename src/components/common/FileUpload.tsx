import React, { useRef, useState } from 'react';
import type { RequestDocument } from '../../types';

interface FileUploadProps {
  documents: RequestDocument[];
  onDocumentsChange: (documents: RequestDocument[]) => void;
  maxFiles?: number;
  maxSizeInMB?: number;
  acceptedTypes?: string[];
}

const FileUpload: React.FC<FileUploadProps> = ({
  documents,
  onDocumentsChange,
  maxFiles = 5,
  maxSizeInMB = 10,
  acceptedTypes = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.gif']
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    setUploadError(null);
    const newDocuments: RequestDocument[] = [];

    Array.from(files).forEach((file) => {
      // ファイル数チェック
      if (documents.length + newDocuments.length >= maxFiles) {
        setUploadError(`最大${maxFiles}ファイルまでアップロード可能です`);
        return;
      }

      // ファイルサイズチェック
      if (file.size > maxSizeInMB * 1024 * 1024) {
        setUploadError(`ファイルサイズは${maxSizeInMB}MB以下にしてください: ${file.name}`);
        return;
      }

      // ファイル形式チェック
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!acceptedTypes.includes(fileExtension || '')) {
        setUploadError(`対応していないファイル形式です: ${file.name}`);
        return;
      }

      // モックURL生成（実際の実装では、ファイルをサーバーにアップロードしてURLを取得）
      const mockUrl = URL.createObjectURL(file);

      const newDocument: RequestDocument = {
        id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        url: mockUrl,
        type: file.type,
        size: file.size,
        uploadedAt: new Date(),
      };

      newDocuments.push(newDocument);
    });

    if (newDocuments.length > 0) {
      onDocumentsChange([...documents, ...newDocuments]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const removeDocument = (documentId: string) => {
    onDocumentsChange(documents.filter(doc => doc.id !== documentId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileTypeIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf': return '📄';
      case 'doc':
      case 'docx': return '📝';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif': return '🖼️';
      default: return '📎';
    }
  };

  return (
    <div className="space-y-4">
      {/* ファイルアップロードエリア */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragOver
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
        
        <div className="space-y-2">
          <div className="text-4xl">📁</div>
          <div className="text-sm text-gray-600">
            <p className="font-medium">ファイルをドラッグ&ドロップ または クリックしてファイルを選択</p>
            <p className="text-xs mt-1">
              対応形式: {acceptedTypes.join(', ')} | 最大サイズ: {maxSizeInMB}MB | 最大{maxFiles}ファイル
            </p>
          </div>
        </div>
      </div>

      {/* エラーメッセージ */}
      {uploadError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-700">{uploadError}</p>
        </div>
      )}

      {/* アップロード済みファイル一覧 */}
      {documents.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">アップロード済みファイル</h4>
          <div className="space-y-2">
            {documents.map((document) => (
              <div
                key={document.id}
                className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-md"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{getFileTypeIcon(document.name)}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{document.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(document.size)} • {new Date(document.uploadedAt).toLocaleDateString('ja-JP')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeDocument(document.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  削除
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;