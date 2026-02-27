import { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import Spinner from './components/Spinner';
import ErrorMessage from './components/ErrorMessage';

interface Project {
  id: string;
  name: string;
  color: string;
}
interface Column {
  id: string;
  title: string;
  tasks: string[];
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [projRes, colRes] = await Promise.all([
          fetch('http://localhost:4000/projects'),
          fetch('http://localhost:4000/columns'),
        ]);

        if (!projRes.ok || !colRes.ok) {
          throw new Error('Erreur réseau');
        }

        const projData = await projRes.json();
        const colData = await colRes.json();

        setProjects(projData);
        setColumns(colData);
      } catch (err) {
        setError('Impossible de charger les données. Vérifiez que json-server est lancé sur le port 4000.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header title="TaskFlow" onMenuClick={() => setSidebarOpen(prev => !prev)} />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar projects={projects} isOpen={sidebarOpen} />
        <MainContent columns={columns} />
      </div>
    </div>
  );
}