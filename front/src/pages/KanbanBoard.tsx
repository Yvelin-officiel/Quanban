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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!board) {
    return <div className="p-8">Board not found</div>;
  }

  return (
    <>
      {error && <ErrorToast message={error} onClose={() => setError(null)} />}
      <div className="min-h-screen bg-gray-100 p-6">
      <div className="mb-6">
        <Link to="/" className="text-blue-600 hover:underline">&larr; Back to Boards</Link>
        <h1 className="text-3xl font-bold mt-2">{board.title}</h1>
        {board.description && <p className="text-gray-600 mt-1">{board.description}</p>}
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {board.columns.map((column) => (
          <div key={column.id} className="bg-white rounded-lg shadow-md p-4 min-w-[300px] max-w-[300px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg">{column.title}</h2>
              <button
                onClick={() => handleDeleteColumn(column.id)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Delete
              </button>
            </div>

            <div className="space-y-2 mb-4">
              {column.tasks?.map((task) => (
                <div key={task.id} className="bg-gray-50 rounded p-3 border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-sm">{task.title}</h3>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                  {task.description && (
                    <p className="text-xs text-gray-600 mb-2">{task.description}</p>
                  )}
                  <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>

            {newTaskData.columnId === column.id ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={newTaskData.title}
                  onChange={(e) => setNewTaskData({ ...newTaskData, title: e.target.value })}
                  placeholder="Task title"
                  className="w-full px-3 py-2 border rounded text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTask(column.id)}
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddTask(column.id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setNewTaskData({ columnId: null, title: '' })}
                    className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setNewTaskData({ columnId: column.id, title: '' })}
                className="w-full text-left text-gray-600 hover:bg-gray-100 px-3 py-2 rounded text-sm"
              >
                + Add task
              </button>
            )}
          </div>
        ))}

        <div className="bg-white rounded-lg shadow-md p-4 min-w-[300px] max-w-[300px]">
          <input
            type="text"
            value={newColumnTitle}
            onChange={(e) => setNewColumnTitle(e.target.value)}
            placeholder="New column title"
            className="w-full px-3 py-2 border rounded mb-2"
            onKeyPress={(e) => e.key === 'Enter' && handleAddColumn()}
          />
          <button
            onClick={handleAddColumn}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Column
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
