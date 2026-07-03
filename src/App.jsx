import { useState, useEffect, createContext, useContext } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://hffecbakdonuggwyydgy.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmZmVjYmFrZG9udWdnd3l5ZGd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4NDAxMzUsImV4cCI6MjA5ODQxNjEzNX0.jIERghQ34aY7Nvx1-DoZuoP9aDDsCHKNImouzQVdLYg";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

const SYSTEM_PROMPT = `Tu es Narrativa, un moteur d'intelligence informationnelle dont la mission est de favoriser le pluralisme, la transparence et l'esprit critique. Produis UNIQUEMENT un JSON valide sans texte avant ou après :
{
  "titre": "titre court",
  "resume_factuel": "2-3 phrases factuelles",
  "niveau_certitude_global": "faible|moyen|élevé",
  "dimensions_holistiques": {
    "historique": {"couvert": true, "contenu": "...", "angle_mort": "..."},
    "politique": {"couvert": true, "contenu": "...", "angle_mort": "..."},
    "economique": {"couvert": true, "contenu": "...", "angle_mort": "..."},
    "scientifique": {"couvert": false, "contenu": "...", "angle_mort": "..."},
    "social_culturel": {"couvert": true, "contenu": "...", "angle_mort": "..."},
    "international": {"couvert": true, "contenu": "...", "angle_mort": "..."},
    "technologique": {"couvert": false, "contenu": "...", "angle_mort": "..."},
    "psychologique": {"couvert": false, "contenu": "...", "angle_mort": "..."}
  },
  "recits": [
    {
      "id": "r1",
      "nom": "Nom du récit",
      "couleur_hex": "#4A9EFF",
      "cadre": "prisme en une phrase",
      "arguments": ["arg1", "arg2", "arg3"],
      "valeurs_sous_jacentes": ["valeur1", "valeur2"],
      "orientation": {"economique":70,"societal":40,"souverainete":50,"institutionnel":65},
      "omissions_detectees": ["omission1"],
      "niveau_preuves": "faible|moyen|élevé"
    }
  ],
  "consensus": ["point commun"],
  "desaccords": [{"type":"factuel|interprétatif|axiologique","point":"sujet","detail":"explication"}],
  "mecanismes_influence": [{"type":"framing|omission|appel_emotion|faux_dilemme|cherry_picking|généralisation|biais_confirmation|homme_de_paille|corrélation_causalité|autre","description":"explication pédagogique","present_dans":"source"}],
  "questions_ouvertes": ["question"],
  "score_holisme": 6
}
Couleurs: #4A9EFF, #FF6B6B, #F5A623, #7ED321, #BD10E0, #FF9F43, #00D2D3, #54A0FF. Génère 3 à 6 récits.`;

const C = {
  bg: "#080A0F", surface: "#0E1017", border: "#1C1F2A", borderLight: "#252836",
  text: "#E2E4EC", textMuted: "#6B6F82", textDim: "#3A3D4E",
  accent: "#4A9EFF", success: "#7ED321", warning: "#F5A623", danger: "#FF6B6B", purple: "#BD10E0",
};

const DIMENSION_META = {
  historique: { label: "Historique", icon: "⌛" },
  politique: { label: "Politique", icon: "⚖" },
  economique: { label: "Économique", icon: "◈" },
  scientifique: { label: "Scientifique", icon: "◎" },
  social_culturel: { label: "Social", icon: "◉" },
  international: { label: "International", icon: "◇" },
  technologique: { label: "Technologique", icon: "◐" },
  psychologique: { label: "Psychologique", icon: "◑" },
};

const callClaude = async (query) => {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: `Analyse ce sujet : ${query}` }],
    }),
  });
  const data = await res.json();
  const raw = data.content?.find(b => b.type === "text")?.text || "";
  return JSON.parse(raw.replace(/```json|```/g, "").trim());
};

const Tag = ({ children, color = C.textMuted }) => (
  <span style={{ fontSize: 9, fontFamily: "monospace", color, border: `1px solid ${color}40`, borderRadius: 3, padding: "2px 7px", letterSpacing: 1.2, whiteSpace: "nowrap" }}>{children}</span>
);

const HolismeGauge = ({ score }) => {
  const r = 26, sw = 4, circ = 2 * Math.PI * r;
  const pct = score / 8;
  const color = pct >= 0.75 ? C.success : pct >= 0.5 ? C.warning : C.danger;
  const dim = (r + sw + 2) * 2;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <svg width={dim} height={dim} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={dim/2} cy={dim/2} r={r} fill="none" stroke={C.border} strokeWidth={sw} />
        <circle cx={dim/2} cy={dim/2} r={r} fill="none" stroke={color} strokeWidth={sw}
          strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)} strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s ease" }} />
      </svg>
      <div>
        <div style={{ fontSize: 20, fontWeight: 900, color, lineHeight: 1 }}>{score}<span style={{ fontSize: 11, color: C.textMuted }}>/8</span></div>
        <div style={{ fontSize: 8, color: C.textMuted, fontFamily: "monospace", letterSpacing: 1 }}>HOLISME</div>
      </div>
    </div>
  );
};

const AuthModal = ({ onClose }) => {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async () => {
    setError(""); setLoading(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onClose();
      } else {
        if (!username.trim()) throw new Error("Nom d'utilisateur requis.");
        if (password.length < 8) throw new Error("8 caractères minimum.");
        const { error } = await supabase.auth.signUp({ email, password, options: { data: { username } } });
        if (error) throw error;
        setSuccess("Vérifie ta boîte mail pour confirmer ton compte.");
      }
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000000B0", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 500 }}>
      <div style={{ background: C.bg, border: `1px solid ${C.borderLight}`, borderRadius: 12, padding: 28, width: 360 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
          <div style={{ width: 26, height: 26, borderRadius: 6, background: "linear-gradient(135deg, #4A9EFF, #BD10E0)", display: "flex", alignItems: "center", justifyContent: "center" }}>◈</div>
          <span style={{ fontWeight: 900, fontSize: 15 }}>Narrativa</span>
        </div>
        <div style={{ display: "flex", background: C.surface, borderRadius: 8, padding: 3, marginBottom: 20, gap: 3 }}>
          {[["login", "Connexion"], ["signup", "Inscription"]].map(([m, l]) => (
            <button key={m} onClick={() => { setMode(m); setError(""); }} style={{ flex: 1, padding: "6px 0", borderRadius: 6, border: "none", background: mode === m ? C.border : "transparent", color: mode === m ? C.text : C.textMuted, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>{l}</button>
          ))}
        </div>
        {success ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>✓</div>
            <p style={{ color: C.success, fontSize: 13 }}>{success}</p>
            <button onClick={onClose} style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 7, padding: "8px 16px", color: C.textMuted, cursor: "pointer", marginTop: 10 }}>Fermer</button>
          </div>
        ) : (
          <>
            {mode === "signup" && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: C.textMuted, fontFamily: "monospace", letterSpacing: 1, marginBottom: 5 }}>NOM D'UTILISATEUR</div>
                <input value={username} onChange={e => setUsername(e.target.value)} placeholder="ex: alice_dupont" style={{ width: "100%", background: C.surface, border: `1px solid ${C.borderLight}`, borderRadius: 7, padding: "9px 12px", color: C.text, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
              </div>
            )}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: C.textMuted, fontFamily: "monospace", letterSpacing: 1, marginBottom: 5 }}>EMAIL</div>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="ton@email.com" style={{ width: "100%", background: C.surface, border: `1px solid ${C.borderLight}`, borderRadius: 7, padding: "9px 12px", color: C.text, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: C.textMuted, fontFamily: "monospace", letterSpacing: 1, marginBottom: 5 }}>MOT DE PASSE</div>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="········" style={{ width: "100%", background: C.surface, border: `1px solid ${C.borderLight}`, borderRadius: 7, padding: "9px 12px", color: C.text, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
            </div>
            {error && <div style={{ background: C.danger + "10", border: `1px solid ${C.danger}30`, borderRadius: 6, padding: "8px 12px", color: C.danger, fontSize: 12, marginBottom: 12 }}>{error}</div>}
            <button onClick={handleSubmit} disabled={loading} style={{ width: "100%", background: C.accent, border: "none", borderRadius: 7, padding: "9px 18px", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              {loading ? "…" : mode === "login" ? "Se connecter" : "Créer mon compte"}
            </button>
          </>
        )}
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.textDim, fontSize: 11, cursor: "pointer" }}>Continuer sans compte</button>
        </div>
      </div>
    </div>
  );
};

export default function NarativaApp() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [readingProfile, setReadingProfile] = useState(null);
  const [userAnalyses, setUserAnalyses] = useState([]);
  const [showAuth, setShowAuth] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activeNarrative, setActiveNarrative] = useState(null);
  const [activeTab, setActiveTab] = useState("recits");
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "info") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) { setProfile(null); setReadingProfile(null); setUserAnalyses([]); return; }
    const load = async () => {
      const [{ data: p }, { data: rp }, { data: a }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("reading_profiles").select("*").eq("user_id", user.id).single(),
        supabase.from("analyses").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(10),
      ]);
      setProfile(p); setReadingProfile(rp); setUserAnalyses(a || []);
    };
    load();
  }, [user]);

  const analyze = async (query) => {
    if (!query.trim()) return;
    setLoading(true); setResult(null); setActiveNarrative(null); setActiveTab("recits");
    try {
      const data = await callClaude(query);
      setResult(data);
      if (user) {
        const { data: saved } = await supabase.from("analyses").insert({ user_id: user.id, query, result: data, score_holisme: data.score_holisme || 0, nb_recits: data.recits?.length || 0 }).select().single();
        if (saved) {
          await supabase.rpc("update_reading_profile", { p_user_id: user.id, p_analysis_id: saved.id, p_result: data, p_query: query });
          const [{ data: rp }, { data: a }] = await Promise.all([
            supabase.from("reading_profiles").select("*").eq("user_id", user.id).single(),
            supabase.from("analyses").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(10),
          ]);
          setReadingProfile(rp); setUserAnalyses(a || []);
          showToast("Analyse sauvegardée ✓", "success");
        }
      }
    } catch (e) { showToast("Erreur d'analyse.", "error"); }
    finally { setLoading(false); }
  };

  const TABS = [{ id: "recits", label: "Récits" }, { id: "holisme", label: "Holisme" }, { id: "desaccords", label: "Désaccords" }, { id: "consensus", label: "Consensus" }];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ borderBottom: `1px solid ${C.border}`, padding: "0 20px", display: "flex", alignItems: "center", gap: 12, height: 52, position: "sticky", top: 0, background: C.bg + "F2", backdropFilter: "blur(10px)", zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 26, height: 26, borderRadius: 6, background: "linear-gradient(135deg, #4A9EFF, #BD10E0)", display: "flex", alignItems: "center", justifyContent: "center" }}>◈</div>
          <span style={{ fontWeight: 900, fontSize: 15 }}>Narrativa</span>
        </div>
        <div style={{ flex: 1, position: "relative", maxWidth: 560 }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && analyze(input)}
            placeholder="Sujet, article, ou question…"
            style={{ width: "100%", background: C.surface, border: `1px solid ${C.borderLight}`, borderRadius: 7, padding: "7px 80px 7px 12px", color: C.text, fontSize: 12, outline: "none", boxSizing: "border-box" }} />
          <button onClick={() => analyze(input)} disabled={loading || !input.trim()}
            style={{ position: "absolute", right: 4, top: "50%", transform: "translateY(-50%)", background: input.trim() ? C.accent : C.border, border: "none", borderRadius: 5, padding: "4px 10px", color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
            {loading ? "…" : "Analyser"}
          </button>
        </div>
        {result && <HolismeGauge score={result.score_holisme} />}
        <div style={{ marginLeft: "auto" }}>
          {user ? (
            <button onClick={() => setShowSidebar(true)} style={{ display: "flex", alignItems: "center", gap: 7, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 7, padding: "5px 10px", cursor: "pointer", color: C.textMuted, fontSize: 12 }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: "linear-gradient(135deg, #4A9EFF, #BD10E0)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#fff", fontWeight: 800 }}>
                {(profile?.username || user.email)?.[0]?.toUpperCase()}
              </div>
              {profile?.username || user.email?.split("@")[0]}
            </button>
          ) : (
            <button onClick={() => setShowAuth(true)} style={{ background: C.accent, border: "none", borderRadius: 7, padding: "6px 14px", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Connexion</button>
          )}
        </div>
      </div>

      {showSidebar && (
        <>
          <div onClick={() => setShowSidebar(false)} style={{ position: "fixed", inset: 0, background: "#000000A0", zIndex: 200 }} />
          <div style={{ position: "fixed", right: 0, top: 0, bottom: 0, width: 300, background: C.bg, borderLeft: `1px solid ${C.borderLight}`, zIndex: 201, overflowY: "auto", padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <div style={{ fontWeight: 800 }}>{profile?.username || user?.email?.split("@")[0]}</div>
                <div style={{ fontSize: 11, color: C.textMuted }}>{user?.email}</div>
              </div>
              <button onClick={() => setShowSidebar(false)} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 18 }}>×</button>
            </div>
            <div style={{ background: C.surface, borderRadius: 8, padding: 12, border: `1px solid ${C.border}`, marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: C.textDim, fontFamily: "monospace", letterSpacing: 1.2, marginBottom: 8 }}>MES STATISTIQUES</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[
                  [readingProfile?.total_analyses || 0, "Analyses", C.accent],
                  [readingProfile?.avg_holisme_score ? Number(readingProfile.avg_holisme_score).toFixed(1) : "–", "Holisme moy.", C.success],
                ].map(([v, l, c]) => (
                  <div key={l} style={{ background: C.bg, borderRadius: 6, padding: 8, textAlign: "center" }}>
                    <div style={{ fontSize: 18, fontWeight: 900, color: c }}>{v}</div>
                    <div style={{ fontSize: 9, color: C.textMuted, fontFamily: "monospace" }}>{l.toUpperCase()}</div>
                  </div>
                ))}
              </div>
            </div>
            {userAnalyses.length > 0 && (
              <div style={{ background: C.surface, borderRadius: 8, padding: 12, border: `1px solid ${C.border}`, marginBottom: 12 }}>
                <div style={{ fontSize: 10, color: C.textDim, fontFamily: "monospace", letterSpacing: 1.2, marginBottom: 8 }}>HISTORIQUE</div>
                {userAnalyses.map(a => (
                  <div key={a.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${C.border}` }}>
                    <span style={{ fontSize: 11, color: C.textMuted, flex: 1, marginRight: 8 }}>{a.result?.titre || a.query}</span>
                    <span style={{ fontSize: 10, color: C.success, fontFamily: "monospace" }}>{a.score_holisme}/8</span>
                  </div>
                ))}
              </div>
            )}
            <button onClick={async () => { await supabase.auth.signOut(); setShowSidebar(false); }} style={{ width: "100%", background: C.danger + "20", border: `1px solid ${C.danger}40`, borderRadius: 7, padding: "8px", color: C.danger, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Se déconnecter</button>
          </div>
        </>
      )}

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 20px" }}>
        {!loading && !result && (
          <div style={{ paddingTop: 60, textAlign: "center", maxWidth: 500, margin: "0 auto" }}>
            <div style={{ fontSize: 34, fontWeight: 900, letterSpacing: -2, marginBottom: 12, background: "linear-gradient(135deg, #4A9EFF, #BD10E0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Cartographie des récits</div>
            <p style={{ color: C.textMuted, fontSize: 13, lineHeight: 1.7, marginBottom: 28 }}>Analyse holistique · Pluralisme narratif · Humilité épistémique</p>
            {!user && (
              <div style={{ background: C.accent + "15", border: `1px solid ${C.accent}30`, borderRadius: 8, padding: 14, marginBottom: 24, textAlign: "left" }}>
                <div style={{ fontSize: 12, color: C.accent, fontWeight: 700, marginBottom: 4 }}>Crée un compte pour sauvegarder tes analyses et suivre ton profil de lecture.</div>
                <button onClick={() => setShowAuth(true)} style={{ background: C.accent, border: "none", borderRadius: 6, padding: "6px 14px", color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer", marginTop: 8 }}>Créer un compte gratuit</button>
              </div>
            )}
            {["La réforme des retraites en France", "L'impact de l'IA sur l'emploi", "La guerre en Ukraine : enjeux 2024"].map(ex => (
              <button key={ex} onClick={() => { setInput(ex); analyze(ex); }}
                style={{ display: "block", width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", color: C.textMuted, fontSize: 12, cursor: "pointer", textAlign: "left", marginBottom: 6 }}>
                → {ex}
              </button>
            ))}
          </div>
        )}

        {loading && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, padding: "60px 20px" }}>
            <div style={{ display: "flex", gap: 5 }}>
              {[0,1,2,3,4].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent, animation: `p 1.2s ${i*0.15}s ease-in-out infinite` }} />)}
            </div>
            <p style={{ color: C.textMuted, fontSize: 11, fontFamily: "monospace", letterSpacing: 1.5 }}>ANALYSE EN COURS…</p>
            <style>{`@keyframes p{0%,100%{opacity:.2;transform:scale(.8)}50%{opacity:1;transform:scale(1.2)}}`}</style>
          </div>
        )}

        {result && !loading && (
          <div style={{ paddingTop: 24 }}>
            <div style={{ marginBottom: 20 }}>
              <h1 style={{ fontSize: 22, fontWeight: 900, letterSpacing: -0.5, margin: "0 0 8px" }}>{result.titre}</h1>
              <p style={{ color: C.textMuted, fontSize: 12, lineHeight: 1.6, margin: "0 0 12px" }}>{result.resume_factuel}</p>
              <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                <HolismeGauge score={result.score_holisme} />
                {[
                  [result.recits?.length, "RÉCITS", C.accent],
                  [result.desaccords?.length, "DÉSACCORDS", C.warning],
                  [result.consensus?.length, "CONSENSUS", C.success],
                ].map(([v, l, c]) => (
                  <div key={l} style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <span style={{ fontSize: 18, fontWeight: 800, color: c }}>{v}</span>
                    <span style={{ fontSize: 9, color: C.textMuted, fontFamily: "monospace" }}>{l}</span>
                  </div>
                ))}
                <Tag color={result.niveau_certitude_global === "élevé" ? C.success : result.niveau_certitude_global === "moyen" ? C.warning : C.danger}>
                  {result.niveau_certitude_global === "élevé" ? "PREUVES SOLIDES" : result.niveau_certitude_global === "moyen" ? "PREUVES MODÉRÉES" : "PREUVES FAIBLES"}
                </Tag>
              </div>
            </div>

            <div style={{ display: "flex", borderBottom: `1px solid ${C.border}`, marginBottom: 20 }}>
              {TABS.map(t => (
                <button key={t.id} onClick={() => setActiveTab(t.id)}
                  style={{ padding: "8px 14px", border: "none", borderBottom: `2px solid ${activeTab === t.id ? C.accent : "transparent"}`, background: "transparent", cursor: "pointer", fontSize: 12, fontWeight: 600, color: activeTab === t.id ? C.accent : C.textMuted, marginBottom: -1 }}>
                  {t.label}
                </button>
              ))}
            </div>

            {activeTab === "recits" && result.recits?.map(n => (
              <div key={n.id} onClick={() => setActiveNarrative(p => p === n.id ? null : n.id)}
                style={{ background: activeNarrative === n.id ? `${n.couleur_hex}0D` : C.surface, border: `1px solid ${activeNarrative === n.id ? n.couleur_hex + "50" : C.border}`, borderRadius: 8, marginBottom: 8, padding: 14, cursor: "pointer" }}>
                <div style={{ display: "flex", gap: 10 }}>
                  <div style={{ width: 3, borderRadius: 2, background: n.couleur_hex, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ color: n.couleur_hex, fontWeight: 700, fontSize: 13 }}>{n.nom}</span>
                      <Tag color={n.niveau_preuves === "élevé" ? C.success : n.niveau_preuves === "moyen" ? C.warning : C.danger}>
                        {n.niveau_preuves === "élevé" ? "PREUVES SOLIDES" : n.niveau_preuves === "moyen" ? "PREUVES MODÉRÉES" : "PREUVES FAIBLES"}
                      </Tag>
                    </div>
                    <p style={{ color: C.textMuted, fontSize: 12, margin: 0, lineHeight: 1.5 }}>{n.cadre}</p>
                    {activeNarrative === n.id && (
                      <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
                        <div style={{ fontSize: 10, color: C.textDim, fontFamily: "monospace", letterSpacing: 1.2, marginBottom: 6 }}>ARGUMENTS</div>
                        {n.arguments?.map((a, i) => (
                          <div key={i} style={{ display: "flex", gap: 7, marginBottom: 5 }}>
                            <span style={{ color: n.couleur_hex, fontSize: 10 }}>→</span>
                            <span style={{ color: C.textMuted, fontSize: 11, lineHeight: 1.5 }}>{a}</span>
                          </div>
                        ))}
                        {n.omissions_detectees?.length > 0 && (
                          <div style={{ marginTop: 10 }}>
                            <div style={{ fontSize: 10, color: C.textDim, fontFamily: "monospace", letterSpacing: 1.2, marginBottom: 6 }}>OMISSIONS</div>
                            {n.omissions_detectees.map((o, i) => (
                              <div key={i} style={{ display: "flex", gap: 6, marginBottom: 4 }}>
                                <span style={{ color: C.danger, fontSize: 10 }}>⚠</span>
                                <span style={{ color: C.textMuted, fontSize: 11, fontStyle: "italic" }}>{o}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {activeTab === "holisme" && (
              <div style={{ maxWidth: 720 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
                  {Object.entries(DIMENSION_META).map(([key, meta]) => {
                    const dim = result.dimensions_holistiques?.[key];
                    return (
                      <div key={key} style={{ background: dim?.couvert ? `${C.accent}08` : C.surface, border: `1px solid ${dim?.couvert ? C.accent + "30" : C.border}`, borderRadius: 8, padding: 12 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: dim?.couvert ? 8 : 0 }}>
                          <span style={{ fontSize: 14, opacity: dim?.couvert ? 1 : 0.3 }}>{meta.icon}</span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: dim?.couvert ? C.text : C.textDim }}>{meta.label}</span>
                          {!dim?.couvert && <span style={{ marginLeft: "auto", fontSize: 9, color: C.textDim, fontFamily: "monospace" }}>NON COUVERT</span>}
                        </div>
                        {dim?.couvert && <p style={{ color: C.textMuted, fontSize: 11, margin: 0, lineHeight: 1.5 }}>{dim.contenu}</p>}
                        {dim?.couvert && dim?.angle_mort && dim.angle_mort !== "..." && (
                          <div style={{ display: "flex", gap: 5, marginTop: 6 }}>
                            <span style={{ color: C.warning, fontSize: 10 }}>⚠</span>
                            <span style={{ color: C.warning, fontSize: 10, fontStyle: "italic" }}>{dim.angle_mort}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === "desaccords" && (
              <div style={{ maxWidth: 680 }}>
                {result.desaccords?.map((d, i) => (
                  <div key={i} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14, marginBottom: 10 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                      <Tag color={d.type === "factuel" ? C.accent : d.type === "interprétatif" ? C.warning : C.purple}>
                        {d.type === "factuel" ? "FAIT" : d.type === "interprétatif" ? "INTERPRÉTATION" : "VALEUR"}
                      </Tag>
                      <span style={{ fontWeight: 700, fontSize: 13 }}>{d.point}</span>
                    </div>
                    <p style={{ color: C.textMuted, fontSize: 12, margin: 0, lineHeight: 1.6 }}>{d.detail}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "consensus" && (
              <div style={{ maxWidth: 640 }}>
                {result.consensus?.map((c, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, background: C.surface, border: `1px solid ${C.success}20`, borderRadius: 8, padding: 14, marginBottom: 8 }}>
                    <span style={{ color: C.success, fontSize: 14 }}>✓</span>
                    <span style={{ color: C.textMuted, fontSize: 13, lineHeight: 1.6 }}>{c}</span>
                  </div>
                ))}
              </div>
            )}
            <div style={{ height: 60 }} />
          </div>
        )}
      </div>

      {toast && (
        <div style={{ position: "fixed", bottom: 24, right: 24, background: C.surface, border: `1px solid ${toast.type === "success" ? C.success : C.danger}40`, borderLeft: `3px solid ${toast.type === "success" ? C.success : C.danger}`, borderRadius: 8, padding: "12px 16px", color: C.text, fontSize: 12, zIndex: 999 }}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}