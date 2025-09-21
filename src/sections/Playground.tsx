import MiniIDE from '../components/MiniIDE';

export default function Playground() {
  return (
    <div className="container mx-auto px-6">
      <h2 className="text-3xl md:text-5xl font-display font-semibold">Live Code Playground</h2>
      <p className="mt-4 text-white/70">Edit code and copy snippets.</p>
      <div className="mt-6"><MiniIDE /></div>
    </div>
  );
}
