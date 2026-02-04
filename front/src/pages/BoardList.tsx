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

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <>
      {error && <ErrorToast message={error} onClose={() => setError(null)} />}
      <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Kanban Boards</h1>
          <button
            onClick={() => setShowNewBoard(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + New Board
          </button>
        </div>

        {showNewBoard && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Create New Board</h2>
            <input
              type="text"
              value={newBoardData.title}
              onChange={(e) => setNewBoardData({ ...newBoardData, title: e.target.value })}
              placeholder="Board title"
              className="w-full px-3 py-2 border rounded mb-3"
            />
            <textarea
              value={newBoardData.description}
              onChange={(e) => setNewBoardData({ ...newBoardData, description: e.target.value })}
              placeholder="Board description (optional)"
              className="w-full px-3 py-2 border rounded mb-3"
              rows={3}
            />
            <div className="flex gap-2">
              <button
                onClick={handleCreateBoard}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setShowNewBoard(false);
                  setNewBoardData({ title: '', description: '' });
                }}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {boards.map((board) => (
            <div key={board.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <Link to={`/board/${board.id}`}>
                <h2 className="text-xl font-bold mb-2 hover:text-blue-600">{board.title}</h2>
                {board.description && (
                  <p className="text-gray-600 text-sm mb-4">{board.description}</p>
                )}
                <p className="text-xs text-gray-400">
                  Created: {new Date(board.created_at).toLocaleDateString()}
                </p>
              </Link>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleDeleteBoard(board.id);
                }}
                className="mt-4 text-red-500 hover:text-red-700 text-sm"
              >
                Delete Board
              </button>
            </div>
          ))}
        </div>

        {boards.length === 0 && !showNewBoard && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No boards yet. Create your first board to get started!</p>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
