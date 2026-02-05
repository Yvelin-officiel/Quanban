// Données mockées pour développement sans base de données

let mockBoards = [
  {
    id: 1,
    title: 'Projet Quanban',
    description: 'Tableau de gestion du projet',
    created_at: new Date('2026-01-15'),
    updated_at: new Date('2026-01-15')
  },
  {
    id: 2,
    title: 'Développement Personnel',
    description: 'Suivi des objectifs personnels',
    created_at: new Date('2026-01-20'),
    updated_at: new Date('2026-01-20')
  }
];

let mockColumns = [
  { id: 1, board_id: 1, title: 'À faire', position: 0, created_at: new Date(), updated_at: new Date() },
  { id: 2, board_id: 1, title: 'En cours', position: 1, created_at: new Date(), updated_at: new Date() },
  { id: 3, board_id: 1, title: 'Terminé', position: 2, created_at: new Date(), updated_at: new Date() },
  { id: 4, board_id: 2, title: 'Backlog', position: 0, created_at: new Date(), updated_at: new Date() },
  { id: 5, board_id: 2, title: 'En cours', position: 1, created_at: new Date(), updated_at: new Date() }
];

let mockTasks = [
  {
    id: 1,
    column_id: 1,
    title: 'Configurer Azure SQL Database',
    description: 'Créer et configurer la base de données Azure',
    position: 0,
    priority: 'high',
    due_date: new Date('2026-02-10'),
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 2,
    column_id: 1,
    title: 'Implémenter Blob Storage',
    description: 'Ajouter le support pour l\'upload de fichiers',
    position: 1,
    priority: 'high',
    due_date: new Date('2026-02-12'),
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 3,
    column_id: 2,
    title: 'Créer les templates Bicep',
    description: 'IaC pour déploiement automatisé',
    position: 0,
    priority: 'medium',
    due_date: null,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 4,
    column_id: 3,
    title: 'Setup Backend API',
    description: 'API REST Node.js avec Express',
    position: 0,
    priority: 'low',
    due_date: null,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 5,
    column_id: 3,
    title: 'Setup Frontend React',
    description: 'Interface utilisateur avec React + Vite',
    position: 1,
    priority: 'low',
    due_date: null,
    created_at: new Date(),
    updated_at: new Date()
  }
];

let nextBoardId = 3;
let nextColumnId = 6;
let nextTaskId = 6;

export const mockData = {
  boards: {
    getAll: () => [...mockBoards],
    getById: (id) => mockBoards.find(b => b.id === parseInt(id)),
    create: (data) => {
      const newBoard = {
        id: nextBoardId++,
        ...data,
        created_at: new Date(),
        updated_at: new Date()
      };
      mockBoards.push(newBoard);
      return newBoard;
    },
    update: (id, data) => {
      const index = mockBoards.findIndex(b => b.id === parseInt(id));
      if (index === -1) return null;
      mockBoards[index] = {
        ...mockBoards[index],
        ...data,
        id: parseInt(id),
        updated_at: new Date()
      };
      return mockBoards[index];
    },
    delete: (id) => {
      const index = mockBoards.findIndex(b => b.id === parseInt(id));
      if (index === -1) return false;
      mockBoards.splice(index, 1);
      // Supprimer aussi les colonnes et tâches associées
      mockColumns = mockColumns.filter(c => c.board_id !== parseInt(id));
      const columnIds = mockColumns.filter(c => c.board_id === parseInt(id)).map(c => c.id);
      mockTasks = mockTasks.filter(t => !columnIds.includes(t.column_id));
      return true;
    }
  },

  columns: {
    getByBoardId: (boardId) => mockColumns.filter(c => c.board_id === parseInt(boardId)),
    getById: (id) => mockColumns.find(c => c.id === parseInt(id)),
    create: (data) => {
      const newColumn = {
        id: nextColumnId++,
        ...data,
        created_at: new Date(),
        updated_at: new Date()
      };
      mockColumns.push(newColumn);
      return newColumn;
    },
    update: (id, data) => {
      const index = mockColumns.findIndex(c => c.id === parseInt(id));
      if (index === -1) return null;
      mockColumns[index] = {
        ...mockColumns[index],
        ...data,
        id: parseInt(id),
        updated_at: new Date()
      };
      return mockColumns[index];
    },
    delete: (id) => {
      const index = mockColumns.findIndex(c => c.id === parseInt(id));
      if (index === -1) return false;
      mockColumns.splice(index, 1);
      // Supprimer aussi les tâches associées
      mockTasks = mockTasks.filter(t => t.column_id !== parseInt(id));
      return true;
    }
  },

  tasks: {
    getByColumnId: (columnId) => mockTasks.filter(t => t.column_id === parseInt(columnId)),
    getByBoardId: (boardId) => {
      const columnIds = mockColumns.filter(c => c.board_id === parseInt(boardId)).map(c => c.id);
      return mockTasks.filter(t => columnIds.includes(t.column_id));
    },
    getById: (id) => mockTasks.find(t => t.id === parseInt(id)),
    create: (data) => {
      const newTask = {
        id: nextTaskId++,
        ...data,
        priority: data.priority || 'medium',
        created_at: new Date(),
        updated_at: new Date()
      };
      mockTasks.push(newTask);
      return newTask;
    },
    update: (id, data) => {
      const index = mockTasks.findIndex(t => t.id === parseInt(id));
      if (index === -1) return null;
      mockTasks[index] = {
        ...mockTasks[index],
        ...data,
        id: parseInt(id),
        updated_at: new Date()
      };
      return mockTasks[index];
    },
    delete: (id) => {
      const index = mockTasks.findIndex(t => t.id === parseInt(id));
      if (index === -1) return false;
      mockTasks.splice(index, 1);
      return true;
    }
  }
};
