import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Eye, 
  Upload,
  Search,
  Filter,
  X,
  CheckCircle,
  Clock,
  AlertCircle,
  Folder,
  File
} from 'lucide-react';

const DocumentCard = ({ doc, onView, onDownload }) => {
  const getStatusColor = (category) => {
    const colors = {
      'Onboarding': 'blue',
      'Identity': 'green',
      'Tax Documents': 'yellow',
      'Certificates': 'purple',
      'Payroll': 'orange',
    };
    return colors[category] || 'gray';
  };

  const color = getStatusColor(doc.category);

  return (
    <div className="bg-white p-4 rounded-[20px] border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-start gap-3 mb-3">
        <div className={`bg-${color}-100 p-2.5 rounded-xl shrink-0`}>
          <File size={20} className={`text-${color}-600`} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-[#1B254B] text-sm mb-1 truncate">{doc.title}</h4>
          <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-2">
            <span className={`bg-${color}-50 text-${color}-700 px-2 py-0.5 rounded font-bold`}>
              {doc.category}
            </span>
            <span>{doc.size}</span>
            <span>•</span>
            <span>{doc.date}</span>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <button 
          onClick={() => onView(doc)}
          className="flex-1 bg-[#F4F7FE] text-[#0B4DA2] py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 hover:bg-blue-100 transition-colors active:scale-95"
        >
          <Eye size={14} /> View
        </button>
        <button 
          onClick={() => onDownload(doc)}
          className="flex-1 bg-[#042A5B] text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 hover:bg-[#0B4DA2] transition-colors active:scale-95"
        >
          <Download size={14} /> Download
        </button>
      </div>
    </div>
  );
};

const UploadModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[24px] max-w-md w-full p-6 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-[#1B254B] text-lg">Upload Document</h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">
              Document Title
            </label>
            <input
              type="text"
              placeholder="Enter document name"
              className="w-full px-4 py-2 bg-[#F4F7FE] rounded-xl text-sm outline-none border border-transparent focus:border-[#0B4DA2]/30 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">
              Category
            </label>
            <select className="w-full px-4 py-2 bg-[#F4F7FE] rounded-xl text-sm outline-none border border-transparent focus:border-[#0B4DA2]/30 transition-colors font-bold text-[#1B254B]">
              <option>Select Category</option>
              <option>Identity</option>
              <option>Tax Documents</option>
              <option>Certificates</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">
              Upload File
            </label>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-[#0B4DA2]/50 transition-colors cursor-pointer">
              <Upload size={32} className="mx-auto mb-2 text-gray-400" />
              <p className="text-sm font-bold text-[#1B254B] mb-1">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-400">PDF, DOC, DOCX (Max 5MB)</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              alert('Document uploaded successfully!');
              onClose();
            }}
            className="flex-1 px-4 py-2 bg-[#042A5B] text-white rounded-xl font-bold text-sm hover:bg-[#0B4DA2] transition-colors active:scale-95"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export const MyDocumentsPageOld = ({ documents: initialDocs, user }) => {
  const [documents, setDocuments] = useState<any[]>(initialDocs || []);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    fetch(`/api/documents/${userId}`)
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (data && data.length > 0) {
          setDocuments(data.map(d => ({
            id: d._id,
            title: d.title,
            category: d.category,
            date: new Date(d.uploadedAt || d.createdAt).toLocaleDateString(),
            size: d.fileSize || 'N/A',
            format: d.fileType || 'PDF'
          })));
        }
      })
      .catch(console.error);
  }, []);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const categories = ['All', ...new Set(documents.map(d => d.category))];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const documentsByCategory = categories.slice(1).map(category => ({
    category,
    count: documents.filter(d => d.category === category).length
  }));

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#042A5B] to-[#0B4DA2] rounded-[30px] p-8 text-white shadow-xl shadow-blue-900/20 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl">
                <FileText size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold">My Documents</h1>
                <p className="text-blue-100 text-sm">{user.name} • {documents.length} Documents</p>
              </div>
            </div>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="bg-white text-[#0B4DA2] px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-50 transition-all active:scale-95"
            >
              <Upload size={16} />
              Upload Document
            </button>
          </div>
        </div>
      </div>

      {/* Category Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {documentsByCategory.map((item, idx) => (
          <div 
            key={idx}
            className="bg-white p-4 rounded-[20px] border border-gray-100 hover:shadow-md transition-all cursor-pointer"
            onClick={() => setSelectedCategory(item.category)}
          >
            <div className="flex items-center gap-2 mb-2">
              <Folder size={18} className="text-[#0B4DA2]" />
              <h4 className="font-bold text-[#1B254B] text-sm">{item.category}</h4>
            </div>
            <p className="text-2xl font-bold text-[#0B4DA2]">{item.count}</p>
            <p className="text-xs text-gray-400 mt-1">Documents</p>
          </div>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-[20px] border border-gray-100 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#F4F7FE] rounded-xl text-sm outline-none border border-transparent focus:border-[#0B4DA2]/30 transition-colors"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-[#042A5B] text-white'
                  : 'bg-[#F4F7FE] text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Grid */}
      <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-[#1B254B] text-lg">
            {selectedCategory === 'All' ? 'All Documents' : selectedCategory}
          </h3>
          <p className="text-sm text-gray-500">
            {filteredDocuments.length} {filteredDocuments.length === 1 ? 'document' : 'documents'}
          </p>
        </div>

        {filteredDocuments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredDocuments.map((doc) => (
              <DocumentCard
                key={doc.id}
                doc={doc}
                onView={(d) => alert(`Viewing: ${d.title}`)}
                onDownload={(d) => window.open(`/api/pdf/letter/${user._id}/${d.title.toLowerCase().includes('offer') ? 'offer' : 'experience'}`, '_blank')}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 font-bold">No documents found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filter</p>
          </div>
        )}
      </div>

      {/* Document Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-[24px] shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-2xl">
            <CheckCircle size={24} className="text-green-600" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wide">Verified</p>
            <p className="text-2xl font-bold text-[#1B254B]">{documents.length - 2}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-[24px] shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-yellow-100 p-3 rounded-2xl">
            <Clock size={24} className="text-yellow-600" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wide">Pending Review</p>
            <p className="text-2xl font-bold text-[#1B254B]">1</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-[24px] shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-red-100 p-3 rounded-2xl">
            <AlertCircle size={24} className="text-red-600" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wide">Missing</p>
            <p className="text-2xl font-bold text-[#1B254B]">1</p>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
      />
    </div>
  );
};
