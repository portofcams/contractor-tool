"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

interface SearchResults {
  customers: { id: string; name: string; email: string | null }[];
  quotes: {
    id: string;
    quoteNumber: string;
    total: number;
    status: string;
    customer: { name: string };
  }[];
  templates: { id: string; name: string; trade: string }[];
}

export function GlobalSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.length < 2) {
      setResults(null);
      setOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
          setOpen(true);
        }
      } catch {
        // ignore
      }
    }, 250);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  function navigate(href: string) {
    setOpen(false);
    setQuery("");
    router.push(href);
  }

  const hasResults =
    results &&
    (results.customers.length > 0 ||
      results.quotes.length > 0 ||
      results.templates.length > 0);

  return (
    <div ref={ref} className="relative">
      <Input
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => results && setOpen(true)}
        className="h-8 text-sm bg-secondary border-border"
      />

      {open && results && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          {!hasResults && (
            <p className="p-3 text-sm text-muted-foreground">No results found</p>
          )}

          {results.customers.length > 0 && (
            <div>
              <p className="px-3 pt-2 pb-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Customers
              </p>
              {results.customers.map((c) => (
                <button
                  key={c.id}
                  onClick={() => navigate(`/customers/${c.id}`)}
                  className="w-full text-left px-3 py-2 hover:bg-secondary text-sm flex justify-between items-center"
                >
                  <span className="font-medium">{c.name}</span>
                  {c.email && (
                    <span className="text-xs text-muted-foreground">{c.email}</span>
                  )}
                </button>
              ))}
            </div>
          )}

          {results.quotes.length > 0 && (
            <div>
              <p className="px-3 pt-2 pb-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Quotes
              </p>
              {results.quotes.map((q) => (
                <button
                  key={q.id}
                  onClick={() => navigate(`/quotes/${q.id}`)}
                  className="w-full text-left px-3 py-2 hover:bg-secondary text-sm flex justify-between items-center"
                >
                  <div>
                    <span className="font-medium">{q.quoteNumber}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      {q.customer.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs">${q.total.toLocaleString()}</span>
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded ${
                        q.status === "accepted"
                          ? "bg-green-500/20 text-green-400"
                          : q.status === "rejected"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-primary/15 text-blue-400"
                      }`}
                    >
                      {q.status}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {results.templates.length > 0 && (
            <div>
              <p className="px-3 pt-2 pb-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Templates
              </p>
              {results.templates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => navigate("/templates")}
                  className="w-full text-left px-3 py-2 hover:bg-secondary text-sm flex justify-between items-center"
                >
                  <span className="font-medium">{t.name}</span>
                  <span className="text-xs text-muted-foreground capitalize">
                    {t.trade}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
