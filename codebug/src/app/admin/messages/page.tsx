'use client'
import { useState, useEffect } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { messagesAPI } from '@/lib/api'

export default function MessagesPage() {
    const [messages, setMessages] = useState<any[]>([])
    const [selectedMessage, setSelectedMessage] = useState<any | null>(null)
    const [filterStatus, setFilterStatus] = useState<string>('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [replyText, setReplyText] = useState('')

    useEffect(() => {
        loadMessages()
    }, [])

    const loadMessages = async () => {
        try {
            const data = await messagesAPI.getAll()
            setMessages(data)
        } catch (error) {
            console.error('Error loading messages:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const filteredMessages = messages.filter(message => {
        const matchesSearch = message.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            message.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            message.subject?.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = filterStatus === 'all' ||
            (filterStatus === 'unread' && !message.isRead) ||
            (filterStatus === 'read' && message.isRead) ||
            (filterStatus === 'replied' && message.isReplied) ||
            (filterStatus === 'archived' && message.isArchived)
        return matchesSearch && matchesStatus
    })

    const handleMarkAsRead = async (id: string) => {
        try {
            await messagesAPI.markAsRead(id)
            loadMessages()
        } catch (error) {
            console.error('Error marking as read:', error)
        }
    }

    const handleReply = async (id: string) => {
        if (!replyText.trim()) return
        try {
            await messagesAPI.reply(id, replyText)
            setReplyText('')
            setSelectedMessage(null)
            loadMessages()
        } catch (error) {
            console.error('Error replying:', error)
            alert('Failed to send reply')
        }
    }

    const handleArchive = async (id: string) => {
        try {
            await messagesAPI.archive(id)
            setSelectedMessage(null)
            loadMessages()
        } catch (error) {
            console.error('Error archiving:', error)
        }
    }

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this message?')) {
            try {
                await messagesAPI.delete(id)
                setSelectedMessage(null)
                loadMessages()
            } catch (error) {
                console.error('Error deleting:', error)
            }
        }
    }

    const unreadCount = messages.filter(m => !m.isRead).length

    return (
        <AdminLayout
            title="Messages"
            description="Customer inquiries and contact form submissions"
            actions={
                <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg">
                    <span className="w-2 h-2 bg-[#EFA130] rounded-full animate-pulse"></span>
                    <span className="text-white text-sm font-medium">{unreadCount} unread</span>
                </div>
            }
        >
            <div className="flex gap-6 h-[calc(100vh-200px)]">
                {/* Messages List */}
                <div className="w-full lg:w-1/2 flex flex-col">
                    {/* Filters */}
                    <div className="mb-4 space-y-4">
                        <div className="relative">
                            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search messages..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#EFA130]/50"
                            />
                        </div>
                        <div className="flex gap-2 overflow-x-auto">
                            {['all', 'unread', 'read', 'replied', 'archived'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${filterStatus === status
                                            ? 'bg-[#EFA130] text-black'
                                            : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Messages List */}
                    <div className="flex-1 overflow-y-auto space-y-2">
                        {isLoading ? (
                            <div className="text-center py-10 text-gray-500">Loading messages...</div>
                        ) : filteredMessages.length === 0 ? (
                            <div className="text-center py-10">
                                <p className="text-gray-500">No messages found</p>
                            </div>
                        ) : (
                            filteredMessages.map((message) => (
                                <div
                                    key={message._id}
                                    onClick={() => { setSelectedMessage(message); handleMarkAsRead(message._id); }}
                                    className={`p-4 rounded-xl cursor-pointer transition-all ${selectedMessage?._id === message._id
                                            ? 'bg-[#EFA130]/20 border border-[#EFA130]/30'
                                            : 'bg-white/5 border border-white/10 hover:bg-white/10'
                                        } ${!message.isRead ? 'border-l-4 border-l-[#EFA130]' : ''}`}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-[#EFA130] to-[#d88f20] rounded-full flex items-center justify-center text-black font-bold">
                                                {message.name?.charAt(0) || '?'}
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">{message.name}</p>
                                                <p className="text-gray-500 text-sm">{message.email}</p>
                                            </div>
                                        </div>
                                        <span className="text-gray-500 text-xs">
                                            {new Date(message.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-gray-400 text-sm font-medium mb-1">{message.subject}</p>
                                    <p className="text-gray-500 text-sm line-clamp-2">{message.message}</p>
                                    <div className="flex gap-2 mt-2">
                                        {message.isReplied && (
                                            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-xs">Replied</span>
                                        )}
                                        {message.isArchived && (
                                            <span className="px-2 py-0.5 bg-gray-500/20 text-gray-400 rounded text-xs">Archived</span>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Message Detail */}
                <div className="hidden lg:flex lg:w-1/2 flex-col bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
                    {selectedMessage ? (
                        <>
                            {/* Header */}
                            <div className="p-6 border-b border-white/10">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-[#EFA130] to-[#d88f20] rounded-full flex items-center justify-center text-black font-bold text-xl">
                                            {selectedMessage.name?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-white font-semibold text-lg">{selectedMessage.name}</p>
                                            <p className="text-gray-400">{selectedMessage.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleArchive(selectedMessage._id)}
                                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                            title="Archive"
                                        >
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(selectedMessage._id)}
                                            className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <h3 className="text-white font-semibold">{selectedMessage.subject}</h3>
                                <p className="text-gray-500 text-sm mt-1">
                                    {new Date(selectedMessage.createdAt).toLocaleString()}
                                </p>
                            </div>

                            {/* Message Content */}
                            <div className="flex-1 p-6 overflow-y-auto">
                                <p className="text-gray-300 whitespace-pre-wrap">{selectedMessage.message}</p>

                                {selectedMessage.replyMessage && (
                                    <div className="mt-6 p-4 bg-[#EFA130]/10 border border-[#EFA130]/20 rounded-xl">
                                        <p className="text-[#EFA130] text-sm font-medium mb-2">Your Reply:</p>
                                        <p className="text-gray-300">{selectedMessage.replyMessage}</p>
                                    </div>
                                )}
                            </div>

                            {/* Reply Box */}
                            {!selectedMessage.isReplied && (
                                <div className="p-6 border-t border-white/10">
                                    <textarea
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        placeholder="Write your reply..."
                                        rows={3}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#EFA130]/50 resize-none mb-4"
                                    />
                                    <button
                                        onClick={() => handleReply(selectedMessage._id)}
                                        disabled={!replyText.trim()}
                                        className="w-full py-3 bg-[#EFA130] hover:bg-[#d88f20] text-black font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Send Reply
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <p className="text-gray-400">Select a message to view</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    )
}
