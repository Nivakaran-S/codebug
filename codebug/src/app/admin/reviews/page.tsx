'use client'
import { useState, useEffect } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { reviewsAPI } from '@/lib/api'

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<any[]>([])
    const [filterStatus, setFilterStatus] = useState<string>('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [editingReview, setEditingReview] = useState<any | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        loadReviews()
    }, [])

    const loadReviews = async () => {
        try {
            const data = await reviewsAPI.getAll()
            setReviews(data)
        } catch (error) {
            console.error('Error loading reviews:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const filteredReviews = reviews.filter(review => {
        const matchesSearch = review.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            review.company?.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = filterStatus === 'all' || review.status === filterStatus
        return matchesSearch && matchesStatus
    })

    const pendingCount = reviews.filter(r => r.status === 'pending').length

    const handleApprove = async (id: string) => {
        try {
            await reviewsAPI.approve(id)
            loadReviews()
        } catch (error) {
            console.error('Error approving:', error)
        }
    }

    const handleReject = async (id: string) => {
        try {
            await reviewsAPI.reject(id)
            loadReviews()
        } catch (error) {
            console.error('Error rejecting:', error)
        }
    }

    const handleToggleFeatured = async (id: string) => {
        try {
            await reviewsAPI.toggleFeatured(id)
            loadReviews()
        } catch (error) {
            console.error('Error toggling featured:', error)
        }
    }

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this review?')) {
            try {
                await reviewsAPI.delete(id)
                loadReviews()
            } catch (error) {
                console.error('Error deleting:', error)
            }
        }
    }

    const handleApproveAll = async () => {
        if (pendingCount > 0 && confirm(`Approve all ${pendingCount} pending reviews?`)) {
            try {
                await reviewsAPI.approveAll()
                loadReviews()
            } catch (error) {
                console.error('Error approving all:', error)
            }
        }
    }

    const handleSave = async (data: any) => {
        try {
            if (editingReview) {
                await reviewsAPI.update(editingReview._id, data)
            } else {
                await reviewsAPI.create(data)
            }
            setShowModal(false)
            setEditingReview(null)
            loadReviews()
        } catch (error) {
            console.error('Error saving:', error)
            alert('Failed to save review')
        }
    }

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <svg
                key={i}
                className={`w-4 h-4 ${i < rating ? 'text-[#EFA130]' : 'text-gray-600'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ))
    }

    const statusColors: Record<string, string> = {
        pending: 'bg-yellow-500/20 text-yellow-400',
        approved: 'bg-emerald-500/20 text-emerald-400',
        rejected: 'bg-red-500/20 text-red-400',
    }

    return (
        <AdminLayout
            title="Reviews"
            description="Manage customer reviews and testimonials"
            actions={
                <div className="flex items-center gap-3">
                    {pendingCount > 0 && (
                        <button
                            onClick={handleApproveAll}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-medium rounded-lg transition-all"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Approve All ({pendingCount})
                        </button>
                    )}
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#EFA130] hover:bg-[#d88f20] text-black font-medium rounded-lg transition-all"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="hidden sm:inline">Add Review</span>
                    </button>
                </div>
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
                        placeholder="Search reviews..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#EFA130]/50"
                    />
                </div>
                <div className="flex gap-2">
                    {['all', 'pending', 'approved', 'rejected'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filterStatus === status
                                    ? 'bg-[#EFA130] text-black'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                            {status === 'pending' && pendingCount > 0 && (
                                <span className="ml-1 px-1.5 py-0.5 bg-yellow-500 text-black text-xs rounded-full">{pendingCount}</span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Reviews Grid */}
            {isLoading ? (
                <div className="text-center py-20 text-gray-500">Loading reviews...</div>
            ) : filteredReviews.length === 0 ? (
                <div className="text-center py-20">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No reviews found</h3>
                    <p className="text-gray-500 mb-6">Reviews will appear here</p>
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-6 py-3 bg-[#EFA130] hover:bg-[#d88f20] text-black font-medium rounded-xl transition-colors"
                    >
                        Add Review
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredReviews.map((review) => (
                        <div
                            key={review._id}
                            className={`bg-white/5 backdrop-blur-sm border rounded-2xl p-6 transition-all ${review.status === 'pending'
                                    ? 'border-yellow-500/30'
                                    : 'border-white/10 hover:border-[#EFA130]/30'
                                }`}
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#EFA130] to-[#d88f20] rounded-full flex items-center justify-center text-black font-bold">
                                        {review.name?.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">{review.name}</p>
                                        <p className="text-gray-500 text-sm">{review.position} at {review.company}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[review.status]}`}>
                                        {review.status}
                                    </span>
                                    {review.isFeatured && (
                                        <span className="px-2 py-1 bg-[#EFA130]/20 text-[#EFA130] rounded-full text-xs font-medium">
                                            Featured
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Rating */}
                            <div className="flex items-center gap-1 mb-3">
                                {renderStars(review.rating || 0)}
                            </div>

                            {/* Content */}
                            <p className="text-gray-400 text-sm mb-4 line-clamp-3">"{review.content}"</p>

                            {/* Actions */}
                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                <div className="flex gap-1">
                                    {review.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => handleApprove(review._id)}
                                                className="p-2 bg-emerald-500/20 hover:bg-emerald-500/30 rounded-lg transition-colors"
                                                title="Approve"
                                            >
                                                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleReject(review._id)}
                                                className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                                                title="Reject"
                                            >
                                                <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </>
                                    )}
                                    <button
                                        onClick={() => handleToggleFeatured(review._id)}
                                        className={`p-2 rounded-lg transition-colors ${review.isFeatured
                                                ? 'bg-[#EFA130]/20 text-[#EFA130]'
                                                : 'hover:bg-white/10 text-gray-400'
                                            }`}
                                        title={review.isFeatured ? 'Remove featured' : 'Make featured'}
                                    >
                                        <svg className="w-4 h-4" fill={review.isFeatured ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => { setEditingReview(review); setShowModal(true); }}
                                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400"
                                        title="Edit"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(review._id)}
                                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400"
                                        title="Delete"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                                <span className="text-gray-500 text-xs">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <ReviewModal
                    review={editingReview}
                    onClose={() => { setShowModal(false); setEditingReview(null); }}
                    onSave={handleSave}
                />
            )}
        </AdminLayout>
    )
}

function ReviewModal({ review, onClose, onSave }: { review?: any; onClose: () => void; onSave: (data: any) => void }) {
    const [formData, setFormData] = useState({
        name: review?.name || '',
        position: review?.position || '',
        company: review?.company || '',
        content: review?.content || '',
        rating: review?.rating || 5,
        status: review?.status || 'pending',
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave(formData)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-[#1a1a1a] border-b border-white/10 p-6 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">{review ? 'Edit Review' : 'Add Review'}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#EFA130]/50"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Position</label>
                            <input
                                type="text"
                                value={formData.position}
                                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#EFA130]/50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Company</label>
                            <input
                                type="text"
                                value={formData.company}
                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#EFA130]/50"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Rating</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, rating: star })}
                                    className="p-1"
                                >
                                    <svg
                                        className={`w-8 h-8 ${star <= formData.rating ? 'text-[#EFA130]' : 'text-gray-600'}`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Review Content</label>
                        <textarea
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            rows={4}
                            required
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#EFA130]/50 resize-none"
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
                            {review ? 'Save Changes' : 'Add Review'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
