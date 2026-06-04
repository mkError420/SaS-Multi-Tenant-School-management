export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800 bg-slate-950/95 px-6 py-6 text-sm text-slate-400 backdrop-blur-xl lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p>© {year} zass. Built for fast school management.</p>
        <p>Design and development by <a className="font-semibold text-slate-100 hover:text-slate-200" href="https://itsmk.netlify.app/">Mk. Rabbani</a></p>
      </div>
    </footer>
  );
}
