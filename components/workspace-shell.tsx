import { TopMenuBar } from "./top-menu-bar";
import { FooterStatusBar } from "./footer-status-bar";

export function WorkspaceShell({
  children,
  activeTab
}: {
  children: React.ReactNode;
  activeTab?: string;
}) {
  return (
    <div className="min-h-screen bg-panel text-ink">
      <TopMenuBar activeTab={activeTab} />
      <main className="mx-auto w-full max-w-[1440px] px-5 pb-20 pt-6 lg:px-10">
        {children}
      </main>
      <FooterStatusBar />
    </div>
  );
}
