import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Settings,
  Search,
  X,
  Users,
  Zap,
  BarChart3,
  Copy,
  Workflow as WorkflowIcon
} from 'lucide-react';
import { toast } from 'sonner';
import { mockWorkflows } from '../data/mockData';
import type { Workflow, WorkflowTrigger, WorkflowAction } from '../types';

const ModernWorkflows: React.FC = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>(mockWorkflows);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewWorkflow, setShowNewWorkflow] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState<Workflow | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // New form state
  const [newWorkflow, setNewWorkflow] = useState({
    name: '',
    description: '',
    trigger: { type: 'task_created' as WorkflowTrigger['type'], conditions: {} },
    actions: [] as WorkflowAction[]
  });

  // Enhanced search and filter functionality
  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workflow.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = activeFilter === 'all' ? true :
      activeFilter === 'active' ? workflow.isActive :
      !workflow.isActive;

    return matchesSearch && matchesFilter;
  });

  const handleEditWorkflow = (workflow: Workflow) => {
    setEditingWorkflow(workflow);
    setShowNewWorkflow(true);
    setNewWorkflow({
      name: workflow.name,
      description: workflow.description,
      trigger: workflow.trigger,
      actions: workflow.actions
    });
  };

  const handleDeleteWorkflow = async (workflowId: string) => {
    setIsDeleting(workflowId);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setWorkflows(workflows.filter(w => w.id !== workflowId));
    toast.success('Workflow deleted successfully');
    setIsDeleting(null);
  };

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
          trigger: newWorkflow.trigger,
          actions: newWorkflow.actions
        } : w
      ));
      toast.success('Workflow updated successfully');
    } else {
      // Create new workflow
      const newId = `wf${Date.now()}`;
      setWorkflows([...workflows, {
        id: newId,
        ...newWorkflow,
        isActive: true,
        createdBy: mockWorkflows[0].createdBy,
        createdAt: new Date()
      }]);
      toast.success('Workflow created successfully');
    }

    // Reset form
    setNewWorkflow({
      name: '',
      description: '',
      trigger: { type: 'task_created', conditions: {} },
      actions: []
    });
    setEditingWorkflow(null);
    setShowNewWorkflow(false);
  };

  const toggleWorkflowStatus = (workflowId: string): void => {
    setWorkflows(workflows.map(workflow => {
      if (workflow.id === workflowId) {
        const newStatus = !workflow.isActive;
        toast.success(`Workflow ${newStatus ? 'activated' : 'deactivated'}`);
        return { ...workflow, isActive: newStatus };
      }
      return workflow;
    }));
  };

  const duplicateWorkflow = (workflow: Workflow) => {
    const newId = `wf${Date.now()}`;
    const duplicatedWorkflow = {
      ...workflow,
      id: newId,
      name: `${workflow.name} (Copy)`,
      isActive: false,
      createdAt: new Date()
    };
    
    setWorkflows([...workflows, duplicatedWorkflow]);
    toast.success('Workflow duplicated successfully');
  };

  const getTriggerIcon = (type: WorkflowTrigger['type']): JSX.Element => {
    switch (type) {
      case 'task_created':
        return <Plus className="h-5 w-5 text-green-500" />;
      case 'task_updated':
        return <Edit className="h-5 w-5 text-blue-500" />;
      case 'task_completed':
        return <CheckSquare className="h-5 w-5 text-indigo-500" />;
      case 'due_date_approaching':
        return <Calendar className="h-5 w-5 text-purple-500" />;
      default:
        return <Zap className="h-5 w-5 text-gray-500" />;
    }
  };

  const getActionIcon = (type: WorkflowAction['type']): JSX.Element => {
    switch (type) {
      case 'assign_user':
        return <Users className="h-5 w-5 text-indigo-500" />;
      case 'send_notification':
        return <Bell className="h-5 w-5 text-red-500" />;
      case 'update_status':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'add_comment':
        return <CheckSquare className="h-5 w-5 text-green-500" />;
      default:
        return <Zap className="h-5 w-5 text-gray-500" />;
    }
  };

  // Stats calculation
  const stats = {
    total: workflows.length,
    active: workflows.filter(w => w.isActive).length,
    totalRuns: workflows.length * 5, // Mock value
    avgRuns: workflows.length > 0 ? Math.round(workflows.length * 5 / workflows.length) : 0
  };

  return (
    <div className="h-full flex flex-col bg-neutral-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-neutral-200">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-xl">
                  <WorkflowIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Workflows</h1>
                  <p className="text-sm text-gray-600">Automate your team's processes</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search workflows..."
                  className="w-full sm:w-80 pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-sm"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              
              <button 
                onClick={() => toast.info('Settings feature coming soon!')}
                className="inline-flex items-center px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 transition-colors"
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
                    trigger: { type: 'task_created', conditions: {} },
                    actions: []
                  });
                  setShowNewWorkflow(true);
                }}
                className="inline-flex items-center px-4 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Workflow
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Workflows</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <WorkflowIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Workflows</p>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <Play className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Runs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalRuns.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Runs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgRuns}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-xl">
                <Zap className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          {(['all', 'active', 'inactive'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                activeFilter === filter
                  ? 'bg-purple-100 text-purple-700 border border-purple-200'
                  : 'text-gray-600 hover:bg-gray-50 border border-transparent'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)} 
              {filter === 'all' && ` (${stats.total})`}
              {filter === 'active' && ` (${stats.active})`}
              {filter === 'inactive' && ` (${stats.total - stats.active})`}
            </button>
          ))}
        </div>

        {/* Workflows Grid */}
        <div className="grid grid-cols-1 gap-6">
          {filteredWorkflows.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <WorkflowIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No workflows found</h3>
              <p className="text-gray-500 mb-6">Get started by creating your first automated workflow.</p>
              <button 
                onClick={() => setShowNewWorkflow(true)}
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Workflow
              </button>
            </div>
          ) : (
            filteredWorkflows.map((workflow) => (
              <motion.div 
                key={workflow.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${workflow.isActive ? 'bg-green-100' : 'bg-gray-100'}`}>
                        {workflow.isActive ? (
                          <Play className="h-6 w-6 text-green-600" />
                        ) : (
                          <Pause className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{workflow.name}</h3>
                        <p className="text-sm text-gray-600">{workflow.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>Created: {new Date(workflow.createdAt).toLocaleDateString()}</span>
                          {workflow.lastTriggered && (
                            <span>Last run: {new Date(workflow.lastTriggered).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        workflow.isActive 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {workflow.isActive ? 'Active' : 'Inactive'}
                      </span>
                      
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => duplicateWorkflow(workflow)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Duplicate workflow"
                        >
                          <Copy className="h-4 w-4 text-gray-500" />
                        </button>
                        
                        <button 
                          onClick={() => toggleWorkflowStatus(workflow.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title={workflow.isActive ? 'Deactivate workflow' : 'Activate workflow'}
                        >
                          {workflow.isActive ? (
                            <Pause className="h-4 w-4 text-gray-500" />
                          ) : (
                            <Play className="h-4 w-4 text-gray-500" />
                          )}
                        </button>
                        
                        <button 
                          onClick={() => handleEditWorkflow(workflow)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit workflow"
                        >
                          <Edit className="h-4 w-4 text-gray-500" />
                        </button>
                        
                        <button 
                          onClick={() => handleDeleteWorkflow(workflow.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Delete workflow"
                          disabled={isDeleting === workflow.id}
                        >
                          <Trash2 className={`h-4 w-4 ${
                            isDeleting === workflow.id
                              ? 'text-gray-300'
                              : 'text-gray-500 hover:text-red-500'
                          }`} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Triggers */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-gray-900 flex items-center">
                        Triggers
                        <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                          1
                        </span>
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          {getTriggerIcon(workflow.trigger.type)}
                          <div className="ml-3 flex-1">
                            <p className="text-sm font-medium text-gray-900">{workflow.trigger.type.replace('_', ' ')}</p>
                            <p className="text-xs text-gray-500">Automated trigger</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-gray-900 flex items-center">
                        Actions
                        <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                          {workflow.actions.length}
                        </span>
                      </h4>
                      <div className="space-y-2">
                        {workflow.actions.map((action, index) => (
                          <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            {getActionIcon(action.type)}
                            <div className="ml-3 flex-1">
                              <p className="text-sm font-medium text-gray-900">{action.type.replace('_', ' ')}</p>
                              <p className="text-xs text-gray-500">{action.config.target}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showNewWorkflow && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">
                  {editingWorkflow ? 'Edit Workflow' : 'Create New Workflow'}
                </h2>
                <button 
                  onClick={() => {
                    setShowNewWorkflow(false);
                    setEditingWorkflow(null);
                  }} 
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
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
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter workflow name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newWorkflow.description}
                    onChange={e => setNewWorkflow({ ...newWorkflow, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter workflow description"
                    rows={3}
                  />
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={() => {
                      setShowNewWorkflow(false);
                      setEditingWorkflow(null);
                    }}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveWorkflow}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    {editingWorkflow ? 'Save Changes' : 'Create Workflow'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
};

export default ModernWorkflows;
