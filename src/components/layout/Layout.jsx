import Sidebar from "./sidebar.jsx";
import "./layout.css";

export default function Layout({ children }) {
  return (
    <div className="layout">
      <Sidebar />

      <main className="content">
        <div className="content-wrapper">
          {children}
        </div>
      </main>

    </div>
  );
}