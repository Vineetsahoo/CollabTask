import React, { useState } from 'react';
import { 
  Plus, 
  Play, 
  Pause, 
  Edit, 
  Trash2, 
  CheckSquare, 
  Bell,
  Calendar,
  Clock,
  AlertTriangle,
  Settings,
  Search,
  ChevronRight,
  X
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

interface Trigger {
  type: 'Task Status Change' | 'Task Creation' | 'Manual Trigger' | 'Schedule';
  condition: string;
}

interface Action {
  type: 'Assign Task' | 'Assign Reviewer' | 'Send Notification' | 'Set Due Date' | 'Create Tasks' | 'Schedule Meeting';
  target: string;
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  active: boolean;
  triggers: Trigger[];
  actions: Action[];
}

interface UsersProps {
  className?: string;
  size?: number;
}

interface WorkflowFormData {
  name: string;
  description: string;
  triggers: Trigger[];
  actions: Action[];
}

const Workflows: React.FC = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: 'w1',
      name: 'Bug Fix Process',
      description: 'Automated workflow for bug reporting, fixing, and verification',
      active: true,
      triggers: [
        { type: 'Task Status Change', condition: 'When task status changes to "In Review"' }
      ],
      actions: [
        { type: 'Assign Task', target: 'QA Team' },
        { type: 'Send Notification', target: 'Task Creator' }
      ]
    },
    {
      id: 'w2',
      name: 'Content Approval',
      description: 'Content creation, review, and publishing workflow',
      active: true,
      triggers: [
        { type: 'Task Creation', condition: 'When task is created in "Content" project' }
      ],
      actions: [
        { type: 'Assign Reviewer', target: 'Content Manager' },
        { type: 'Set Due Date', target: '3 days from creation' }
      ]
    },
    {
      id: 'w3',
      name: 'Onboarding Process',
      description: 'New employee onboarding task sequence',
      active: false,
      triggers: [
        { type: 'Manual Trigger', condition: 'Started manually by HR' }
      ],
      actions: [
        { type: 'Create Tasks', target: 'HR Checklist' },
        { type: 'Create Tasks', target: 'IT Setup' },
        { type: 'Schedule Meeting', target: 'Team Introduction' }
      ]
    },
    {
      id: 'w4',
      name: 'Sprint Planning',
      description: 'Automated sprint planning and task assignment',
      active: true,
      triggers: [
        { type: 'Schedule', condition: 'Every 2 weeks on Monday' }
      ],
      actions: [
        { type: 'Create Tasks', target: 'Sprint Planning Meeting' },
        { type: 'Create Tasks', target: 'Backlog Refinement' },
        { type: 'Send Notification', target: 'All Team Members' }
      ]
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showNewWorkflow, setShowNewWorkflow] = useState(false);
  const [newWorkflow, setNewWorkflow] = useState<WorkflowFormData>({
    name: '',
    description: '',
    triggers: [],
    actions: []
  });
  const [editingWorkflow, setEditingWorkflow] = useState<Workflow | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Enhanced search and filter functionality
  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workflow.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = activeFilter === 'all' ? true :
      activeFilter === 'active' ? workflow.active :
      !workflow.active;

    return matchesSearch && matchesFilter;
  });


  // Handle edit workflow
  const handleEditWorkflow = (workflow: Workflow) => {
    setEditingWorkflow(workflow);
    setShowNewWorkflow(true);
    setNewWorkflow({
      name: workflow.name,
      description: workflow.description,
      triggers: workflow.triggers,
      actions: workflow.actions
    });
  };

  // Handle delete workflow
  const handleDeleteWorkflow = (workflowId: string) => {
    setIsDeleting(workflowId);
    const confirmDelete = window.confirm('Are you sure you want to delete this workflow?');
    if (confirmDelete) {
      setWorkflows(workflows.filter(w => w.id !== workflowId));
      toast.success('Workflow deleted successfully');
    }
    setIsDeleting(null);
  };

  // Handle save workflow (create/edit)
  const handleSaveWorkflow = () => {
    if (!newWorkflow.name || !newWorkflow.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingWorkflow) {
      // Update existing workflow
      setWorkflows(workflows.map(w =>
        w.id === editingWorkflow.id ? {
          ...w,
          name: newWorkflow.name,
          description: newWorkflow.description,
          triggers: newWorkflow.triggers,
          actions: newWorkflow.actions
        } : w
      ));
      toast.success('Workflow updated successfully');
    } else {
      // Create new workflow
      const newId = `w${workflows.length + 1}`;
      setWorkflows([...workflows, {
        id: newId,
        ...newWorkflow,
        active: true
      }]);
      toast.success('Workflow created successfully');
    }

    // Reset form
    setNewWorkflow({
      name: '',
      description: '',
      triggers: [],
      actions: []
    });
    setEditingWorkflow(null);
    setShowNewWorkflow(false);
  };

  const toggleWorkflowStatus = (workflowId: string): void => {
    setWorkflows(workflows.map(workflow => 
      workflow.id === workflowId ? { ...workflow, active: !workflow.active } : workflow
    ));
  };

  const getTriggerIcon = (type: Trigger['type']): JSX.Element => {
    switch (type) {
      case 'Task Status Change':
        return <CheckSquare className="h-5 w-5 text-indigo-500" />;
      case 'Task Creation':
        return <Plus className="h-5 w-5 text-green-500" />;
      case 'Manual Trigger':
        return <Play className="h-5 w-5 text-blue-500" />;
      case 'Schedule':
        return <Calendar className="h-5 w-5 text-purple-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getActionIcon = (type: Action['type']): JSX.Element => {
    switch (type) {
      case 'Assign Task':
      case 'Assign Reviewer':
        return <Users className="h-5 w-5 text-indigo-500" />;
      case 'Send Notification':
        return <Bell className="h-5 w-5 text-red-500" />;
      case 'Set Due Date':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'Create Tasks':
        return <CheckSquare className="h-5 w-5 text-green-500" />;
      case 'Schedule Meeting':
        return <Calendar className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  // Settings panel content
  const SettingsPanel = () => (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-xl p-4 sm:p-6 z-50 overflow-y-auto"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Workflow Settings</h2>
        <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-gray-100 rounded-full">
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="space-y-4">
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-2">Default Triggers</label>
          <select className="w-full rounded-lg border border-gray-200 p-2 text-sm">
            <option>Task Status Change</option>
            <option>Task Creation</option>
            <option>Manual Trigger</option>
          </select>
        </div>
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-2">Notifications</label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input type="checkbox" className="rounded text-blue-500 mr-2" />
              <span className="text-sm">Email notifications</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="rounded text-blue-500 mr-2" />
              <span className="text-sm">In-app notifications</span>
            </label>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // New Workflow Modal
  const NewWorkflowModal = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div className="bg-white rounded-2xl p-4 sm:p-6 w-full max-w-[600px] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold">
            {editingWorkflow ? 'Edit Workflow' : 'Create New Workflow'}
          </h2>
          <button 
            onClick={() => {
              setShowNewWorkflow(false);
              setEditingWorkflow(null);
            }} 
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={newWorkflow.name}
              onChange={e => setNewWorkflow({ ...newWorkflow, name: e.target.value })}
              className="w-full rounded-lg border border-gray-200 p-2 text-sm"
              placeholder="Enter workflow name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={newWorkflow.description}
              onChange={e => setNewWorkflow({ ...newWorkflow, description: e.target.value })}
              className="w-full rounded-lg border border-gray-200 p-2 text-sm"
              placeholder="Enter workflow description"
              rows={3}
            />
          </div>
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-3 mt-6">
            <button
              onClick={() => {
                setShowNewWorkflow(false);
                setEditingWorkflow(null);
              }}
              className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg w-full sm:w-auto text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveWorkflow}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 w-full sm:w-auto mb-2 sm:mb-0 text-sm"
            >
              {editingWorkflow ? 'Save Changes' : 'Create Workflow'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 py-6 sm:py-8 px-4 sm:px-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Workflows</h1>
          <div className="mt-2 flex items-center text-sm text-gray-600">
            <Bell className="h-4 w-4 mr-2 text-green-500" />
            <span>{workflows.filter(w => w.active).length} active workflows</span>
            <span className="mx-2">•</span>
            <span>{workflows.length} total</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-grow sm:flex-grow-0">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search workflows..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button 
              onClick={() => setShowSettings(true)}
              className="inline-flex items-center px-3 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 transition-colors flex-1 sm:flex-auto justify-center"
              title="Workflow Settings"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </button>
            <button 
              onClick={() => {
                setEditingWorkflow(null);
                setNewWorkflow({
                  name: '',
                  description: '',
                  triggers: [],
                  actions: []
                });
                setShowNewWorkflow(true);
              }}
              className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors flex-1 sm:flex-auto justify-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Workflow
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex items-center overflow-x-auto hide-scrollbar">
        <div className="flex space-x-4 pb-2">
          {['all', 'active', 'inactive'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter as 'all' | 'active' | 'inactive')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${
                activeFilter === filter
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)} Workflows
            </button>
          ))}
        </div>
      </div>

      {/* Workflows Grid */}
      <div className="grid grid-cols-1 gap-6">
        {filteredWorkflows.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
            <p className="text-gray-500">No workflows match your search criteria.</p>
          </div>
        ) : (
          filteredWorkflows.map((workflow) => (
            <div key={workflow.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 mb-6">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 sm:p-3 rounded-xl ${workflow.active ? 'bg-blue-50' : 'bg-gray-50'}`}>
                      <Play className={`h-4 sm:h-5 w-4 sm:w-5 ${workflow.active ? 'text-blue-500' : 'text-gray-400'}`} />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900">{workflow.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-500">{workflow.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 self-end sm:self-center">
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                      workflow.active ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-600'
                    }`}>
                      {workflow.active ? 'Active' : 'Inactive'}
                    </span>
                    <button 
                      onClick={() => toggleWorkflowStatus(workflow.id)}
                      className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
                      title={workflow.active ? 'Deactivate workflow' : 'Activate workflow'}
                    >
                      {workflow.active ? (
                        <Pause className="h-4 sm:h-5 w-4 sm:w-5 text-gray-500 hover:text-yellow-500" />
                      ) : (
                        <Play className="h-4 sm:h-5 w-4 sm:w-5 text-gray-500 hover:text-green-500" />
                      )}
                    </button>
                    <button 
                      onClick={() => handleEditWorkflow(workflow)}
                      className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
                      title="Edit workflow"
                    >
                      <Edit className="h-4 sm:h-5 w-4 sm:w-5 text-gray-500 hover:text-blue-500" />
                    </button>
                    <button 
                      onClick={() => handleDeleteWorkflow(workflow.id)}
                      className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
                      title="Delete workflow"
                      disabled={isDeleting === workflow.id}
                    >
                      <Trash2 className={`h-4 sm:h-5 w-4 sm:w-5 ${
                        isDeleting === workflow.id
                          ? 'text-gray-300'
                          : 'text-gray-500 hover:text-red-500'
                      }`} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {/* Triggers */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-900 flex items-center">
                      Triggers
                      <span className="ml-2 px-2 py-0.5 bg-gray-50 text-gray-600 rounded-full text-xs">
                        {workflow.triggers.length}
                      </span>
                    </h4>
                    <div className="space-y-2">
                      {workflow.triggers.map((trigger, index) => (
                        <div key={index} className="group flex items-center p-2 sm:p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                          {getTriggerIcon(trigger.type)}
                          <div className="ml-3 flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{trigger.type}</p>
                            <p className="text-xs text-gray-500 truncate">{trigger.condition}</p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-900 flex items-center">
                      Actions
                      <span className="ml-2 px-2 py-0.5 bg-gray-50 text-gray-600 rounded-full text-xs">
                        {workflow.actions.length}
                      </span>
                    </h4>
                    <div className="space-y-2">
                      {workflow.actions.map((action, index) => (
                        <div key={index} className="group flex items-center p-2 sm:p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                          {getActionIcon(action.type)}
                          <div className="ml-3 flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{action.type}</p>
                            <p className="text-xs text-gray-500 truncate">{action.target}</p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showSettings && <SettingsPanel />}
        {showNewWorkflow && <NewWorkflowModal />}
      </AnimatePresence>

      {/* Custom CSS for hiding scrollbars but allowing scroll functionality */}
      <style>
        {`
        .hide-scrollbar {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE and Edge */
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }
        `}
      </style>
    </div>
  );
};

const Users: React.FC<UsersProps> = ({ className, size = 24 }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
};

export default Workflows;