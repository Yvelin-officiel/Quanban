export interface Board {
  id: number;
  title: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Column {
  id: number;
  board_id: number;
  title: string;
  position: number;
  created_at: string;
  updated_at: string;
  tasks?: Task[];
}

export interface Task {
  id: number;
  column_id: number;
  title: string;
  description?: string;
  position: number;
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  created_at: string;
  updated_at: string;
}

export interface BoardWithDetails extends Board {
  columns: Column[];
}
