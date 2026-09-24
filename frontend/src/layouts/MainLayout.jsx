const MainLayout = ({ children, title, actions }) => (
  <div className="min-h-screen bg-slate-100 text-slate-900">
    <header className="border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            {title || "Dashboard"}
          </h1>
        </div>
        <div className="flex items-center gap-3">{actions}</div>
      </div>
    </header>

    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {children}
    </main>
  </div>
);

export default MainLayout;
