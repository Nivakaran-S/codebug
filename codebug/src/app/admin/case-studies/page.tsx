'use client'
import { useState, useEffect } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { caseStudiesAPI } from '@/lib/api'

export default function CaseStudiesPage() {
    const [caseStudies, setCaseStudies] = useState<any[]>([])
    const [filterStatus, setFilterStatus] = useState<string>('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [editingStudy, setEditingStudy] = useState<any | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        loadCaseStudies()
    }, [])

    const loadCaseStudies = async () => {
        try {
            const data = await caseStudiesAPI.getAll()
            setCaseStudies(data)
        } catch (error) {
            console.error('Error loading case studies:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const filteredStudies = caseStudies.filter(study => {
        const matchesSearch = study.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            study.client?.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = filterStatus === 'all' || study.status === filterStatus
        return matchesSearch && matchesStatus
    })

    const handleToggleFeatured = async (id: string) => {
        try {
            await caseStudiesAPI.toggleFeatured(id)
            loadCaseStudies()
        } catch (error) {
            console.error('Error toggling featured:', error)
        }
    }

    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            await caseStudiesAPI.updateStatus(id, status)
            loadCaseStudies()
        } catch (error) {
            console.error('Error updating status:', error)
        }
    }

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this case study?')) {
            try {
                await caseStudiesAPI.delete(id)
                loadCaseStudies()
            } catch (error) {
                console.error('Error deleting:', error)
            }
        }
    }

    const handleSave = async (data: any) => {
        try {
            if (editingStudy) {
                await caseStudiesAPI.update(editingStudy._id, data)
            } else {
                await caseStudiesAPI.create(data)
            }
            setShowModal(false)
            setEditingStudy(null)
            loadCaseStudies()
        } catch (error) {
            console.error('Error saving:', error)
            alert('Failed to save case study')
        }
    }

    return (
        <AdminLayout
            title="Case Studies"
            description="Manage your portfolio case studies"
            actions={
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#EFA130] hover:bg-[#d88f20] text-black font-medium rounded-lg transition-all"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="hidden sm:inline">New Case Study</span>
                </button>
            }
        >
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search case studies..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#EFA130]/50"
                    />
                </div>
                <div className="flex gap-2">
                    {['all', 'published', 'draft'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filterStatus === status
                                ? 'bg-[#EFA130] text-black'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Case Studies Grid */}
            {isLoading ? (
                <div className="text-center py-20 text-gray-500">Loading case studies...</div>
            ) : filteredStudies.length === 0 ? (
                <div className="text-center py-20">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No case studies found</h3>
                    <p className="text-gray-500 mb-6">Create your first case study</p>
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-6 py-3 bg-[#EFA130] hover:bg-[#d88f20] text-black font-medium rounded-xl transition-colors"
                    >
                        Add Case Study
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredStudies.map((study) => (
                        <div
                            key={study._id}
                            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-[#EFA130]/30 transition-all group"
                        >
                            {/* Header */}
                            <div className="h-32 bg-gradient-to-br from-[#4B4B4D] to-[#2a2a2a] relative">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                {study.isFeatured && (
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 bg-[#EFA130] text-black text-xs font-bold rounded-full">
                                            Featured
                                        </span>
                                    </div>
                                )}
                                <div className="absolute top-4 right-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${study.status === 'published'
                                        ? 'bg-emerald-500/20 text-emerald-400'
                                        : 'bg-yellow-500/20 text-yellow-400'
                                        }`}>
                                        {study.status}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <h3 className="text-white font-semibold text-lg mb-1">{study.title}</h3>
                                <p className="text-[#EFA130] text-sm mb-2">{study.client}</p>
                                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{study.description}</p>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-1 mb-4">
                                    {study.tags?.slice(0, 3).map((tag: string) => (
                                        <span key={tag} className="px-2 py-1 bg-white/5 rounded text-xs text-gray-400">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleToggleFeatured(study._id)}
                                            className={`p-2 rounded-lg transition-colors ${study.isFeatured
                                                ? 'bg-[#EFA130]/20 text-[#EFA130]'
                                                : 'hover:bg-white/10 text-gray-400'
                                                }`}
                                            title={study.isFeatured ? 'Remove from featured' : 'Add to featured'}
                                        >
                                            <svg className="w-4 h-4" fill={study.isFeatured ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => { setEditingStudy(study); setShowModal(true); }}
                                            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(study._id)}
                                            className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => handleUpdateStatus(study._id, study.status === 'published' ? 'draft' : 'published')}
                                        className="text-xs text-[#EFA130] hover:text-[#d88f20] transition-colors"
                                    >
                                        {study.status === 'published' ? 'Unpublish' : 'Publish'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <CaseStudyModal
                    study={editingStudy}
                    onClose={() => { setShowModal(false); setEditingStudy(null); }}
                    onSave={handleSave}
                />
            )}
        </AdminLayout>
    )
}

function CaseStudyModal({ study, onClose, onSave }: { study?: any; onClose: () => void; onSave: (data: any) => void }) {
    const [formData, setFormData] = useState({
        title: study?.title || '',
        client: study?.client || '',
        description: study?.description || '',
        challenge: study?.challenge || '',
        solution: study?.solution || '',
        results: study?.results || '',
        tags: study?.tags?.join(', ') || '',
        status: study?.status || 'draft',
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave({
            ...formData,
            tags: formData.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
        })
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-[#1a1a1a] border-b border-white/10 p-6 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">{study ? 'Edit Case Study' : 'New Case Study'}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#EFA130]/50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Client</label>
                            <input
                                type="text"
                                value={formData.client}
                                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                                required
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#EFA130]/50"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#EFA130]/50 resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Challenge</label>
                        <textarea
                            value={formData.challenge}
                            onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                            rows={2}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#EFA130]/50 resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Solution</label>
                        <textarea
                            value={formData.solution}
                            onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                            rows={2}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#EFA130]/50 resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Results</label>
                        <textarea
                            value={formData.results}
                            onChange={(e) => setFormData({ ...formData, results: e.target.value })}
                            rows={2}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#EFA130]/50 resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Tags (comma-separated)</label>
                        <input
                            type="text"
                            value={formData.tags}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#EFA130]/50"
                            placeholder="AI, Web App, Healthcare..."
                        />
                    </div>

                    <div className="flex justify-end gap-4 pt-4 border-t border-white/10">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-[#EFA130] hover:bg-[#d88f20] text-black font-medium rounded-xl transition-colors"
                        >
                            {study ? 'Save Changes' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
