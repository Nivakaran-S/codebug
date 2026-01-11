'use client'
import { useState, useEffect } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { careersAPI } from '@/lib/api'

const departmentOptions = [
    { value: 'engineering', label: 'Engineering' },
    { value: 'design', label: 'Design' },
    { value: 'ai', label: 'AI/ML' },
    { value: 'blockchain', label: 'Blockchain' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'operations', label: 'Operations' },
    { value: 'hr', label: 'HR' },
]

const typeOptions = [
    { value: 'full-time', label: 'Full-time' },
    { value: 'part-time', label: 'Part-time' },
    { value: 'contract', label: 'Contract' },
    { value: 'internship', label: 'Internship' },
    { value: 'remote', label: 'Remote' },
]

const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'open', label: 'Open' },
    { value: 'closed', label: 'Closed' },
    { value: 'filled', label: 'Filled' },
]

const experienceLevels = [
    { value: 'entry', label: 'Entry Level' },
    { value: 'mid', label: 'Mid Level' },
    { value: 'senior', label: 'Senior' },
    { value: 'lead', label: 'Lead' },
    { value: 'executive', label: 'Executive' },
]

export default function AdminCareers() {
    const [positions, setPositions] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingPosition, setEditingPosition] = useState<any>(null)
    const [filterDepartment, setFilterDepartment] = useState('')
    const [filterStatus, setFilterStatus] = useState('')
    const [searchQuery, setSearchQuery] = useState('')

    const [formData, setFormData] = useState({
        title: '',
        department: 'engineering',
        type: 'full-time',
        location: 'Remote',
        description: '',
        requirements: '',
        responsibilities: '',
        skills: '',
        experienceLevel: 'mid',
        experienceMin: '',
        status: 'draft',
        isUrgent: false,
    })

    useEffect(() => {
        loadPositions()
    }, [filterDepartment, filterStatus, searchQuery])

    const loadPositions = async () => {
        try {
            const data = await careersAPI.getAll({
                department: filterDepartment || undefined,
                status: filterStatus || undefined,
                search: searchQuery || undefined,
            })
            setPositions(data)
        } catch (error) {
            console.error('Error loading positions:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const positionData = {
                title: formData.title,
                department: formData.department,
                type: formData.type,
                location: formData.location,
                description: formData.description,
                requirements: formData.requirements.split('\n').filter(Boolean),
                responsibilities: formData.responsibilities.split('\n').filter(Boolean),
                skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
                experience: {
                    level: formData.experienceLevel,
                    min: formData.experienceMin ? parseInt(formData.experienceMin) : undefined,
                },
                status: formData.status,
                isUrgent: formData.isUrgent,
            }

            if (editingPosition) {
                await careersAPI.update(editingPosition._id, positionData)
            } else {
                await careersAPI.create(positionData)
            }

            setIsModalOpen(false)
            resetForm()
            loadPositions()
        } catch (error) {
            console.error('Error saving position:', error)
            alert('Failed to save position')
        }
    }

    const handleEdit = (position: any) => {
        setEditingPosition(position)
        setFormData({
            title: position.title,
            department: position.department,
            type: position.type,
            location: position.location,
            description: position.description,
            requirements: position.requirements?.join('\n') || '',
            responsibilities: position.responsibilities?.join('\n') || '',
            skills: position.skills?.join(', ') || '',
            experienceLevel: position.experience?.level || 'mid',
            experienceMin: position.experience?.min?.toString() || '',
            status: position.status,
            isUrgent: position.isUrgent,
        })
        setIsModalOpen(true)
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this position?')) return
        try {
            await careersAPI.delete(id)
            loadPositions()
        } catch (error) {
            console.error('Error deleting position:', error)
        }
    }

    const handleToggleUrgent = async (id: string) => {
        try {
            await careersAPI.toggleUrgent(id)
            loadPositions()
        } catch (error) {
            console.error('Error toggling urgent:', error)
        }
    }

    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            await careersAPI.updateStatus(id, status)
            loadPositions()
        } catch (error) {
            console.error('Error updating status:', error)
        }
    }

    const resetForm = () => {
        setEditingPosition(null)
        setFormData({
            title: '',
            department: 'engineering',
            type: 'full-time',
            location: 'Remote',
            description: '',
            requirements: '',
            responsibilities: '',
            skills: '',
            experienceLevel: 'mid',
            experienceMin: '',
            status: 'draft',
            isUrgent: false,
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
            title="Job Positions"
            description="Manage career opportunities and job postings"
        >
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex flex-wrap gap-3">
                    <select
                        value={filterDepartment}
                        onChange={(e) => setFilterDepartment(e.target.value)}
                        className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#EFA130]"
                    >
                        <option value="">All Departments</option>
                        {departmentOptions.map(dept => (
                            <option key={dept.value} value={dept.value}>{dept.label}</option>
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
                        placeholder="Search positions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#EFA130]"
                    />
                </div>
                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="px-4 py-2 bg-[#EFA130] hover:bg-[#d88f20] text-black font-medium rounded-lg transition-colors"
                >
                    + New Position
                </button>
            </div>

            {/* Positions List */}
            {isLoading ? (
                <div className="text-center py-20 text-gray-500">Loading positions...</div>
            ) : positions.length === 0 ? (
                <div className="text-center py-20">
                    <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No positions yet</h3>
                    <p className="text-gray-400">Create your first job position to get started.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {positions.map((position) => (
                        <div
                            key={position._id}
                            className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                                        <h3 className="text-lg font-semibold text-white">{position.title}</h3>
                                        {position.isUrgent && (
                                            <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full">Urgent</span>
                                        )}
                                        <span className={`px-2 py-0.5 text-xs rounded-full ${position.status === 'open' ? 'bg-green-500/20 text-green-400' :
                                                position.status === 'draft' ? 'bg-yellow-500/20 text-yellow-400' :
                                                    position.status === 'filled' ? 'bg-blue-500/20 text-blue-400' :
                                                        'bg-gray-500/20 text-gray-400'
                                            }`}>
                                            {position.status}
                                        </span>
                                    </div>
                                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{position.description}</p>
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                        <span>{departmentOptions.find(d => d.value === position.department)?.label}</span>
                                        <span>•</span>
                                        <span>{position.location}</span>
                                        <span>•</span>
                                        <span>{typeOptions.find(t => t.value === position.type)?.label}</span>
                                        <span>•</span>
                                        <span>{position.applicationCount || 0} applications</span>
                                        <span>•</span>
                                        <span>{formatDate(position.createdAt)}</span>
                                    </div>
                                    {position.skills?.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {position.skills.slice(0, 5).map((skill: string, i: number) => (
                                                <span key={i} className="px-2 py-1 bg-white/10 text-gray-400 text-xs rounded">
                                                    {skill}
                                                </span>
                                            ))}
                                            {position.skills.length > 5 && (
                                                <span className="px-2 py-1 bg-white/10 text-gray-400 text-xs rounded">
                                                    +{position.skills.length - 5}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleToggleUrgent(position._id)}
                                        className={`p-2 rounded-lg transition-colors ${position.isUrgent ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-gray-400 hover:text-red-400'}`}
                                        title={position.isUrgent ? 'Remove urgent' : 'Mark as urgent'}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </button>
                                    {position.status !== 'open' && (
                                        <button
                                            onClick={() => handleUpdateStatus(position._id, 'open')}
                                            className="p-2 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg transition-colors"
                                            title="Open position"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </button>
                                    )}
                                    {position.status === 'open' && (
                                        <button
                                            onClick={() => handleUpdateStatus(position._id, 'closed')}
                                            className="p-2 bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 rounded-lg transition-colors"
                                            title="Close position"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleEdit(position)}
                                        className="p-2 bg-white/10 text-gray-400 hover:text-white rounded-lg transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(position._id)}
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
                                {editingPosition ? 'Edit Position' : 'New Position'}
                            </h2>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Job Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g. Senior Full-Stack Developer"
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#EFA130]"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Department</label>
                                    <select
                                        value={formData.department}
                                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#EFA130]"
                                    >
                                        {departmentOptions.map(dept => (
                                            <option key={dept.value} value={dept.value}>{dept.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Type</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#EFA130]"
                                    >
                                        {typeOptions.map(t => (
                                            <option key={t.value} value={t.value}>{t.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Location</label>
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        placeholder="e.g. Remote (Global)"
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#EFA130]"
                                        required
                                    />
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
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Experience Level</label>
                                    <select
                                        value={formData.experienceLevel}
                                        onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#EFA130]"
                                    >
                                        {experienceLevels.map(level => (
                                            <option key={level.value} value={level.value}>{level.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Min. Years Experience</label>
                                    <input
                                        type="number"
                                        value={formData.experienceMin}
                                        onChange={(e) => setFormData({ ...formData, experienceMin: e.target.value })}
                                        placeholder="e.g. 3"
                                        min="0"
                                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#EFA130]"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#EFA130]"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Requirements (one per line)</label>
                                <textarea
                                    value={formData.requirements}
                                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                                    rows={4}
                                    placeholder="5+ years of experience in React&#10;Strong TypeScript skills&#10;Experience with Node.js"
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#EFA130]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Skills (comma separated)</label>
                                <input
                                    type="text"
                                    value={formData.skills}
                                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                                    placeholder="React, TypeScript, Node.js, PostgreSQL"
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#EFA130]"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="urgent"
                                    checked={formData.isUrgent}
                                    onChange={(e) => setFormData({ ...formData, isUrgent: e.target.checked })}
                                    className="w-5 h-5 rounded border-white/20 bg-white/10 text-[#EFA130] focus:ring-[#EFA130]"
                                />
                                <label htmlFor="urgent" className="text-gray-400">Urgent hiring</label>
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
                                    {editingPosition ? 'Update Position' : 'Create Position'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    )
}
