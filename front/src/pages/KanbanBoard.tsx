import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { boardService, columnService, taskService } from '../services/api';
import { BoardWithDetails, Column, Task } from '../types/kanban';
import ErrorToast from '../components/ErrorToast';

export default function KanbanBoard() {
  const { id } = useParams<{ id: string }>();
  const [board, setBoard] = useState<BoardWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [newTaskData, setNewTaskData] = useState<{ columnId: number | null; title: string }>({
    columnId: null,
    title: ''
  });
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTaskData, setEditTaskData] = useState({
    title: '',
    description: '',
    priority: 'medium'
  });

  useEffect(() => {
    loadBoard();
  }, [id]);

  const loadBoard = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await boardService.getWithDetails(Number(id));
      setBoard(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load board';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddColumn = async () => {
    if (!newColumnTitle.trim() || !board) return;

    try {
      setError(null);
      const position = board.columns.length;
      await columnService.create({
        board_id: board.id,
        title: newColumnTitle,
        position
      });
      setNewColumnTitle('');
      loadBoard();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create column';
      setError(message);
    }
  };

  const handleAddTask = async (columnId: number) => {
    if (!newTaskData.title.trim()) return;

    try {
      setError(null);
      const column = board?.columns.find(c => c.id === columnId);
      const position = column?.tasks?.length || 0;

      await taskService.create({
        column_id: columnId,
        title: newTaskData.title,
        position,
        priority: 'medium'
      });
      setNewTaskData({ columnId: null, title: '' });
      loadBoard();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create task';
      setError(message);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      setError(null);
      await taskService.delete(taskId);
      loadBoard();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete task';
      setError(message);
    }
  };

  const handleDeleteColumn = async (columnId: number) => {
    if (!confirm('Are you sure you want to delete this column and all its tasks?')) return;

    try {
      setError(null);
      await columnService.delete(columnId);
      loadBoard();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete column';
      setError(message);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setEditTaskData({
      title: task.title,
      description: task.description || '',
      priority: task.priority
    });
  };

  const handleUpdateTask = async () => {
    if (!editTaskData.title.trim() || !editingTask) return;

    try {
      setError(null);
      await taskService.update(editingTask.id, {
        ...editingTask,
        title: editTaskData.title,
        description: editTaskData.description,
        priority: editTaskData.priority
      });
      setEditingTask(null);
      setEditTaskData({ title: '', description: '', priority: 'medium' });
      loadBoard();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update task';
      setError(message);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading board...</p>
        </div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <p className="text-xl text-slate-600">Board not found</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {error && <ErrorToast message={error} onClose={() => setError(null)} />}
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-7xl mx-auto mb-6 animate-fade-in">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-4 font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Boards
          </Link>
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-md">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">{board.title}</h1>
            {board.description && <p className="text-slate-600">{board.description}</p>}
          </div>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-6 px-2">
          {board.columns.map((column, colIndex) => (
            <div 
              key={column.id} 
              className="bg-white rounded-xl p-5 min-w-[320px] max-w-[320px] border border-slate-200 shadow-md animate-slide-in-right"
              style={{ animationDelay: `${colIndex * 0.05}s` }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg text-slate-800">{column.title}</h2>
                <button
                  onClick={() => handleDeleteColumn(column.id)}
                  className="text-slate-400 hover:text-red-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              <div className="space-y-3 mb-4 max-h-[65vh] overflow-y-auto">
                {column.tasks?.map((task, taskIndex) => (
                  <div 
                    key={task.id} 
                    className="bg-slate-50 rounded-lg p-4 border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 group animate-scale-in"
                    style={{ animationDelay: `${(colIndex * 0.05) + (taskIndex * 0.02)}s` }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-slate-800 text-sm flex-1">{task.title}</h3>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all ml-2">
                        <button
                          onClick={() => handleEditTask(task)}
                          className="text-slate-400 hover:text-blue-600 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-slate-400 hover:text-red-600 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    {task.description && (
                      <p className="text-sm text-slate-600 mb-3 line-clamp-2">{task.description}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-3 py-1 rounded-full font-medium border ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      {task.due_date && (
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(task.due_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {newTaskData.columnId === column.id ? (
                <div className="space-y-2 animate-scale-in">
                  <input
                    type="text"
                    value={newTaskData.title}
                    onChange={(e) => setNewTaskData({ ...newTaskData, title: e.target.value })}
                    placeholder="Task title"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTask(column.id)}
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddTask(column.id)}
                      className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => setNewTaskData({ columnId: null, title: '' })}
                      className="flex-1 bg-slate-200 text-slate-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setNewTaskData({ columnId: column.id, title: '' })}
                  className="w-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-3 py-2 rounded-lg transition-colors text-sm font-medium border border-slate-200 border-dashed"
                >
                  + Add task
                </button>
              )}
            </div>
          ))}

          <div className="bg-slate-100 rounded-xl p-5 min-w-[320px] max-w-[320px] border-2 border-dashed border-slate-300 animate-fade-in">
            <input
              type="text"
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              placeholder="New column title"
              className="w-full px-3 py-2 border border-slate-300 bg-white rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              onKeyPress={(e) => e.key === 'Enter' && handleAddColumn()}
            />
            <button
              onClick={handleAddColumn}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Add Column
            </button>
          </div>
        </div>

        {editingTask && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full border border-slate-200 animate-scale-in">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Edit Task</h2>
              <input
                type="text"
                value={editTaskData.title}
                onChange={(e) => setEditTaskData({ ...editTaskData, title: e.target.value })}
                placeholder="Task title"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <textarea
                value={editTaskData.description}
                onChange={(e) => setEditTaskData({ ...editTaskData, description: e.target.value })}
                placeholder="Task description (optional)"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">Priority</label>
                <select
                  value={editTaskData.priority}
                  onChange={(e) => setEditTaskData({ ...editTaskData, priority: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleUpdateTask}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Update
                </button>
                <button
                  onClick={() => {
                    setEditingTask(null);
                    setEditTaskData({ title: '', description: '', priority: 'medium' });
                  }}
                  className="flex-1 bg-slate-200 text-slate-700 px-6 py-3 rounded-lg font-medium hover:bg-slate-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
