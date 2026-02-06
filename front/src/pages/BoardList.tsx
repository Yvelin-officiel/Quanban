import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { boardService } from '../services/api';
import { Board } from '../types/kanban';
import ErrorToast from '../components/ErrorToast';

export default function BoardList() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewBoard, setShowNewBoard] = useState(false);
  const [newBoardData, setNewBoardData] = useState({ title: '', description: '' });
  const [editingBoard, setEditingBoard] = useState<Board | null>(null);
  const [editBoardData, setEditBoardData] = useState({ title: '', description: '' });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBoards();
  }, []);

  const loadBoards = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await boardService.getAll();
      setBoards(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load boards';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBoard = async () => {
    if (!newBoardData.title.trim()) return;

    try {
      setError(null);
      await boardService.create(newBoardData);
      setNewBoardData({ title: '', description: '' });
      setShowNewBoard(false);
      loadBoards();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create board';
      setError(message);
    }
  };

  const handleDeleteBoard = async (id: number) => {
    if (!confirm('Are you sure you want to delete this board?')) return;

    try {
      setError(null);
      await boardService.delete(id);
      loadBoards();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete board';
      setError(message);
    }
  };

  const handleEditBoard = (board: Board) => {
    setEditingBoard(board);
    setEditBoardData({ title: board.title, description: board.description || '' });
  };

  const handleUpdateBoard = async () => {
    if (!editBoardData.title.trim() || !editingBoard) return;

    try {
      setError(null);
      await boardService.update(editingBoard.id, editBoardData);
      setEditingBoard(null);
      setEditBoardData({ title: '', description: '' });
      loadBoards();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update board';
      setError(message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading boards...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {error && <ErrorToast message={error} onClose={() => setError(null)} />}
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-10 animate-fade-in">
            <div>
              <h1 className="text-4xl font-bold text-slate-800 mb-2">My Boards</h1>
              <p className="text-slate-500">Organize your work efficiently</p>
            </div>
            <button
              onClick={() => setShowNewBoard(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              + New Board
            </button>
          </div>

          {showNewBoard && (
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-slate-200 animate-scale-in">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Create New Board</h2>
              <input
                type="text"
                value={newBoardData.title}
                onChange={(e) => setNewBoardData({ ...newBoardData, title: e.target.value })}
                placeholder="Board title"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <textarea
                value={newBoardData.description}
                onChange={(e) => setNewBoardData({ ...newBoardData, description: e.target.value })}
                placeholder="Board description (optional)"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                rows={3}
              />
              <div className="flex gap-3">
                <button
                  onClick={handleCreateBoard}
                  className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200"
                >
                  Create
                </button>
                <button
                  onClick={() => {
                    setShowNewBoard(false);
                    setNewBoardData({ title: '', description: '' });
                  }}
                  className="flex-1 bg-slate-200 text-slate-700 px-6 py-3 rounded-lg font-medium hover:bg-slate-300 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {editingBoard && (
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-blue-300 animate-scale-in">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Edit Board</h2>
              <input
                type="text"
                value={editBoardData.title}
                onChange={(e) => setEditBoardData({ ...editBoardData, title: e.target.value })}
                placeholder="Board title"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <textarea
                value={editBoardData.description}
                onChange={(e) => setEditBoardData({ ...editBoardData, description: e.target.value })}
                placeholder="Board description (optional)"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                rows={3}
              />
              <div className="flex gap-3">
                <button
                  onClick={handleUpdateBoard}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  Update
                </button>
                <button
                  onClick={() => {
                    setEditingBoard(null);
                    setEditBoardData({ title: '', description: '' });
                  }}
                  className="flex-1 bg-slate-200 text-slate-700 px-6 py-3 rounded-lg font-medium hover:bg-slate-300 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {boards.map((board, index) => (
              <div
                key={board.id}
                className="bg-white rounded-xl p-6 border border-slate-200 hover:border-blue-400 transition-all duration-300 hover:shadow-xl card-shadow animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <Link to={`/board/${board.id}`} className="block">
                  <div className="mb-4">
                    <h2 className="text-xl font-bold text-slate-800 mb-2 hover:text-blue-600 transition-colors">{board.title}</h2>
                    {board.description && (
                      <p className="text-slate-600 text-sm line-clamp-2">{board.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{new Date(board.created_at).toLocaleDateString()}</span>
                  </div>
                </Link>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleEditBoard(board);
                    }}
                    className="flex-1 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-200 font-medium text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleDeleteBoard(board.id);
                    }}
                    className="flex-1 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-200 font-medium text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {boards.length === 0 && !showNewBoard && (
            <div className="text-center py-20 animate-fade-in">
              <div className="text-slate-300 mb-6">
                <svg className="w-32 h-32 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-xl text-slate-600 font-semibold mb-2">No boards yet</p>
              <p className="text-slate-500">Create your first board to get started!</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
