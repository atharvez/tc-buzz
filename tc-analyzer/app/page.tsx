'use client';

import { useState } from 'react';

interface Result {
  summary: string;
  risks: string[];
  rating: string;
}

export default function Home() {
  const [text, setText] = useState<string>('');
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const analyze = async (): Promise<void> => {
    setLoading(true);

    const res = await fetch('/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });

    const data: Result = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>📄 T&C Analyzer SaaS (TS)</h1>

      <textarea
        rows={10}
        style={{ width: '100%' }}
        placeholder="Paste Terms & Conditions..."
        onChange={(e) => setText(e.target.value)}
      />

      <button onClick={analyze} disabled={loading}>
        {loading ? 'Analyzing...' : 'Analyze'}
      </button>

      {result && (
        <>
          <h2>Summary</h2>
          <p>{result.summary}</p>

          <h2>⚠️ Risks</h2>
          <ul>
            {result.risks.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>

          <h2>📊 Rating</h2>
          <p>{result.rating}</p>
        </>
      )}
    </div>
  );
}