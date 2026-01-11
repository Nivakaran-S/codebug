// Admin Dashboard Types

export interface Project {
    id: string;
    title: string;
    category: 'ai' | 'design' | 'development' | 'blockchain' | 'fintech';
    entity: 'Codebug AI' | 'Codebug Studio' | 'Codebug Works' | 'Codebug Nexus';
    description: string;
    technologies: string[];
    image: string;
    status: 'draft' | 'published' | 'archived';
    stats: {
        [key: string]: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

export interface Message {
    id: string;
    senderName: string;
    senderEmail: string;
    subject: string;
    message: string;
    status: 'unread' | 'read' | 'replied' | 'archived';
    priority: 'low' | 'medium' | 'high';
    createdAt: Date;
    repliedAt?: Date;
}

export interface CaseStudy {
    id: string;
    title: string;
    client: string;
    industry: string;
    challenge: string;
    solution: string;
    results: string;
    testimonial?: string;
    technologies: string[];
    image: string;
    status: 'draft' | 'published';
    featured: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface Review {
    id: string;
    clientName: string;
    clientCompany: string;
    clientRole: string;
    clientAvatar?: string;
    rating: number;
    review: string;
    projectId?: string;
    status: 'pending' | 'approved' | 'rejected';
    featured: boolean;
    createdAt: Date;
}

export interface AdminStats {
    totalProjects: number;
    publishedProjects: number;
    totalMessages: number;
    unreadMessages: number;
    totalCaseStudies: number;
    publishedCaseStudies: number;
    totalReviews: number;
    pendingReviews: number;
    averageRating: number;
}

export interface AdminUser {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'editor' | 'viewer';
    avatar?: string;
}
