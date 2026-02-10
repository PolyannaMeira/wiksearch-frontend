import { useMemo, useState } from "react";

type SearchResult = {
    title: string;
    url: string;
    snippet: string;
};

type SearchResponse = {
    summary: string; // long texte
    results: SearchResult[];
};

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

function cx(...parts: Array<string | false | undefined | null>) {
    return parts.filter(Boolean).join(" ");
}

export default function App() {
    const [query, setQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const [summary, setSummary] = useState<string>("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [hasSearched, setHasSearched] = useState(false);

    const canSubmit = useMemo(() => query.trim().length > 0 && !isLoading, [query, isLoading]);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        const q = query.trim();
        if (!q) return;

        setHasSearched(true);
        setIsLoading(true);
        setErrorMsg(null);

        try {
            const url = new URL(`${API_URL}/search`);
            url.searchParams.set("q", q);

            const res = await fetch(url.toString(), {
                method: "GET",
                headers: { Accept: "application/json" },
            });

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }

            const data = (await res.json()) as Partial<SearchResponse>;

            setSummary(typeof data.summary === "string" ? data.summary : "");
            setResults(Array.isArray(data.results) ? (data.results as SearchResult[]) : []);
        } catch {
            setSummary("");
            setResults([]);
            setErrorMsg("Une erreur est survenue. Réessayez.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
  <div className="min-h-screen flex flex-col">
    <div className="mx-auto w-full max-w-3xl px-4 pb-24 pt-8 sm:pt-12">
      {/* BLOCO QUE MUDA DE POSIÇÃO (CENTRO -> TOPO) */}
      <div
        className={cx(
          "flex flex-col items-center transition-all duration-500 ease-out",
          hasSearched ? "mt-6 sm:mt-10" : "min-h-[70vh] justify-center"
        )}
      >
        {/* HEADER */}
        <header className="text-center">
          <h1 className="text-4xl font-semibold">
            <span className="text-blue-600">Wiki</span>Search
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Mini moteur de recherche Wikipédia (summary + sources)
          </p>
        </header>

        {/* Search */}
        <main className="mt-8 w-full">
          <form
            onSubmit={onSubmit}
            className="flex flex-col items-stretch gap-3 sm:flex-row sm:gap-3"
          >
            <div className="relative flex-1">
              <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-4.35-4.35m0 0A7.5 7.5 0 1 0 5.25 5.25a7.5 7.5 0 0 0 11.4 11.4Z"
                  />
                </svg>
              </span>

              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher sur Wikipédia…"
                aria-label="Rechercher"
                className={cx(
                  "w-full rounded-full border border-slate-200 bg-white py-3 pl-12 pr-12",
                  "outline-none shadow-softer",
                  "transition-all duration-200",
                  "focus:border-slate-300 focus:shadow-soft",
                  "focus:ring-2 focus:ring-blue-100"
                )}
              />

              {query.length > 0 && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full px-2 py-1 text-sm text-slate-500 hover:bg-slate-100"
                  aria-label="Effacer"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
              className={cx(
                "rounded-full px-6 py-3 font-medium",
                "shadow-softer transition",
                canSubmit
                  ? "bg-slate-900 text-white hover:opacity-90 active:opacity-80"
                  : "bg-slate-200 text-slate-500 cursor-not-allowed"
              )}
            >
              Rechercher
            </button>
          </form>

          {/* Loader / error / empty placeholder (fica perto do input) */}
          <div className="mt-6">
            {isLoading && (
              <div className="flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-softer">
                <Spinner />
                <span className="text-slate-600">Recherche en cours…</span>
              </div>
            )}

            {!isLoading && errorMsg && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800">
                {errorMsg}
              </div>
            )}

            {!isLoading && !errorMsg && !hasSearched && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-500 shadow-softer">
                Faites une recherche…
              </div>
            )}
          </div>
        </main>
      </div>

      {/* RESULTADOS (só depois da busca) */}
      {!isLoading && !errorMsg && hasSearched && (
        <div className="mt-8 space-y-6">
          {/* Résumé */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-softer">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold">Résumé</h2>
              <span className="text-xs text-slate-500">
                {results.length} source{results.length > 1 ? "s" : ""}
              </span>
            </div>

            <div className="mt-3 text-sm leading-6 text-slate-700 whitespace-pre-wrap">
              {summary ? (
                summary
              ) : (
                <span className="text-slate-500">
                  Aucun résumé disponible pour cette recherche.
                </span>
              )}
            </div>
          </section>

          {/* Sources */}
          <section>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-base font-semibold">Sources</h3>
              {query.trim() && (
                <span className="text-xs text-slate-500 truncate">
                  Requête : “{query.trim()}”
                </span>
              )}
            </div>

            {results.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-500 shadow-softer">
                Aucun résultat.
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {results.map((r, idx) => (
                  <a
                    key={`${r.url}-${idx}`}
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                    className={cx(
                      "group block rounded-2xl border border-slate-200 bg-white p-4 shadow-softer",
                      "transition hover:shadow-soft hover:-translate-y-[1px]"
                    )}
                    title={r.url}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-blue-700 group-hover:underline">
                          {r.title || r.url}
                        </div>
                        <div className="truncate text-xs text-slate-500">
                          {stripProtocol(r.url)}
                        </div>
                      </div>
                      <span className="shrink-0 text-slate-400">↗</span>
                    </div>

                    <p className="mt-3 text-sm leading-5 text-slate-700 line-clamp-2">
                      {r.snippet || "—"}
                    </p>
                  </a>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>

    {/* Footer minimal */}
    <footer className="fixed inset-x-0 bottom-0 border-t border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-3xl px-4 py-3 text-center text-xs text-slate-500">
        WikiSearch • Front-end React + TS + Tailwind @LucasDeAlmeidaMeira
      </div>
    </footer>
  </div>
);
}

function stripProtocol(url: string) {
    return url.replace(/^https?:\/\//, "");
}

function Spinner() {
    return (
        <div
            className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900"
            aria-label="Chargement"
        />
    );
}
