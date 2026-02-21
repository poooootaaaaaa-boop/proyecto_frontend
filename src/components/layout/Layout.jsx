import Sidebar from "./sidebar.jsx";
import "./layout.css";

export default function Layout({ children }) {
  return (
    <div className="layout">
      <Sidebar />
      <main className="content">
        {children}
      </main>
    </div>
  );
}