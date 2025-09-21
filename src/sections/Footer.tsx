export default function Footer() {
  return (
    <footer className="relative container mx-auto px-6">
      <div className="absolute -top-6 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-emerald-400 blur-sm opacity-70" />
      <div className="py-10 flex items-center justify-between">
        <p className="text-white/60">© {new Date().getFullYear()} Your Name</p>
        <div className="flex gap-4">
          <a className="hover:text-cyan-300" href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
          <a className="hover:text-fuchsia-300" href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a>
          <a className="hover:text-emerald-300" href="mailto:you@example.com">Email</a>
        </div>
      </div>
    </footer>
  );
}
