import { useState, useEffect } from 'react';
import { useAuth } from '../features/auth/AuthContext';
import api from '../api/axios';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';
import ProjectForm from '../components/ProjectForm';
import styles from './Dashboard.module.css';
import axios from 'axios';

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

export default function Dashboard() {
  const { state: authState, dispatch } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [projRes, colRes] = await Promise.all([
          api.get('/projects'),
          api.get('/columns'),
        ]);
        setProjects(projRes.data);
        setColumns(colRes.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  async function addProject(name: string, color: string) {
    setSaving(true);
    setError(null);
    try {
      const { data } = await api.post('/projects', { name, color });
      setProjects(prev => [...prev, data]);
      setShowForm(false);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || `Erreur ${err.response?.status}`);
      } else {
        setError('Erreur inconnue');
      }
    } finally {
      setSaving(false);
    }
  }

  async function renameProject(project: Project) {
    const newName = prompt('Nouveau nom :', project.name);
    if (!newName || newName === project.name) return;
    try {
      const { data } = await api.put(`/projects/${project.id}`, { ...project, name: newName });
      setProjects(prev => prev.map(p => p.id === project.id ? data : p));
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la modification');
    }
  }

  async function deleteProject(id: string) {
    if (!confirm('Êtes-vous sûr ?')) return;
    try {
      await api.delete(`/projects/${id}`);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la suppression');
    }
  }

  if (loading) return <div className={styles.loading}>Chargement...</div>;

  return (
    <div className={styles.layout}>
      <Header
        title="TaskFlow"
        onMenuClick={() => setSidebarOpen(prev => !prev)}
        userName={authState.user?.name}
        onLogout={() => dispatch({ type: 'LOGOUT' })}
      />
      <div className={styles.body}>
        <Sidebar projects={projects} isOpen={sidebarOpen} />
        <div className={styles.content}>
          <div className={styles.toolbar}>
            {error && <div className={styles.error}>{error}</div>}
            {!showForm ? (
              <button className={styles.addBtn} onClick={() => setShowForm(true)}>
                + Nouveau projet
              </button>
            ) : (
              <ProjectForm
                submitLabel="Créer"
                onSubmit={addProject}
                onCancel={() => {
                  setShowForm(false);
                  setError(null);
                }}
                disabled={saving}
              />
            )}
          </div>
          <MainContent columns={columns} />
        </div>
      </div>
    </div>
  );
}