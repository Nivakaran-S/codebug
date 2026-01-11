'use client'
import { useState, useEffect, useRef } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { ticketsAPI } from '@/lib/api'

export default function AdminTicketsPage() {
    const [tickets, setTickets] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [filterStatus, setFilterStatus] = useState('all')
    const [selectedTicket, setSelectedTicket] = useState<any>(null)
    const [newMessage, setNewMessage] = useState('')
    const [isSending, setIsSending] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        loadTickets()
    }, [])

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [selectedTicket?.messages])

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

    const openTicketDetail = async (ticket: any) => {
        try {
            const fullTicket = await ticketsAPI.getById(ticket._id)
            setSelectedTicket(fullTicket)
        } catch (error) {
            console.error('Error loading ticket:', error)
        }
    }

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedTicket || !newMessage.trim()) return

        setIsSending(true)
        try {
            await ticketsAPI.addMessage(selectedTicket._id, newMessage.trim())
            setNewMessage('')
            // Reload ticket to get updated messages
            const updatedTicket = await ticketsAPI.getById(selectedTicket._id)
            setSelectedTicket(updatedTicket)
            loadTickets()
        } catch (error) {
            console.error('Error sending message:', error)
            alert('Failed to send message')
        } finally {
            setIsSending(false)
        }
    }

    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            await ticketsAPI.updateStatus(id, status)
            if (selectedTicket?._id === id) {
                setSelectedTicket({ ...selectedTicket, status })
            }
            loadTickets()
        } catch (error) {
            console.error('Error updating status:', error)
        }
    }

    const filteredTickets = tickets.filter(ticket =>
        filterStatus === 'all' || ticket.status === filterStatus
    )

    const statusColors: Record<string, string> = {
        open: 'bg-blue-500/20 text-blue-400',
        'in-progress': 'bg-yellow-500/20 text-yellow-400',
        resolved: 'bg-emerald-500/20 text-emerald-400',
        closed: 'bg-gray-500/20 text-gray-400'
    }

    const priorityColors: Record<string, string> = {
        low: 'text-gray-400',
        medium: 'text-yellow-400',
        high: 'text-orange-400',
        urgent: 'text-red-400'
    }

    const formatDate = (date: string) => {
        return new Date(date).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <AdminLayout
            title="Support Tickets"
            description="Respond to customer support requests"
        >
            <div className="flex h-[calc(100vh-200px)] gap-6">
                {/* Tickets List */}
                <div className="w-full lg:w-1/3 flex flex-col">
                    {/* Filters */}
                    <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                        {['all', 'open', 'in-progress', 'resolved', 'closed'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${filterStatus === status
                                    ? 'bg-[#EFA130] text-black'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                    }`}
                            >
                                {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                            </button>
                        ))}
                    </div>

                    {/* Tickets */}
                    <div className="flex-1 overflow-y-auto space-y-2">
                        {isLoading ? (
                            <div className="text-center py-10 text-gray-500">Loading...</div>
                        ) : filteredTickets.length === 0 ? (
                            <div className="text-center py-10 text-gray-500">No tickets found</div>
                        ) : (
                            filteredTickets.map((ticket) => (
                                <div
                                    key={ticket._id}
                                    onClick={() => openTicketDetail(ticket)}
                                    className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedTicket?._id === ticket._id
                                            ? 'bg-[#EFA130]/10 border-[#EFA130]/50'
                                            : 'bg-white/5 border-white/10 hover:border-white/30'
                                        }`}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="text-white font-medium text-sm line-clamp-1">{ticket.subject}</h3>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${statusColors[ticket.status]}`}>
                                            {ticket.status?.replace('-', ' ')}
                                        </span>
                                    </div>
                                    <p className="text-gray-400 text-xs line-clamp-2 mb-2">{ticket.description}</p>
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span>{ticket.client?.name || 'Unknown'}</span>
                                        <span className={priorityColors[ticket.priority]}>{ticket.priority}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Ticket Detail / Chat */}
                <div className="hidden lg:flex flex-1 flex-col bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                    {selectedTicket ? (
                        <>
                            {/* Header */}
                            <div className="p-4 border-b border-white/10 bg-white/5">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h2 className="text-lg font-bold text-white">{selectedTicket.subject}</h2>
                                        <p className="text-gray-500 text-sm">
                                            {selectedTicket.client?.name} • {selectedTicket.client?.email}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <select
                                            value={selectedTicket.status}
                                            onChange={(e) => handleUpdateStatus(selectedTicket._id, e.target.value)}
                                            className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#EFA130]/50"
                                        >
                                            <option value="open" className="bg-[#1a1a1a]">Open</option>
                                            <option value="in-progress" className="bg-[#1a1a1a]">In Progress</option>
                                            <option value="resolved" className="bg-[#1a1a1a]">Resolved</option>
                                            <option value="closed" className="bg-[#1a1a1a]">Closed</option>
                                        </select>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${priorityColors[selectedTicket.priority]}`}>
                                            {selectedTicket.priority} priority
                                        </span>
                                    </div>
                                </div>
                                <p className="text-gray-400 text-sm mt-3">{selectedTicket.description}</p>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {selectedTicket.messages?.map((msg: any, index: number) => (
                                    <div
                                        key={msg._id || index}
                                        className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[70%] ${msg.sender === 'admin' ? 'order-1' : ''}`}>
                                            <div
                                                className={`px-4 py-3 rounded-2xl ${msg.sender === 'admin'
                                                        ? 'bg-[#EFA130] text-black rounded-br-none'
                                                        : 'bg-white/10 text-white rounded-bl-none'
                                                    }`}
                                            >
                                                <p className="text-sm">{msg.message}</p>
                                            </div>
                                            <p className={`text-[10px] text-gray-500 mt-1 ${msg.sender === 'admin' ? 'text-right' : ''}`}>
                                                {msg.sender === 'admin' ? 'You' : selectedTicket.client?.name} • {formatDate(msg.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Message Input */}
                            <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10">
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type your response..."
                                        className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#EFA130]/50"
                                        disabled={isSending}
                                    />
                                    <button
                                        type="submit"
                                        disabled={isSending || !newMessage.trim()}
                                        className="px-6 py-3 bg-[#EFA130] hover:bg-[#d88f20] disabled:opacity-50 disabled:cursor-not-allowed text-black font-medium rounded-xl transition-colors flex items-center gap-2"
                                    >
                                        {isSending ? (
                                            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                            </svg>
                                        )}
                                        Send
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <h3 className="text-white font-medium mb-2">Select a ticket</h3>
                                <p className="text-gray-500 text-sm">Choose a ticket from the list to view and respond</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Detail Modal */}
            {selectedTicket && (
                <div className="lg:hidden fixed inset-0 z-50 bg-[#0a0a0a]">
                    <div className="flex flex-col h-full">
                        {/* Header */}
                        <div className="p-4 border-b border-white/10 bg-[#1a1a1a]">
                            <div className="flex items-center gap-3 mb-3">
                                <button
                                    onClick={() => setSelectedTicket(null)}
                                    className="p-2 hover:bg-white/10 rounded-lg"
                                >
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-white font-bold truncate">{selectedTicket.subject}</h2>
                                    <p className="text-gray-500 text-xs truncate">{selectedTicket.client?.name}</p>
                                </div>
                                <select
                                    value={selectedTicket.status}
                                    onChange={(e) => handleUpdateStatus(selectedTicket._id, e.target.value)}
                                    className="px-2 py-1 bg-white/10 border border-white/20 rounded-lg text-white text-xs focus:outline-none"
                                >
                                    <option value="open" className="bg-[#1a1a1a]">Open</option>
                                    <option value="in-progress" className="bg-[#1a1a1a]">In Progress</option>
                                    <option value="resolved" className="bg-[#1a1a1a]">Resolved</option>
                                    <option value="closed" className="bg-[#1a1a1a]">Closed</option>
                                </select>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {selectedTicket.messages?.map((msg: any, index: number) => (
                                <div
                                    key={msg._id || index}
                                    className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[80%]`}>
                                        <div
                                            className={`px-4 py-3 rounded-2xl ${msg.sender === 'admin'
                                                    ? 'bg-[#EFA130] text-black rounded-br-none'
                                                    : 'bg-white/10 text-white rounded-bl-none'
                                                }`}
                                        >
                                            <p className="text-sm">{msg.message}</p>
                                        </div>
                                        <p className={`text-[10px] text-gray-500 mt-1 ${msg.sender === 'admin' ? 'text-right' : ''}`}>
                                            {formatDate(msg.createdAt)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 bg-[#1a1a1a]">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type your response..."
                                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none"
                                    disabled={isSending}
                                />
                                <button
                                    type="submit"
                                    disabled={isSending || !newMessage.trim()}
                                    className="p-3 bg-[#EFA130] disabled:opacity-50 text-black rounded-xl"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    )
}
