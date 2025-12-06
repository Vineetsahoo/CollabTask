export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'manager' | 'member';
  status: 'online' | 'away' | 'offline';
  lastSeen?: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee?: User;
  reporter: User;
  tags: string[];
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  subtasks: SubTask[];
  attachments: Attachment[];
  comments: Comment[];
  timeTracked: number; // in minutes
  estimatedTime?: number; // in minutes
  project: Project;
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  createdAt: Date;
  updatedAt?: Date;
  mentions: User[];
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedBy: User;
  uploadedAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  owner: User;
  members: User[];
  status: 'active' | 'archived' | 'completed';
  createdAt: Date;
  dueDate?: Date;
  progress: number; // 0-100
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  trigger: WorkflowTrigger;
  actions: WorkflowAction[];
  isActive: boolean;
  createdBy: User;
  createdAt: Date;
  lastTriggered?: Date;
}

export interface WorkflowTrigger {
  type: 'task_created' | 'task_updated' | 'task_completed' | 'due_date_approaching';
  conditions: Record<string, any>;
}

export interface WorkflowAction {
  type: 'assign_user' | 'send_notification' | 'update_status' | 'add_comment';
  config: Record<string, any>;
}

export interface TimeEntry {
  id: string;
  task: Task;
  user: User;
  description: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // in minutes
  isRunning: boolean;
  createdAt: Date;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  recipient: User;
  isRead: boolean;
  actionUrl?: string;
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: User;
  channel?: ChatChannel;
  timestamp: Date;
  edited?: boolean;
  editedAt?: Date;
  reactions: MessageReaction[];
  mentions: User[];
  attachments: Attachment[];
  type?: 'text' | 'image' | 'file';
  replyTo?: string;
}

export interface ChatChannel {
  id: string;
  name: string;
  description?: string;
  type: 'public' | 'private' | 'direct';
  members: User[];
  createdBy: User;
  createdAt: Date;
  lastMessage?: ChatMessage;
  avatar?: string;
  unreadCount?: number;
}

export interface MessageReaction {
  emoji: string;
  users: User[];
  count: number;
}

export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  tasksInProgress: number;
  teamProductivity: number;
  averageCompletionTime: number;
  upcomingDeadlines: Task[];
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'task_created' | 'task_completed' | 'task_assigned' | 'comment_added' | 'project_created';
  message: string;
  user: User;
  timestamp: Date;
  relatedId?: string;
}

export interface Report {
  id: string;
  name: string;
  type: 'productivity' | 'time_tracking' | 'project_progress' | 'team_performance';
  data: any;
  generatedBy: User;
  generatedAt: Date;
  dateRange: {
    start: Date;
    end: Date;
  };
}

export interface KanbanColumn {
  id: string;
  title: string;
  status: Task['status'];
  tasks: Task[];
  color: string;
  limit?: number;
}
