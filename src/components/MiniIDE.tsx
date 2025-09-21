import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import { useState } from 'react';

const starter = `function greet(name) {
  return ` + '`Hello, ${name}!`' + `;
}

console.log(greet('World'));
`;

export default function MiniIDE() {
  const [code, setCode] = useState(starter);
  const copy = async () => navigator.clipboard.writeText(code);
  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 bg-white/5">
        <div className="text-sm text-white/70">mini-ide.js</div>
        <button className="text-xs px-2 py-1 border border-white/20 rounded hover:border-emerald-300" onClick={copy}>
          Copy
        </button>
      </div>
      <CodeMirror
        value={code}
        onChange={(v) => setCode(v)}
        height="260px"
        theme={oneDark}
        extensions={[javascript({ jsx: true, typescript: true })]}
        basicSetup={{ lineNumbers: true }}
      />
    </div>
  );
}
