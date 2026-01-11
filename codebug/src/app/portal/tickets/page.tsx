'use client'
import { useState, useEffect } from 'react'
import PortalLayout from '@/components/PortalLayout'
import Link from 'next/link'
import { ticketsAPI } from '@/lib/api'

export default function PortalTickets() {
    const [tickets, setTickets] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [filterStatus, setFilterStatus] = useState('all')
    const [showNewTicket, setShowNewTicket] = useState(false)
    const [newTicket, setNewTicket] = useState({ subject: '', category: 'general', priority: 'medium', description: '' })

    useEffect(() => {
        loadTickets()
    }, [])

    const loadTickets = async () => {
        try {
            const data = await ticketsAPI.getAll()
            setTickets(data)
        } catch (error) {
            console.error('Error loading tickets:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleCreateTicket = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await ticketsAPI.create({
                ...newTicket,
                message: newTicket.description
            })
            setShowNewTicket(false)
            setNewTicket({ subject: '', category: 'general', priority: 'medium', description: '' })
            loadTickets()
        } catch (error) {
            console.error('Error creating ticket:', error)
            alert('Failed to create ticket')
        }
    }

    const filteredTickets = tickets.filter(ticket =>
        filterStatus === 'all' || ticket.status === filterStatus
    )

    const statusColors: Record<string, string> = {
        open: 'bg-yellow-500/20 text-yellow-400',
        'in-progress': 'bg-blue-500/20 text-blue-400',
        resolved: 'bg-emerald-500/20 text-emerald-400',
        closed: 'bg-gray-500/20 text-gray-400'
    }

    const priorityColors: Record<string, string> = {
        low: 'text-gray-400',
        medium: 'text-yellow-400',
        high: 'text-red-400'
    }

    return (
        <PortalLayout
            title="Support Tickets"
            description="Get help with your projects and inquiries"
        >
            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex gap-2 overflow-x-auto pb-2 flex-1">
                    {['all', 'open', 'in-progress', 'resolved', 'closed'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${filterStatus === status
                                    ? 'bg-[#EFA130] text-black'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                        </button>
                    ))}
                </div>
                <button
                    onClick={() => setShowNewTicket(true)}
                    className="flex items-center justify-center gap-2 px-6 py-2 bg-[#EFA130] hover:bg-[#d88f20] text-black font-medium rounded-xl transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Ticket
                </button>
            </div>

            {/* Tickets List */}
            {isLoading ? (
                <div className="text-center py-20 text-gray-500">Loading tickets...</div>
            ) : filteredTickets.length === 0 ? (
                <div className="text-center py-20">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No tickets found</h3>
                    <p className="text-gray-500 mb-6">Create a new ticket if you need help</p>
                    <button
                        onClick={() => setShowNewTicket(true)}
                        className="px-6 py-3 bg-[#EFA130] hover:bg-[#d88f20] text-black font-medium rounded-xl transition-colors"
                    >
                        Create Ticket
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredTickets.map((ticket) => (
                        <Link
                            key={ticket._id}
                            href={`/portal/tickets/${ticket._id}`}
                            className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:border-[#EFA130]/30 transition-all"
                        >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${priorityColors[ticket.priority]?.replace('text-', 'bg-')}`} />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-500 text-xs">{ticket.ticketNumber}</span>
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[ticket.status]}`}>
                                            {ticket.status?.replace('-', ' ')}
                                        </span>
                                    </div>
                                    <p className="text-white font-medium truncate">{ticket.subject}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                                <span className="text-gray-500 capitalize">{ticket.category}</span>
                                <span className="text-gray-500">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                                <span className="text-gray-400 text-xs">{ticket.messages?.length || 0} messages</span>
                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* New Ticket Modal */}
            {showNewTicket && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowNewTicket(false)} />
                    <div className="relative bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-lg">
                        <div className="flex items-center justify-between p-6 border-b border-white/10">
                            <h2 className="text-xl font-bold text-white">New Support Ticket</h2>
                            <button onClick={() => setShowNewTicket(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleCreateTicket} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                                <input
                                    type="text"
                                    value={newTicket.subject}
                                    onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#EFA130]/50"
                                    placeholder="Brief description of your issue"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                                    <select
                                        value={newTicket.category}
                                        onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#EFA130]/50"
                                    >
                                        <option value="general" className="bg-[#1a1a1a]">General</option>
                                        <option value="technical" className="bg-[#1a1a1a]">Technical</option>
                                        <option value="billing" className="bg-[#1a1a1a]">Billing</option>
                                        <option value="feature-request" className="bg-[#1a1a1a]">Feature Request</option>
                                        <option value="bug-report" className="bg-[#1a1a1a]">Bug Report</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
                                    <select
                                        value={newTicket.priority}
                                        onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#EFA130]/50"
                                    >
                                        <option value="low" className="bg-[#1a1a1a]">Low</option>
                                        <option value="medium" className="bg-[#1a1a1a]">Medium</option>
                                        <option value="high" className="bg-[#1a1a1a]">High</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                                <textarea
                                    value={newTicket.description}
                                    onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                                    required
                                    rows={4}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#EFA130]/50 resize-none"
                                    placeholder="Describe your issue in detail..."
                                />
                            </div>

                            <div className="flex justify-end gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowNewTicket(false)}
                                    className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-[#EFA130] hover:bg-[#d88f20] text-black font-medium rounded-xl transition-colors"
                                >
                                    Create Ticket
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </PortalLayout>
    )
}
