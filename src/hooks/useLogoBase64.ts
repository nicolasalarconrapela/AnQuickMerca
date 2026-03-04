import { useEffect, useState } from 'react';

// Hook that fetches /icon.svg and returns a data URL (svg encoded) to use as image src
export function useLogoBase64() {
  const [logoSrc, setLogoSrc] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch('/icon.svg');
        if (!res.ok) throw new Error('Logo fetch failed');
        const text = await res.text();
        // Use UTF-8 encoded data URI (encodeURIComponent keeps it safe)
        const dataUri = `data:image/svg+xml;utf8,${encodeURIComponent(text)}`;
        if (!cancelled) setLogoSrc(dataUri);
      } catch (err) {
        if (!cancelled) setLogoSrc(null);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return logoSrc;
}
