export interface Defect {
  id: string;
  title: string;
  location: string;
  status: 'pending' | 'completed' | 'overdue';
  severity: 'normal' | 'urgent';
  deadline: string;
  notes: string;
  photos: string[];
  createdAt: string;
  completedAt?: string;
}

export interface Project {
  id: string;
  name: string;
  owner: string;
  address: string;
  inspectionDate: string;
  defects: Defect[];
  createdAt: string;
  updatedAt: string;
}
