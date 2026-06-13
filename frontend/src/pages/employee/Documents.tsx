import React, { useState, useEffect } from 'react';
import { FileUpload } from '../../components/FileUpload';
import { getDocuments, createDocument } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { FileText, Download, Eye, Upload as UploadIcon, Loader2 } from 'lucide-react';

export function Documents() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadCategory, setUploadCategory] = useState('');

  useEffect(() => {
    if (!user?.id) return;
    const fetchDocs = async () => {
      try {
        const data = await getDocuments(user.id);
        setDocuments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching documents:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, [user?.id]);

  const handleFileSelect = (files: File[]) => {
    setSelectedFiles([...selectedFiles, ...files]);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    try {
      for (const file of selectedFiles) {
        await createDocument({
          user: user?.id,
          name: file.name,
          type: file.type || 'Document',
          category: uploadCategory || 'Other',
          size: `${(file.size / 1024).toFixed(1)} KB`,
          uploadDate: new Date().toISOString(),
        });
      }
      // Refresh documents list
      const data = await getDocuments(user!.id);
      setDocuments(Array.isArray(data) ? data : []);
      setSelectedFiles([]);
      setShowUploadModal(false);
      setUploadCategory('');
    } catch (err) {
      console.error('Upload error:', err);
      alert('Error uploading documents. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin" size={32} style={{ color: 'var(--smg-royal)' }} />
        <span className="ml-3 text-gray-500">Loading documents...</span>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 style={{ color: 'var(--smg-dark)' }}>My Documents</h1>
          <p className="text-gray-600 mt-1">View and manage your documents</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white hover:opacity-90 transition-opacity"
          style={{ backgroundColor: 'var(--smg-royal)' }}
        >
          <UploadIcon size={18} />
          Upload Document
        </button>
      </div>

      {/* Documents Grid */}
      {documents.length === 0 ? (
        <div className="bg-white rounded-xl p-12 border border-gray-200 text-center">
          <FileText size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">No documents uploaded yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <div key={doc._id || doc.id} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#E3F2FD' }}>
                  <FileText size={24} style={{ color: 'var(--smg-royal)' }} />
                </div>
                <span className="text-xs px-2 py-1 bg-gray-100 rounded">{doc.type}</span>
              </div>
              <h4 className="mb-2 line-clamp-2" style={{ color: 'var(--smg-dark)' }}>{doc.name}</h4>
              <p className="text-xs text-gray-500 mb-1">{doc.category}</p>
              <p className="text-xs text-gray-400 mb-4">{doc.size} • {doc.uploadDate ? new Date(doc.uploadDate).toLocaleDateString('en-IN') : '-'}</p>
              <div className="flex items-center gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm" aria-label="View document">
                  <Eye size={16} /> View
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-white hover:opacity-90 transition-opacity text-sm" style={{ backgroundColor: 'var(--smg-royal)' }} aria-label="Download document">
                  <Download size={16} /> Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6">
            <h3 className="mb-4" style={{ color: 'var(--smg-dark)' }}>Upload Documents</h3>
            <div className="mb-6">
              <label className="block text-sm mb-2" style={{ color: 'var(--smg-dark)' }}>Document Category</label>
              <select
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2"
                value={uploadCategory}
                onChange={(e) => setUploadCategory(e.target.value)}
              >
                <option value="">Select Category</option>
                <option value="Identity">Identity</option>
                <option value="Tax Documents">Tax Documents</option>
                <option value="Certificates">Certificates</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <FileUpload onFileSelect={handleFileSelect} selectedFiles={selectedFiles} onRemoveFile={handleRemoveFile} />
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={handleUpload}
                disabled={selectedFiles.length === 0}
                className="flex-1 px-4 py-2 rounded-lg text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: 'var(--smg-royal)' }}
              >
                Upload {selectedFiles.length > 0 && `(${selectedFiles.length})`}
              </button>
              <button onClick={() => { setShowUploadModal(false); setSelectedFiles([]); }} className="flex-1 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
