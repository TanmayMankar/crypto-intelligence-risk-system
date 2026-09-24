const Loader = ({ text = "Loading..." }) => (
  <div className="flex min-h-[200px] items-center justify-center">
    <div className="flex items-center gap-3 text-slate-600">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-sky-600" />
      <span className="text-sm font-medium">{text}</span>
    </div>
  </div>
);

export default Loader;
