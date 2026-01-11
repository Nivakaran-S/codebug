'use client'
import { useState, useEffect } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { projectsAPI } from '@/lib/api'

const categoryColors: Record<string, string> = {
    ai: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    design: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    development: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    blockchain: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    fintech: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
}

const statusColors: Record<string, string> = {
    published: 'bg-emerald-500/20 text-emerald-400',
    draft: 'bg-yellow-500/20 text-yellow-400',
    archived: 'bg-gray-500/20 text-gray-400',
}

export default function ProjectsPage() {
    const [projects, setProjects] = useState<any[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [filterCategory, setFilterCategory] = useState<string>('all')
    const [filterStatus, setFilterStatus] = useState<string>('all')
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
    const [showNewModal, setShowNewModal] = useState(false)
    const [editingProject, setEditingProject] = useState<any | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        loadProjects()
    }, [])

    const loadProjects = async () => {
        try {
            const data = await projectsAPI.getAll()
            setProjects(data)
        } catch (error) {
            console.error('Error loading projects:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const filteredProjects = projects.filter(project => {
        const matchesSearch = project.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.description?.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = filterCategory === 'all' || project.category === filterCategory
        const matchesStatus = filterStatus === 'all' || project.status === filterStatus
        return matchesSearch && matchesCategory && matchesStatus
    })

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this project?')) {
            try {
                await projectsAPI.delete(id)
                loadProjects()
            } catch (error) {
                console.error('Error deleting project:', error)
            }
        }
    }

    const handleStatusChange = async (id: string, status: string) => {
        try {
            await projectsAPI.updateStatus(id, status)
            loadProjects()
        } catch (error) {
            console.error('Error updating status:', error)
        }
    }

    const handleSave = async (projectData: any) => {
        try {
            if (editingProject) {
                await projectsAPI.update(editingProject._id, projectData)
            } else {
                await projectsAPI.create(projectData)
            }
            setShowNewModal(false)
            setEditingProject(null)
            loadProjects()
        } catch (error) {
            console.error('Error saving project:', error)
            alert('Failed to save project')
        }
    }

    return (
        <AdminLayout
            title="Projects"
            description="Manage your portfolio projects"
            actions={
                <button
                    onClick={() => setShowNewModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#EFA130] hover:bg-[#d88f20] text-black font-medium rounded-lg transition-all duration-300"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="hidden sm:inline">New Project</span>
                </button>
            }
        >
            {/* Filters Bar */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 mb-6">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1">
                        <div className="relative">
                            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search projects..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#EFA130]/50 focus:border-[#EFA130]/50 transition-all"
                            />
                        </div>
                    </div>

                    {/* Category Filter */}
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#EFA130]/50"
                    >
                        <option value="all" className="bg-[#1a1a1a]">All Categories</option>
                        <option value="ai" className="bg-[#1a1a1a]">AI/ML</option>
                        <option value="design" className="bg-[#1a1a1a]">Design</option>
                        <option value="development" className="bg-[#1a1a1a]">Development</option>
                        <option value="blockchain" className="bg-[#1a1a1a]">Blockchain</option>
                        <option value="fintech" className="bg-[#1a1a1a]">FinTech</option>
                    </select>

                    {/* Status Filter */}
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#EFA130]/50"
                    >
                        <option value="all" className="bg-[#1a1a1a]">All Status</option>
                        <option value="published" className="bg-[#1a1a1a]">Published</option>
                        <option value="draft" className="bg-[#1a1a1a]">Draft</option>
                        <option value="archived" className="bg-[#1a1a1a]">Archived</option>
                    </select>

                    {/* View Toggle */}
                    <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-[#EFA130] text-black' : 'text-gray-400 hover:text-white'}`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setViewMode('table')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-[#EFA130] text-black' : 'text-gray-400 hover:text-white'}`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {isLoading ? (
                <div className="text-center py-20 text-gray-500">Loading projects...</div>
            ) : (
                <>
                    {/* Results Count */}
                    <div className="flex items-center justify-between mb-6">
                        <p className="text-gray-400 text-sm">
                            Showing <span className="text-white font-medium">{filteredProjects.length}</span> of <span className="text-white font-medium">{projects.length}</span> projects
                        </p>
                    </div>

                    {/* Projects Grid */}
                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredProjects.map((project) => (
                                <div
                                    key={project._id}
                                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-[#EFA130]/30 transition-all duration-500 group"
                                >
                                    {/* Project Header */}
                                    <div className="h-40 bg-gradient-to-br from-[#4B4B4D] to-[#2a2a2a] relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${categoryColors[project.category] || 'bg-gray-500/20 text-gray-400'}`}>
                                                {project.category?.toUpperCase()}
                                            </span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[project.status] || 'bg-gray-500/20 text-gray-400'}`}>
                                                {project.status?.charAt(0).toUpperCase() + project.status?.slice(1)}
                                            </span>
                                        </div>
                                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setEditingProject(project)}
                                                    className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
                                                >
                                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(project._id)}
                                                    className="p-2 bg-red-500/30 backdrop-blur-sm rounded-lg hover:bg-red-500/50 transition-colors"
                                                >
                                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-[#EFA130] text-xs font-medium">{project.entity}</span>
                                        </div>
                                        <h3 className="text-white font-semibold text-lg mb-2 line-clamp-1">{project.title}</h3>
                                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>

                                        {/* Technologies */}
                                        <div className="flex flex-wrap gap-1 mb-4">
                                            {project.technologies?.slice(0, 3).map((tech: string) => (
                                                <span key={tech} className="px-2 py-1 bg-white/5 rounded text-xs text-gray-400">
                                                    {tech}
                                                </span>
                                            ))}
                                            {project.technologies?.length > 3 && (
                                                <span className="px-2 py-1 bg-white/5 rounded text-xs text-gray-400">
                                                    +{project.technologies.length - 3}
                                                </span>
                                            )}
                                        </div>

                                        {/* Footer */}
                                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                            <span className="text-gray-500 text-xs">
                                                Updated {new Date(project.updatedAt).toLocaleDateString()}
                                            </span>
                                            <button
                                                onClick={() => handleStatusChange(project._id, project.status === 'published' ? 'draft' : 'published')}
                                                className="text-xs text-[#EFA130] hover:text-[#d88f20] transition-colors"
                                            >
                                                {project.status === 'published' ? 'Unpublish' : 'Publish'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* Table View */
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-white/10">
                                            <th className="text-left p-4 text-gray-400 font-medium text-sm">Project</th>
                                            <th className="text-left p-4 text-gray-400 font-medium text-sm hidden md:table-cell">Category</th>
                                            <th className="text-left p-4 text-gray-400 font-medium text-sm hidden lg:table-cell">Entity</th>
                                            <th className="text-left p-4 text-gray-400 font-medium text-sm">Status</th>
                                            <th className="text-left p-4 text-gray-400 font-medium text-sm hidden sm:table-cell">Updated</th>
                                            <th className="text-right p-4 text-gray-400 font-medium text-sm">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredProjects.map((project) => (
                                            <tr key={project._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                <td className="p-4">
                                                    <div>
                                                        <p className="text-white font-medium">{project.title}</p>
                                                        <p className="text-gray-500 text-sm truncate max-w-xs">{project.description}</p>
                                                    </div>
                                                </td>
                                                <td className="p-4 hidden md:table-cell">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${categoryColors[project.category] || 'bg-gray-500/20 text-gray-400'}`}>
                                                        {project.category}
                                                    </span>
                                                </td>
                                                <td className="p-4 hidden lg:table-cell">
                                                    <span className="text-gray-400 text-sm">{project.entity}</span>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[project.status] || 'bg-gray-500/20 text-gray-400'}`}>
                                                        {project.status}
                                                    </span>
                                                </td>
                                                <td className="p-4 hidden sm:table-cell">
                                                    <span className="text-gray-500 text-sm">{new Date(project.updatedAt).toLocaleDateString()}</span>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => setEditingProject(project)}
                                                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                                        >
                                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(project._id)}
                                                            className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                                                        >
                                                            <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {filteredProjects.length === 0 && (
                        <div className="text-center py-20">
                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">No projects found</h3>
                            <p className="text-gray-500 mb-6">Add your first project to get started</p>
                            <button
                                onClick={() => setShowNewModal(true)}
                                className="px-6 py-3 bg-[#EFA130] hover:bg-[#d88f20] text-black font-medium rounded-xl transition-colors"
                            >
                                Add Project
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* New/Edit Project Modal */}
            {(showNewModal || editingProject) && (
                <ProjectModal
                    project={editingProject}
                    onClose={() => { setShowNewModal(false); setEditingProject(null); }}
                    onSave={handleSave}
                />
            )}
        </AdminLayout>
    )
}

// Project Modal Component
function ProjectModal({ project, onClose, onSave }: { project?: any; onClose: () => void; onSave: (project: any) => void }) {
    const [formData, setFormData] = useState({
        title: project?.title || '',
        category: project?.category || 'development',
        entity: project?.entity || 'Codebug Works',
        description: project?.description || '',
        technologies: project?.technologies?.join(', ') || '',
        status: project?.status || 'draft',
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave({
            ...formData,
            technologies: formData.technologies.split(',').map((t: string) => t.trim()).filter(Boolean),
        })
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-[#1a1a1a] border-b border-white/10 p-6 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">{project ? 'Edit Project' : 'New Project'}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Project Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#EFA130]/50"
                            placeholder="Enter project title"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#EFA130]/50"
                            >
                                <option value="ai" className="bg-[#1a1a1a]">AI/ML</option>
                                <option value="design" className="bg-[#1a1a1a]">Design</option>
                                <option value="development" className="bg-[#1a1a1a]">Development</option>
                                <option value="blockchain" className="bg-[#1a1a1a]">Blockchain</option>
                                <option value="fintech" className="bg-[#1a1a1a]">FinTech</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Entity</label>
                            <select
                                value={formData.entity}
                                onChange={(e) => setFormData({ ...formData, entity: e.target.value })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#EFA130]/50"
                            >
                                <option value="Codebug AI" className="bg-[#1a1a1a]">Codebug AI</option>
                                <option value="Codebug Studio" className="bg-[#1a1a1a]">Codebug Studio</option>
                                <option value="Codebug Works" className="bg-[#1a1a1a]">Codebug Works</option>
                                <option value="Codebug Nexus" className="bg-[#1a1a1a]">Codebug Nexus</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={4}
                            required
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#EFA130]/50 resize-none"
                            placeholder="Describe the project..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Technologies (comma-separated)</label>
                        <input
                            type="text"
                            value={formData.technologies}
                            onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#EFA130]/50"
                            placeholder="React, Node.js, PostgreSQL, AWS..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                        <div className="flex gap-4">
                            {['draft', 'published', 'archived'].map((status) => (
                                <label key={status} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="status"
                                        value={status}
                                        checked={formData.status === status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="w-4 h-4 text-[#EFA130] focus:ring-[#EFA130]"
                                    />
                                    <span className="text-gray-300 capitalize">{status}</span>
                                </label>
                            ))}
                        </div>
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
                            {project ? 'Save Changes' : 'Create Project'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
