import { Routes, Route, Link } from 'react-router-dom';
import BoardList from './pages/BoardList';
import KanbanBoard from './pages/KanbanBoard';
import About from './pages/About';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <nav className="p-4 bg-blue-600 text-white flex gap-4 shadow-md">
        <Link to="/" className="hover:underline">Boards</Link>
        <Link to="/about" className="hover:underline">About</Link>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<BoardList />} />
          <Route path="/board/:id" element={<KanbanBoard />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </div>
  );
}
