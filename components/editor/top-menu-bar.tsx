"use client";

const menuItems = ["File", "Edit", "Clip", "Sequence", "Markers", "Window", "Help"];

export function TopMenuBar() {
  return (
    <header className="workbench-topbar">
      <div className="workbench-topbar-left">
        <span className="workbench-title">STUDIO_WORKBENCH 24.1</span>
        <nav className="workbench-menu">
          {menuItems.map((item) => (
            <button key={item} type="button" className="workbench-menu-item">
              {item}
            </button>
          ))}
        </nav>
      </div>
      <div className="workbench-topbar-right">
        <span className="workbench-badge">WORKSPACE: EDITING</span>
      </div>
    </header>
  );
}
