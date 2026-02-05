import { Routes, Route, Link } from 'react-router-dom';
import BoardList from './pages/BoardList';
import KanbanBoard from './pages/KanbanBoard';
import About from './pages/About';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                <span className="text-white text-xl font-bold">Q</span>
              </div>
              <span className="text-2xl font-bold text-slate-800">Quanban</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link 
                to="/" 
                className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium transition-colors duration-200"
              >
                Boards
              </Link>
              <Link 
                to="/about" 
                className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium transition-colors duration-200"
              >
                About
              </Link>
            </div>
          </div>
        </div>
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
