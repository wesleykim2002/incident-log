"use client";

import { useEffect, useState } from "react";
import { signInWithPopup, signOut, auth, provider } from "@/lib/firebase";
import useSWR from "swr";
import { apiFetch } from "@/lib/api";

type Incident = {
  id: number;
  type: string;
  description: string;
  summary: string | null;
  createdAt: string;
};

export default function Home() {
  const [token, setToken] = useState("");
  const [user, setUser] = useState<any>(null);

  const { data: incidents, mutate } = useSWR<Incident[]>(
    () => (token ? "/incidents" : null),
    (path) => apiFetch(path, { token })
  );

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const idToken = await firebaseUser.getIdToken();
        setToken(idToken);
      } else {
        setUser(null);
        setToken("");
      }
    });

    return () => unsubscribe();
  }, []);

  const [type, setType] = useState("");
  const [description, setDesc] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    try {
      await apiFetch("/incidents", {
        method: "POST",
        body: JSON.stringify({ type, description }),
        token,
      });
      setType("");
      setDesc("");
      mutate();
    } finally {
      setLoading(false);
    }
  }

  async function summarize(id: number) {
    await apiFetch(`/incidents/${id}/summarize`, {
      method: "POST",
      token,
    });
    mutate();
  }

  if (!user)
    return (
      <main className="flex min-h-screen items-center justify-center">
        <button
          onClick={() => signInWithPopup(auth, provider)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Sign in with Google
        </button>
      </main>
    );

  return (
    <main className="max-w-xl mx-auto p-6 space-y-8">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Incident Logger</h1>
        <button onClick={() => signOut(auth)} className="text-sm underline">
          Sign out
        </button>
      </header>

      <section className="space-y-2">
        <input
          value={type}
          onChange={(e) => setType(e.target.value)}
          placeholder="Type (e.g. fall)"
          className="border p-2 w-full"
        />
        <textarea
          value={description}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Description"
          className="border p-2 w-full min-h-[100px]"
        />
        <button
          onClick={submit}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
        >
          {loading ? "Saving…" : "Submit"}
        </button>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">My Incidents</h2>
        {incidents?.length ? (
          <ul className="space-y-4">
            {incidents.map((inc) => (
              <li key={inc.id} className="border p-3 rounded">
                <p>
                  <strong>Type:</strong> {inc.type}
                </p>
                <p>
                  <strong>Description:</strong> {inc.description}
                </p>
                <p>
                  <strong>Summary:</strong>{" "}
                  {inc.summary ?? (
                    <button
                      onClick={() => summarize(inc.id)}
                      className="text-blue-500 underline"
                    >
                      Generate summary
                    </button>
                  )}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No incidents yet.</p>
        )}
      </section>
    </main>
  );
}
