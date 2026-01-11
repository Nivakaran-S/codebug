'use client'
import { useState, useEffect } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { articlesAPI } from '@/lib/api'

const categoryOptions = [
    { value: 'ai', label: 'AI & Machine Learning' },
    { value: 'design', label: 'Design & UX' },
    { value: 'development', label: 'Development' },
    { value: 'blockchain', label: 'Blockchain & Web3' },
    { value: 'business', label: 'Business Insights' },
    { value: 'tutorial', label: 'Tutorial' },
]

const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
    { value: 'archived', label: 'Archived' },
]

export default function AdminArticles() {
    const [articles, setArticles] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingArticle, setEditingArticle] = useState<any>(null)
    const [filterCategory, setFilterCategory] = useState('')
    const [filterStatus, setFilterStatus] = useState('')
    const [searchQuery, setSearchQuery] = useState('')

    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
        category: 'development',
        tags: '',
        authorName: '',
        authorRole: '',
        status: 'draft',
        isFeatured: false,
    })

    useEffect(() => {
        loadArticles()
    }, [filterCategory, filterStatus, searchQuery])

    const loadArticles = async () => {
        try {
            const data = await articlesAPI.getAll({
                category: filterCategory || undefined,
                status: filterStatus || undefined,
                search: searchQuery || undefined,
            })
            setArticles(data)
        } catch (error) {
            console.error('Error loading articles:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const articleData = {
                title: formData.title,
                excerpt: formData.excerpt,
                content: formData.content,
                category: formData.category,
                tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
                author: {
                    name: formData.authorName,
                    role: formData.authorRole,
                },
                status: formData.status,
                isFeatured: formData.isFeatured,
            }

            if (editingArticle) {
                await articlesAPI.update(editingArticle._id, articleData)
            } else {
                await articlesAPI.create(articleData)
            }

            setIsModalOpen(false)
            resetForm()
            loadArticles()
        } catch (error) {
            console.error('Error saving article:', error)
            alert('Failed to save article')
        }
    }

    const handleEdit = (article: any) => {
        setEditingArticle(article)
        setFormData({
            title: article.title,
            excerpt: article.excerpt,
            content: article.content,
            category: article.category,
            tags: article.tags?.join(', ') || '',
            authorName: article.author?.name || '',
            authorRole: article.author?.role || '',
            status: article.status,
            isFeatured: article.isFeatured,
        })
        setIsModalOpen(true)
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this article?')) return
        try {
            await articlesAPI.delete(id)
            loadArticles()
        } catch (error) {
            console.error('Error deleting article:', error)
        }
    }

    const handleToggleFeatured = async (id: string) => {
        try {
            await articlesAPI.toggleFeatured(id)
            loadArticles()
        } catch (error) {
            console.error('Error toggling featured:', error)
        }
    }

    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            await articlesAPI.updateStatus(id, status)
            loadArticles()
        } catch (error) {
            console.error('Error updating status:', error)
        }
    }

    const resetForm = () => {
        setEditingArticle(null)
        setFormData({
            title: '',
            excerpt: '',
            content: '',
            category: 'development',
            tags: '',
            authorName: '',
            authorRole: '',
            status: 'draft',
            isFeatured: false,
        })
    }

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    return (
        <AdminLayout
            title="Articles"
            description="Manage blog posts and insights"
        >
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex flex-wrap gap-3">
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#EFA130]"
                    >
                        <option value="">All Categories</option>
                        {categoryOptions.map(cat => (
                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                    </select>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#EFA130]"
                    >
                        <option value="">All Status</option>
                        {statusOptions.map(s => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder="Search articles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#EFA130]"
                    />
                </div>
                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="px-4 py-2 bg-[#EFA130] hover:bg-[#d88f20] text-black font-medium rounded-lg transition-colors"
                >
                    + New Article
                </button>
            </div>

            {/* Articles List */}
            {isLoading ? (
                <div className="text-center py-20 text-gray-500">Loading articles...</div>
            ) : articles.length === 0 ? (
                <div className="text-center py-20">
                    <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No articles yet</h3>
                    <p className="text-gray-400">Create your first article to get started.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {articles.map((article) => (
                        <div
                            key={article._id}
                            className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                                        <h3 className="text-lg font-semibold text-white">{article.title}</h3>
                                        {article.isFeatured && (
                                            <span className="px-2 py-0.5 bg-[#EFA130]/20 text-[#EFA130] text-xs rounded-full">Featured</span>
                                        )}
                                        <span className={`px-2 py-0.5 text-xs rounded-full ${article.status === 'published' ? 'bg-green-500/20 text-green-400' :
                                                article.status === 'draft' ? 'bg-yellow-500/20 text-yellow-400' :
                                                    'bg-gray-500/20 text-gray-400'
                                            }`}>
                                            {article.status}
                                        </span>
                                    </div>
                                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{article.excerpt}</p>
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                        <span>{article.author?.name}</span>
                                        <span>•</span>
                                        <span>{categoryOptions.find(c => c.value === article.category)?.label}</span>
                                        <span>•</span>
                                        <span>{article.readTime} min read</span>
                                        <span>•</span>
                                        <span>{article.views || 0} views</span>
                                        <span>•</span>
                                        <span>{formatDate(article.createdAt)}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleToggleFeatured(article._id)}
                                        className={`p-2 rounded-lg transition-colors ${article.isFeatured ? 'bg-[#EFA130]/20 text-[#EFA130]' : 'bg-white/10 text-gray-400 hover:text-[#EFA130]'}`}
                                        title={article.isFeatured ? 'Remove from featured' : 'Mark as featured'}
                                    >
                                        <svg className="w-5 h-5" fill={article.isFeatured ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                        </svg>
                                    </button>
                                    {article.status !== 'published' && (
                                        <button
                                            onClick={() => handleUpdateStatus(article._id, 'published')}
                                            className="p-2 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg transition-colors"
                                            title="Publish"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleEdit(article)}
                                        className="p-2 bg-white/10 text-gray-400 hover:text-white rounded-lg transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(article._id)}
                                        className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1a1a1a] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/10">
                        <div className="p-6 border-b border-white/10">
                            <h2 className="text-xl font-semibold text-white">
                                {editingArticle ? 'Edit Article' : 'New Article'}
                            </h2>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#EFA130]"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Excerpt</label>
                                <textarea
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                    rows={2}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#EFA130]"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Content</label>
                                <textarea
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    rows={8}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#EFA130]"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#EFA130]"
                                    >
                                        {categoryOptions.map(cat => (
                                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#EFA130]"
                                    >
                                        {statusOptions.map(s => (
                                            <option key={s.value} value={s.value}>{s.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Tags (comma separated)</label>
                                <input
                                    type="text"
                                    value={formData.tags}
                                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                    placeholder="react, nextjs, tutorial"
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#EFA130]"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Author Name</label>
                                    <input
                                        type="text"
                                        value={formData.authorName}
                                        onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#EFA130]"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Author Role</label>
                                    <input
                                        type="text"
                                        value={formData.authorRole}
                                        onChange={(e) => setFormData({ ...formData, authorRole: e.target.value })}
                                        placeholder="CTO, Codebug AI"
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#EFA130]"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="featured"
                                    checked={formData.isFeatured}
                                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                                    className="w-5 h-5 rounded border-white/20 bg-white/10 text-[#EFA130] focus:ring-[#EFA130]"
                                />
                                <label htmlFor="featured" className="text-gray-400">Featured article</label>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-3 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-3 bg-[#EFA130] hover:bg-[#d88f20] text-black font-medium rounded-lg transition-colors"
                                >
                                    {editingArticle ? 'Update Article' : 'Create Article'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    )
}
