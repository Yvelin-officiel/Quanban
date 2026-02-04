export default function About() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">About Quanban</h1>
      <p className="text-gray-700 mb-4">
        Quanban is a Kanban board application built to learn Azure SQL and cloud development.
      </p>
      <div className="bg-blue-50 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-2">Tech Stack</h2>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          <li>Backend: Node.js + Express</li>
          <li>Frontend: React + TypeScript + Tailwind CSS</li>
          <li>Database: Azure SQL Database</li>
        </ul>
      </div>
    </div>
  );
}
