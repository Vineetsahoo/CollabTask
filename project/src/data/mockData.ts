import { User, Task, Project, ChatChannel, ChatMessage, TimeEntry, DashboardStats, ActivityItem, Workflow } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex@collabtask.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    role: 'admin',
    status: 'online',
  },
  {
    id: '2',
    name: 'Sarah Wilson',
    email: 'sarah@collabtask.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612400e?w=150',
    role: 'manager',
    status: 'online',
  },
  {
    id: '3',
    name: 'Mike Chen',
    email: 'mike@collabtask.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    role: 'member',
    status: 'away',
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily@collabtask.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    role: 'member',
    status: 'offline',
    lastSeen: new Date('2024-01-20T10:30:00'),
  },
  {
    id: '5',
    name: 'David Rodriguez',
    email: 'david@collabtask.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    role: 'member',
    status: 'online',
  },
];

export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Website Redesign',
    description: 'Complete overhaul of company website with modern design',
    color: '#3B82F6',
    icon: '🎨',
    owner: mockUsers[0],
    members: [mockUsers[0], mockUsers[1], mockUsers[2]],
    status: 'active',
    createdAt: new Date('2024-01-01'),
    dueDate: new Date('2024-03-15'),
    progress: 65,
  },
  {
    id: '2',
    name: 'Mobile App Development',
    description: 'Native mobile app for iOS and Android platforms',
    color: '#10B981',
    icon: '📱',
    owner: mockUsers[1],
    members: [mockUsers[1], mockUsers[2], mockUsers[3], mockUsers[4]],
    status: 'active',
    createdAt: new Date('2024-01-15'),
    dueDate: new Date('2024-05-30'),
    progress: 35,
  },
  {
    id: '3',
    name: 'Q1 Marketing Campaign',
    description: 'Comprehensive marketing strategy for Q1 product launch',
    color: '#F59E0B',
    icon: '📢',
    owner: mockUsers[1],
    members: [mockUsers[1], mockUsers[3], mockUsers[4]],
    status: 'active',
    createdAt: new Date('2024-02-01'),
    dueDate: new Date('2024-04-01'),
    progress: 80,
  },
];

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Design new homepage layout',
    description: 'Create wireframes and mockups for the new homepage design with focus on user experience and conversion optimization.',
    status: 'in-progress',
    priority: 'high',
    assignee: mockUsers[2],
    reporter: mockUsers[0],
    tags: ['design', 'frontend', 'ux'],
    dueDate: new Date('2024-02-15'),
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-25'),
    subtasks: [
      { id: '1-1', title: 'Research competitor websites', completed: true, createdAt: new Date('2024-01-20') },
      { id: '1-2', title: 'Create wireframes', completed: true, createdAt: new Date('2024-01-20') },
      { id: '1-3', title: 'Design high-fidelity mockups', completed: false, createdAt: new Date('2024-01-22') },
    ],
    attachments: [],
    comments: [],
    timeTracked: 480, // 8 hours
    estimatedTime: 600, // 10 hours
    project: mockProjects[0],
  },
  {
    id: '2',
    title: 'Implement user authentication',
    description: 'Set up secure user authentication system with JWT tokens and password encryption.',
    status: 'todo',
    priority: 'high',
    assignee: mockUsers[4],
    reporter: mockUsers[1],
    tags: ['backend', 'security', 'authentication'],
    dueDate: new Date('2024-02-20'),
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18'),
    subtasks: [
      { id: '2-1', title: 'Set up JWT configuration', completed: false, createdAt: new Date('2024-01-18') },
      { id: '2-2', title: 'Create login/register endpoints', completed: false, createdAt: new Date('2024-01-18') },
      { id: '2-3', title: 'Implement password hashing', completed: false, createdAt: new Date('2024-01-18') },
    ],
    attachments: [],
    comments: [],
    timeTracked: 0,
    estimatedTime: 720, // 12 hours
    project: mockProjects[0],
  },
  {
    id: '3',
    title: 'Create mobile app wireframes',
    description: 'Design wireframes for all major screens in the mobile application.',
    status: 'completed',
    priority: 'medium',
    assignee: mockUsers[3],
    reporter: mockUsers[1],
    tags: ['design', 'mobile', 'wireframes'],
    dueDate: new Date('2024-01-30'),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-28'),
    subtasks: [
      { id: '3-1', title: 'Login screen wireframe', completed: true, createdAt: new Date('2024-01-15') },
      { id: '3-2', title: 'Dashboard wireframe', completed: true, createdAt: new Date('2024-01-16') },
      { id: '3-3', title: 'Task list wireframe', completed: true, createdAt: new Date('2024-01-17') },
    ],
    attachments: [],
    comments: [],
    timeTracked: 360, // 6 hours
    estimatedTime: 360, // 6 hours
    project: mockProjects[1],
  },
  {
    id: '4',
    title: 'Write API documentation',
    description: 'Comprehensive documentation for all API endpoints with examples and error codes.',
    status: 'review',
    priority: 'medium',
    assignee: mockUsers[4],
    reporter: mockUsers[0],
    tags: ['documentation', 'api', 'backend'],
    dueDate: new Date('2024-02-25'),
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-02-01'),
    subtasks: [
      { id: '4-1', title: 'Document authentication endpoints', completed: true, createdAt: new Date('2024-01-22') },
      { id: '4-2', title: 'Document task management endpoints', completed: true, createdAt: new Date('2024-01-24') },
      { id: '4-3', title: 'Add examples and error codes', completed: false, createdAt: new Date('2024-01-26') },
    ],
    attachments: [],
    comments: [],
    timeTracked: 240, // 4 hours
    estimatedTime: 300, // 5 hours
    project: mockProjects[0],
  },
  {
    id: '5',
    title: 'Social media content calendar',
    description: 'Plan and create content calendar for Q1 social media marketing campaign.',
    status: 'in-progress',
    priority: 'urgent',
    assignee: mockUsers[3],
    reporter: mockUsers[1],
    tags: ['marketing', 'social media', 'content'],
    dueDate: new Date('2024-02-10'),
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-02-01'),
    subtasks: [
      { id: '5-1', title: 'Research trending topics', completed: true, createdAt: new Date('2024-01-25') },
      { id: '5-2', title: 'Create content themes', completed: false, createdAt: new Date('2024-01-26') },
      { id: '5-3', title: 'Schedule posts', completed: false, createdAt: new Date('2024-01-27') },
    ],
    attachments: [],
    comments: [],
    timeTracked: 180, // 3 hours
    estimatedTime: 420, // 7 hours
    project: mockProjects[2],
  },
];

export const mockTimeEntries: TimeEntry[] = [
  {
    id: '1',
    task: mockTasks[0],
    user: mockUsers[2],
    description: 'Working on homepage wireframes',
    startTime: new Date('2024-02-01T09:00:00'),
    endTime: new Date('2024-02-01T12:30:00'),
    duration: 210,
    isRunning: false,
    createdAt: new Date('2024-02-01T09:00:00'),
  },
  {
    id: '2',
    task: mockTasks[4],
    user: mockUsers[3],
    description: 'Research for social media content',
    startTime: new Date('2024-02-01T14:00:00'),
    endTime: new Date('2024-02-01T17:00:00'),
    duration: 180,
    isRunning: false,
    createdAt: new Date('2024-02-01T14:00:00'),
  },
  {
    id: '3',
    task: mockTasks[1],
    user: mockUsers[4],
    description: 'Setting up authentication system',
    startTime: new Date('2024-02-02T10:00:00'),
    duration: 45,
    isRunning: true,
    createdAt: new Date('2024-02-02T10:00:00'),
  },
];

export const mockChannels: ChatChannel[] = [
  {
    id: '1',
    name: 'General',
    description: 'General team discussions',
    type: 'public',
    members: mockUsers,
    createdBy: mockUsers[0],
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'Website Redesign',
    description: 'Discussions about the website redesign project',
    type: 'public',
    members: [mockUsers[0], mockUsers[1], mockUsers[2]],
    createdBy: mockUsers[0],
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '3',
    name: 'Development Team',
    description: 'Private channel for developers',
    type: 'private',
    members: [mockUsers[2], mockUsers[4]],
    createdBy: mockUsers[2],
    createdAt: new Date('2024-01-05'),
  },
];

export const mockMessages: ChatMessage[] = [
  {
    id: '1',
    content: 'Good morning everyone! Ready for another productive day? 🚀',
    sender: mockUsers[0],
    channel: mockChannels[0],
    timestamp: new Date('2024-02-02T09:00:00'),
    reactions: [
      { emoji: '👍', users: [mockUsers[1], mockUsers[2]], count: 2 },
      { emoji: '🔥', users: [mockUsers[3]], count: 1 },
    ],
    mentions: [],
    attachments: [],
  },
  {
    id: '2',
    content: 'The new homepage designs are looking fantastic! Great work @Mike Chen',
    sender: mockUsers[1],
    channel: mockChannels[1],
    timestamp: new Date('2024-02-02T10:30:00'),
    reactions: [],
    mentions: [mockUsers[2]],
    attachments: [],
  },
  {
    id: '3',
    content: 'Thanks! I\'ll have the final mockups ready by end of day.',
    sender: mockUsers[2],
    channel: mockChannels[1],
    timestamp: new Date('2024-02-02T10:32:00'),
    reactions: [
      { emoji: '💯', users: [mockUsers[1]], count: 1 },
    ],
    mentions: [],
    attachments: [],
  },
];

export const mockActivityItems: ActivityItem[] = [
  {
    id: '1',
    type: 'task_completed',
    message: 'completed "Create mobile app wireframes"',
    user: mockUsers[3],
    timestamp: new Date('2024-02-01T16:30:00'),
    relatedId: '3',
  },
  {
    id: '2',
    type: 'task_assigned',
    message: 'assigned "Social media content calendar" to Emily Davis',
    user: mockUsers[1],
    timestamp: new Date('2024-02-01T14:15:00'),
    relatedId: '5',
  },
  {
    id: '3',
    type: 'comment_added',
    message: 'commented on "Design new homepage layout"',
    user: mockUsers[0],
    timestamp: new Date('2024-02-01T11:45:00'),
    relatedId: '1',
  },
  {
    id: '4',
    type: 'task_created',
    message: 'created new task "Write API documentation"',
    user: mockUsers[0],
    timestamp: new Date('2024-01-22T09:20:00'),
    relatedId: '4',
  },
];

export const mockDashboardStats: DashboardStats = {
  totalTasks: 25,
  completedTasks: 8,
  overdueTasks: 2,
  tasksInProgress: 6,
  teamProductivity: 87,
  averageCompletionTime: 4.5,
  upcomingDeadlines: mockTasks.filter(task => 
    task.dueDate && new Date(task.dueDate) > new Date() && 
    new Date(task.dueDate).getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000
  ),
  recentActivity: mockActivityItems,
};

export const mockWorkflows: Workflow[] = [
  {
    id: 'wf1',
    name: 'Bug Fix Process',
    description: 'Automated workflow for bug reporting, fixing, and verification',
    trigger: {
      type: 'task_created',
      conditions: { project: 'bug-fixes', priority: 'high' }
    },
    actions: [
      {
        type: 'assign_user',
        config: { userId: '2', target: 'QA Team' }
      },
      {
        type: 'send_notification',
        config: { target: 'Task Creator', message: 'Bug reported and assigned' }
      }
    ],
    isActive: true,
    createdBy: mockUsers[0],
    createdAt: new Date('2024-01-15T09:00:00'),
    lastTriggered: new Date('2024-01-20T14:30:00')
  },
  {
    id: 'wf2',
    name: 'Content Approval',
    description: 'Content creation, review, and publishing workflow',
    trigger: {
      type: 'task_created',
      conditions: { project: 'content', type: 'content' }
    },
    actions: [
      {
        type: 'assign_user',
        config: { userId: '1', target: 'Content Manager' }
      },
      {
        type: 'update_status',
        config: { status: 'review', target: '3 days from creation' }
      }
    ],
    isActive: true,
    createdBy: mockUsers[1],
    createdAt: new Date('2024-01-10T11:00:00'),
    lastTriggered: new Date('2024-01-19T16:45:00')
  },
  {
    id: 'wf3',
    name: 'Sprint Planning',
    description: 'Automated sprint planning and task assignment',
    trigger: {
      type: 'due_date_approaching',
      conditions: { days: 7, sprint: true }
    },
    actions: [
      {
        type: 'send_notification',
        config: { target: 'All Team Members', message: 'Sprint planning meeting scheduled' }
      },
      {
        type: 'add_comment',
        config: { comment: 'Sprint planning tasks created', assignAll: true }
      }
    ],
    isActive: false,
    createdBy: mockUsers[0],
    createdAt: new Date('2024-01-05T08:00:00')
  }
];
