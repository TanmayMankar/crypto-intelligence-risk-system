const AuthLayout = ({ children }) => (
  <div className="min-h-screen bg-slate-100 px-4 py-8">
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        {children}
      </div>
    </div>
  </div>
);

export default AuthLayout;
