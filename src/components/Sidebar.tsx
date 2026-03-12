import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';

interface Project {
  id: string;
  name: string;
  color: string;
}

interface SidebarProps {
  projects: Project[];
  isOpen: boolean;
}

export default function Sidebar({ projects, isOpen }: SidebarProps) {
  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
      <div className={styles.header}>
        <h2 className={styles.title}>Mes Projets</h2>
        <span className={styles.count}>{projects.length}</span>
      </div>
      <nav className={styles.nav}>
        <ul className={styles.list}>
          {projects.map((project, index) => (
            <li
              key={project.id}
              className={styles.item}
              style={{ '--item-index': index } as React.CSSProperties}
            >
              <NavLink
                to={`/projects/${project.id}`}
                className={({ isActive }) =>
                  `${styles.link} ${isActive ? styles.active : ''}`
                }
              >
                <span
                  className={styles.dot}
                  style={{ backgroundColor: project.color }}
                />
                <span className={styles.name}>{project.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}