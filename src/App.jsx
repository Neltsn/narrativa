import { useState } from "react";

const C = {
  bg: "#080A0F", surface: "#0E1017", border: "#1C1F2A", borderLight: "#252836",
  text: "#E2E4EC", textMuted: "#6B6F82", textDim: "#3A3D4E",
  accent: "#4A9EFF", success: "#7ED321", warning: "#F5A623", danger: "#FF6B6B", purple: "#BD10E0",
};

const MOCK_ANALYSES = {
  "retraites": {
    titre: "Réforme des retraites en France",
    resume_factuel: "Le gouvernement Borne a fait passer par 49.3 un report de l'âge légal de retraite de 62 à 64 ans. Des grèves massives ont mobilisé entre 1,1 et 3,5 millions de personnes.",
    niveau_certitude_global: "élevé",
    score_holisme: 7,
    recits: [
      { id: "r1", nom: "Nécessité budgétaire", couleur_hex: "#4A9EFF", cadre: "La réforme garantit la pérennité du système par répartition face au vieillissement démographique.", arguments: ["Le système est déficitaire à long terme", "L'alignement avec la moyenne européenne est cohérent", "Le coût de l'inaction dépasse celui de la réforme"], omissions_detectees: ["Alternatives fiscales non explorées", "Impact sur les métiers pénibles minimisé"], niveau_preuves: "moyen" },
      { id: "r2", nom: "Régression sociale", couleur_hex: "#FF6B6B", cadre: "La réforme transfère le coût de décisions financières vers les travailleurs les plus précaires.", arguments: ["Les femmes et ouvriers sont les plus touchés", "Des alternatives existent (cotisations patronales)", "Le 49.3 est un déni démocratique"], omissions_detectees: ["Déficit réel du système à 40 ans", "Comparaisons européennes nuancées"], niveau_preuves: "élevé" },
      { id: "r3", nom: "Crise institutionnelle", couleur_hex: "#F5A623", cadre: "Le vrai sujet est l'usage du 49.3 et la déconnexion entre gouvernants et peuple.", arguments: ["Le 49.3 est légal mais politiquement dévastateur", "La crise de confiance précède la réforme", "Le mouvement a une dimension civique"], omissions_detectees: ["Propositions alternatives concrètes des syndicats"], niveau_preuves: "élevé" },
      { id: "r4", nom: "Regard international", couleur_hex: "#7ED321", cadre: "La France observe une tension structurelle entre son modèle social et les contraintes budgétaires.", arguments: ["64 ans reste sous la moyenne européenne", "Les grèves reflètent une tradition française", "La question de financement est commune à l'Europe"], omissions_detectees: ["Particularités du système français"], niveau_preuves: "moyen" },
    ],
    consensus: ["Le 49.3 a été utilisé pour éviter un vote", "Des manifestations massives ont eu lieu", "Le Conseil constitutionnel a validé l'essentiel du texte"],
    desaccords: [
      { type: "factuel", point: "Le déficit du système à horizon 2050", detail: "Le COR parle de déficit probable mais les hypothèses varient selon les scénarios retenus." },
      { type: "interprétatif", point: "L'existence d'alternatives au report d'âge", detail: "Les économistes s'accordent sur leur existence technique mais divergent sur leur faisabilité." },
      { type: "axiologique", point: "Priorité entre équilibre budgétaire et justice sociale", detail: "Désaccord de valeurs irréductible — les deux objectifs sont légitimes." },
    ],
    dimensions_holistiques: {
      historique: { couvert: true, contenu: "La France a une longue tradition de réformes des retraites contestées depuis 1995.", angle_mort: "Comparaison avec les réformes réussies dans d'autres pays" },
      politique: { couvert: true, contenu: "Usage du 49.3, rapports de force syndicats/gouvernement, polarisation de l'Assemblée.", angle_mort: "Rôle des partis d'opposition dans les négociations" },
      economique: { couvert: true, contenu: "Déficit projeté du système, coût du vieillissement, alternatives fiscales.", angle_mort: "Impact macroéconomique de l'allongement de la vie active" },
      scientifique: { couvert: true, contenu: "Projections du COR, études sur la pénibilité, espérance de vie en bonne santé.", angle_mort: "Données sur l'employabilité réelle des seniors" },
      social_culturel: { couvert: true, contenu: "Impact différentiel par genre, classe sociale, secteur d'activité.", angle_mort: "Perception générationnelle de la retraite" },
      international: { couvert: true, contenu: "Comparaisons européennes, pression des marchés financiers, position de l'UE.", angle_mort: "Modèles alternatifs nordiques détaillés" },
      technologique: { couvert: false, contenu: "Impact de l'automatisation sur l'emploi des seniors.", angle_mort: "Dimension numérique absente du débat" },
      psychologique: { couvert: true, contenu: "Sentiment d'injustice, défiance institutionnelle, mobilisation collective.", angle_mort: "Psychologie de la retraite comme horizon de vie" },
    },
  },
  "ia": {
    titre: "Intelligence Artificielle & Emploi",
    resume_factuel: "Des études estiment que 25 à 40% des tâches sont exposées à l'automatisation par l'IA générative. Les effets sur l'emploi net restent profondément débattus.",
    niveau_certitude_global: "faible",
    score_holisme: 6,
    recits: [
      { id: "r1", nom: "Révolution productive", couleur_hex: "#4A9EFF", cadre: "L'IA est un multiplicateur de productivité qui créera plus d'emplois qu'elle n'en détruira.", arguments: ["Chaque révolution technologique a augmenté l'emploi", "De nouveaux métiers émergent", "La productivité libère du temps créatif"], omissions_detectees: ["Délais de transition de plusieurs décennies", "Distribution inégale des gains"], niveau_preuves: "faible" },
      { id: "r2", nom: "Disruption sociale", couleur_hex: "#FF6B6B", cadre: "L'IA concentre la valeur chez quelques acteurs tout en précarisant massivement le travail.", arguments: ["Les gains ne bénéficient pas aux travailleurs", "Les métiers détruits sont non-substituables rapidement", "Le revenu universel devient nécessaire"], omissions_detectees: ["Cas réels d'augmentation de compétences via l'IA"], niveau_preuves: "moyen" },
      { id: "r3", nom: "Enjeu de souveraineté", couleur_hex: "#F5A623", cadre: "La vraie question est la dépendance stratégique aux plateformes américaines et chinoises.", arguments: ["L'Europe est en retard critique", "La dépendance à OpenAI crée un risque systémique", "L'investissement public en IA souveraine est urgent"], omissions_detectees: ["Coût prohibitif du rattrapage"], niveau_preuves: "élevé" },
    ],
    consensus: ["L'IA générative automatise une part significative des tâches cognitives", "Les effets sont inégaux selon les secteurs", "La vitesse de transition est sans précédent"],
    desaccords: [
      { type: "factuel", point: "Volume d'emplois détruits", detail: "Les estimations vont de 14% (OCDE) à 47% (Oxford) selon la définition retenue." },
      { type: "interprétatif", point: "Comparabilité avec les révolutions industrielles", detail: "La nature cognitive de cette révolution la rend difficilement comparable aux précédentes." },
      { type: "axiologique", point: "La valeur du travail humain intrinsèquement", detail: "Faut-il préserver l'emploi comme fin en soi ou accepter sa transformation radicale ?" },
    ],
    dimensions_holistiques: {
      historique: { couvert: true, contenu: "Comparaisons avec la révolution industrielle et l'automatisation des années 1980.", angle_mort: "Spécificité de la vitesse de cette transition" },
      politique: { couvert: true, contenu: "Régulation européenne de l'IA, lobbying des grandes tech, politiques d'emploi.", angle_mort: "Position des syndicats dans les négociations réglementaires" },
      economique: { couvert: true, contenu: "Gains de productivité, polarisation des revenus, nouvelles industries.", angle_mort: "Impact sur les économies du Sud Global" },
      scientifique: { couvert: true, contenu: "Études sur l'automatisation des tâches, capacités réelles des LLM.", angle_mort: "Limites techniques des modèles actuels" },
      social_culturel: { couvert: true, contenu: "Impact différentiel par classe sociale et niveau d'éducation.", angle_mort: "Dimension psychologique du sens du travail" },
      international: { couvert: true, contenu: "Course USA-Chine, retard européen, impacts sur les pays en développement.", angle_mort: "Modèles alternatifs de gouvernance de l'IA" },
      technologique: { couvert: true, contenu: "Capacités des modèles actuels, courbe d'amélioration, limites techniques.", angle_mort: "Infrastructure énergétique nécessaire" },
      psychologique: { couvert: false, contenu: "Anxiété face à l'automatisation, identité professionnelle.", angle_mort: "Dimension psychologique quasi absente du débat public" },
    },
  },
  "ukraine": {
    titre: "Guerre en Ukraine : enjeux géopolitiques",
    resume_factuel: "Le conflit russo-ukrainien, déclenché par l'invasion russe du 24 février 2022, a provoqué des centaines de milliers de victimes et une crise humanitaire majeure.",
    niveau_certitude_global: "moyen",
    score_holisme: 8,
    recits: [
      { id: "r1", nom: "Défense de la démocratie", couleur_hex: "#4A9EFF", cadre: "L'Ukraine défend les valeurs démocratiques et la souveraineté contre l'agression impériale russe.", arguments: ["Violation flagrante du droit international", "Précédent dangereux si l'agression n'est pas sanctionnée", "Soutien occidental légitime et nécessaire"], omissions_detectees: ["Complexité de l'histoire russo-ukrainienne", "Coûts pour les populations civiles ukrainiennes"], niveau_preuves: "élevé" },
      { id: "r2", nom: "Échec de l'ordre occidental", couleur_hex: "#FF6B6B", cadre: "Le conflit révèle les limites de l'expansion de l'OTAN et de la politique étrangère occidentale.", arguments: ["L'élargissement de l'OTAN a ignoré les lignes rouges russes", "Les accords de Minsk n'ont pas été respectés", "Une solution négociée était possible"], omissions_detectees: ["Responsabilité russe dans l'escalade", "Volonté ukrainienne d'intégration européenne"], niveau_preuves: "moyen" },
      { id: "r3", nom: "Recomposition multipolaire", couleur_hex: "#7ED321", cadre: "La guerre accélère la fin de l'hégémonie américaine et l'émergence d'un monde multipolaire.", arguments: ["Le Sud Global refuse de choisir un camp", "Les sanctions ont échoué à isoler la Russie", "De nouveaux axes géopolitiques émergent"], omissions_detectees: ["Violations des droits humains par la Russie", "Impact sur les pays les plus pauvres"], niveau_preuves: "moyen" },
    ],
    consensus: ["Des crimes de guerre ont été commis", "La crise humanitaire est réelle et massive", "Le conflit a des répercussions économiques mondiales"],
    desaccords: [
      { type: "factuel", point: "Nombre de victimes militaires et civiles", detail: "Les chiffres varient énormément selon les sources (Ukraine, Russie, ONU, instituts indépendants)." },
      { type: "interprétatif", point: "Responsabilité dans le déclenchement du conflit", detail: "Agression pure vs provocation liée à l'élargissement de l'OTAN — débat historiographique majeur." },
      { type: "axiologique", point: "Priorité entre paix rapide et justice", detail: "Négociation immédiate ou résistance jusqu'à la victoire — choix de valeurs fondamental." },
    ],
    dimensions_holistiques: {
      historique: { couvert: true, contenu: "Histoire russo-ukrainienne, Holodomor, dissolution URSS, révolution de Maïdan.", angle_mort: "Complexité des identités régionales ukrainiennes" },
      politique: { couvert: true, contenu: "Géopolitique OTAN-Russie, rôle de l'UE, positionnement du Sud Global.", angle_mort: "Politique intérieure ukrainienne" },
      economique: { couvert: true, contenu: "Impact sur l'énergie mondiale, sanctions, économie de guerre.", angle_mort: "Coût de la reconstruction post-conflit" },
      scientifique: { couvert: true, contenu: "Nouvelles technologies militaires, drones, guerre hybride.", angle_mort: "Impact environnemental du conflit" },
      social_culturel: { couvert: true, contenu: "Identité ukrainienne, déplacements de populations, traumatismes.", angle_mort: "Société civile russe" },
      international: { couvert: true, contenu: "Réponse ONU, position Chine-Inde-Brésil, aide militaire occidentale.", angle_mort: "Impact sur les pays africains dépendants du blé ukrainien" },
      technologique: { couvert: true, contenu: "Guerre des drones, cyberattaques, renseignement satellitaire.", angle_mort: "Prolifération des technologies de guerre" },
      psychologique: { couvert: true, contenu: "Propagande des deux côtés, traumatismes collectifs, désinformation.", angle_mort: "Psychologie des populations sous occupation" },
    },
  },
};

const getAnalysis = (query) => {
  const q = query.toLowerCase();
  if (q.includes("retraite")) return MOCK_ANALYSES["retraites"];
  if (q.includes("ia") || q.includes("intelligence") || q.includes("emploi")) return MOCK_ANALYSES["ia"];
  if (q.includes("ukraine") || q.includes("guerre") || q.includes("russie")) return MOCK_ANALYSES["ukraine"];
  return {
    titre: query,
    resume_factuel: `Analyse de "${query}" — En mode démo, connecte l'API Claude pour des analyses réelles sur n'importe quel sujet.`,
    niveau_certitude_global: "moyen",
    score_holisme: 5,
    recits: [
      { id: "r1", nom: "Récit dominant", couleur_hex: "#4A9EFF", cadre: "Le cadre interprétatif principal sur ce sujet.", arguments: ["Argument central 1", "Argument central 2"], omissions_detectees: ["Perspective minoritaire absente"], niveau_preuves: "moyen" },
      { id: "r2", nom: "Récit alternatif", couleur_hex: "#FF6B6B", cadre: "Une lecture différente du même phénomène.", arguments: ["Contre-argument 1", "Contre-argument 2"], omissions_detectees: ["Données contradictoires non mentionnées"], niveau_preuves: "faible" },
    ],
    consensus: ["Point factuel accepté par tous"],
    desaccords: [{ type: "interprétatif", point: "Interprétation principale", detail: "Les acteurs divergent sur la signification de cet événement." }],
    dimensions_holistiques: {
      historique: { couvert: true, contenu: "Contexte historique du sujet.", angle_mort: "Précédents internationaux" },
      politique: { couvert: true, contenu: "Acteurs politiques impliqués.", angle_mort: "Perspectives minoritaires" },
      economique: { couvert: false, contenu: "", angle_mort: "Dimension économique non couverte" },
      scientifique: { couvert: false, contenu: "", angle_mort: "Données scientifiques absentes" },
      social_culturel: { couvert: true, contenu: "Impact social.", angle_mort: "Voix des populations concernées" },
      international: { couvert: false, contenu: "", angle_mort: "Comparaisons internationales manquantes" },
      technologique: { couvert: false, contenu: "", angle_mort: "Dimension technologique absente" },
      psychologique: { couvert: false, contenu: "", angle_mort: "Mécanismes cognitifs non analysés" },
    },
  };
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

const Tag = ({ children, color = C.textMuted }) => (
  <span style={{ fontSize: 9, fontFamily: "monospace", color, border: `1px solid ${color}40`, borderRadius: 3, padding: "2px 7px", letterSpacing: 1.2, whiteSpace: "nowrap" }}>{children}</span>
);

const HolismeGauge = ({ score, size = "normal" }) => {
  const r = size === "small" ? 16 : 26, sw = size === "small" ? 3 : 4;
  const circ = 2 * Math.PI * r, pct = score / 8;
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
        <div style={{ fontSize: size === "small" ? 14 : 20, fontWeight: 900, color, lineHeight: 1 }}>{score}<span style={{ fontSize: size === "small" ? 9 : 11, color: C.textMuted }}>/8</span></div>
        <div style={{ fontSize: 8, color: C.textMuted, fontFamily: "monospace", letterSpacing: 1 }}>HOLISME</div>
      </div>
    </div>
  );
};

export default function NarativaDemo() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activeNarrative, setActiveNarrative] = useState(null);
  const [activeTab, setActiveTab] = useState("recits");

  const analyze = (query) => {
    if (!query.trim()) return;
    setLoading(true);
    setResult(null);
    setActiveNarrative(null);
    setActiveTab("recits");
    setTimeout(() => {
      setResult(getAnalysis(query));
      setLoading(false);
    }, 1800);
  };

  const TABS = [
    { id: "recits", label: "Récits" },
    { id: "holisme", label: "Holisme" },
    { id: "desaccords", label: "Désaccords" },
    { id: "consensus", label: "Consensus" },
  ];

  const EXAMPLES = [
    "La réforme des retraites en France",
    "L'impact de l'IA sur l'emploi",
    "La guerre en Ukraine : enjeux 2024",
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`@keyframes p{0%,100%{opacity:.2;transform:scale(.8)}50%{opacity:1;transform:scale(1.2)}}`}</style>

      {/* HEADER */}
      <div style={{ borderBottom: `1px solid ${C.border}`, padding: "0 20px", display: "flex", alignItems: "center", gap: 12, height: 52, position: "sticky", top: 0, background: C.bg + "F2", backdropFilter: "blur(10px)", zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 26, height: 26, borderRadius: 6, background: "linear-gradient(135deg, #4A9EFF, #BD10E0)", display: "flex", alignItems: "center", justifyContent: "center" }}>◈</div>
          <span style={{ fontWeight: 900, fontSize: 15 }}>Narrativa</span>
          <span style={{ fontSize: 9, color: C.textDim, fontFamily: "monospace", letterSpacing: 2 }}>DÉMO</span>
        </div>
        <div style={{ flex: 1, position: "relative", maxWidth: 560 }}>
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && analyze(input)}
            placeholder="Sujet, article, ou question… (Entrée pour analyser)"
            style={{ width: "100%", background: C.surface, border: `1px solid ${C.borderLight}`, borderRadius: 7, padding: "7px 90px 7px 12px", color: C.text, fontSize: 12, outline: "none", boxSizing: "border-box" }} />
          <button onClick={() => analyze(input)} disabled={loading || !input.trim()}
            style={{ position: "absolute", right: 4, top: "50%", transform: "translateY(-50%)", background: input.trim() ? C.accent : C.border, border: "none", borderRadius: 5, padding: "4px 10px", color: "#fff", fontSize: 11, fontWeight: 700, cursor: input.trim() ? "pointer" : "default", transition: "all 0.2s" }}>
            {loading ? "…" : "Analyser"}
          </button>
        </div>
        {result && <HolismeGauge score={result.score_holisme} size="small" />}
        <div style={{ marginLeft: "auto", fontSize: 10, color: C.textDim, fontFamily: "monospace", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 5, padding: "4px 8px" }}>
          MODE DÉMO
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 20px" }}>

        {/* EMPTY STATE */}
        {!loading && !result && (
          <div style={{ paddingTop: 60, textAlign: "center", maxWidth: 540, margin: "0 auto" }}>
            <div style={{ fontSize: 36, fontWeight: 900, letterSpacing: -2, marginBottom: 12, background: "linear-gradient(135deg, #4A9EFF, #BD10E0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Cartographie des récits
            </div>
            <p style={{ color: C.textMuted, fontSize: 13, lineHeight: 1.7, marginBottom: 32 }}>
              Analyse holistique · Pluralisme narratif · Humilité épistémique
            </p>
            <div style={{ background: C.warning + "10", border: `1px solid ${C.warning}30`, borderRadius: 8, padding: 12, marginBottom: 24, textAlign: "left" }}>
              <span style={{ fontSize: 11, color: C.warning }}>⚡ Mode démo — analyses simulées. Connecte une clé API Anthropic pour des analyses réelles sur n'importe quel sujet.</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {EXAMPLES.map(ex => (
                <button key={ex} onClick={() => { setInput(ex); analyze(ex); }}
                  style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", color: C.textMuted, fontSize: 12, cursor: "pointer", textAlign: "left", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = C.text; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textMuted; }}>
                  → {ex}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, padding: "60px 20px" }}>
            <div style={{ display: "flex", gap: 5 }}>
              {[0,1,2,3,4].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent, animation: `p 1.2s ${i*0.15}s ease-in-out infinite` }} />)}
            </div>
            <p style={{ color: C.textMuted, fontSize: 11, fontFamily: "monospace", letterSpacing: 1.5 }}>ANALYSE HOLISTIQUE EN COURS…</p>
          </div>
        )}

        {/* RESULT */}
        {result && !loading && (
          <div style={{ paddingTop: 24 }}>
            <div style={{ marginBottom: 20 }}>
              <h1 style={{ fontSize: 22, fontWeight: 900, margin: "0 0 8px", letterSpacing: -0.5 }}>{result.titre}</h1>
              <p style={{ color: C.textMuted, fontSize: 12, lineHeight: 1.6, margin: "0 0 14px" }}>{result.resume_factuel}</p>
              <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
                <HolismeGauge score={result.score_holisme} />
                {[[result.recits?.length, "RÉCITS", C.accent], [result.desaccords?.length, "DÉSACCORDS", C.warning], [result.consensus?.length, "CONSENSUS", C.success]].map(([v, l, c]) => (
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

            {/* TABS */}
            <div style={{ display: "flex", borderBottom: `1px solid ${C.border}`, marginBottom: 20 }}>
              {TABS.map(t => (
                <button key={t.id} onClick={() => setActiveTab(t.id)}
                  style={{ padding: "8px 14px", border: "none", borderBottom: `2px solid ${activeTab === t.id ? C.accent : "transparent"}`, background: "transparent", cursor: "pointer", fontSize: 12, fontWeight: 600, color: activeTab === t.id ? C.accent : C.textMuted, marginBottom: -1, transition: "all 0.15s" }}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* RÉCITS */}
            {activeTab === "recits" && result.recits?.map(n => (
              <div key={n.id} onClick={() => setActiveNarrative(p => p === n.id ? null : n.id)}
                style={{ background: activeNarrative === n.id ? `${n.couleur_hex}0D` : C.surface, border: `1px solid ${activeNarrative === n.id ? n.couleur_hex + "50" : C.border}`, borderRadius: 8, marginBottom: 8, padding: 14, cursor: "pointer", transition: "all 0.2s" }}>
                <div style={{ display: "flex", gap: 10 }}>
                  <div style={{ width: 3, borderRadius: 2, background: n.couleur_hex, flexShrink: 0, alignSelf: "stretch" }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, flexWrap: "wrap", gap: 8 }}>
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
                            <span style={{ color: n.couleur_hex, fontSize: 10, marginTop: 2 }}>→</span>
                            <span style={{ color: C.textMuted, fontSize: 11, lineHeight: 1.5 }}>{a}</span>
                          </div>
                        ))}
                        {n.omissions_detectees?.length > 0 && (
                          <div style={{ marginTop: 10 }}>
                            <div style={{ fontSize: 10, color: C.textDim, fontFamily: "monospace", letterSpacing: 1.2, marginBottom: 6 }}>OMISSIONS DÉTECTÉES</div>
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

            {/* HOLISME */}
            {activeTab === "holisme" && (
              <div style={{ maxWidth: 720 }}>
                <div style={{ display: "flex", gap: 14, marginBottom: 18, alignItems: "center" }}>
                  <HolismeGauge score={result.score_holisme} />
                  <p style={{ color: C.textMuted, fontSize: 12, margin: 0, lineHeight: 1.7 }}>
                    {result.score_holisme >= 6 ? "Analyse riche. La majorité des systèmes sont représentés." : "Analyse partielle. Des dimensions importantes manquent."}
                  </p>
                </div>
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
                        {dim?.couvert && <p style={{ color: C.textMuted, fontSize: 11, margin: "0 0 6px", lineHeight: 1.5 }}>{dim.contenu}</p>}
                        {dim?.couvert && dim?.angle_mort && dim.angle_mort !== "..." && (
                          <div style={{ display: "flex", gap: 5 }}>
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

            {/* DÉSACCORDS */}
            {activeTab === "desaccords" && (
              <div style={{ maxWidth: 680 }}>
                <p style={{ color: C.textMuted, fontSize: 12, marginBottom: 16, fontStyle: "italic", lineHeight: 1.6 }}>
                  Distinguer désaccords factuels, interprétatifs et axiologiques est la condition d'un débat honnête.
                </p>
                {result.desaccords?.map((d, i) => (
                  <div key={i} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14, marginBottom: 10 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8, flexWrap: "wrap" }}>
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

            {/* CONSENSUS */}
            {activeTab === "consensus" && (
              <div style={{ maxWidth: 640 }}>
                <p style={{ color: C.textMuted, fontSize: 12, marginBottom: 16, fontStyle: "italic", lineHeight: 1.6 }}>
                  Ce que tous les récits acceptent comme probablement vrai.
                </p>
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
    </div>
  );
}
