const fs = require('fs');
const path = '/Users/gaelquemerais/pronos-cdm/frontend/src/App.jsx';
let code = fs.readFileSync(path, 'utf8');

// 1. Import
code = code.replace(
  'import { useState, useEffect, useCallback } from "react";',
  'import { useState, useEffect } from "react";'
);

// 2. API_BASE
code = code.replace(
  'const API_BASE = "http://localhost:3000/api";',
  'const API_BASE = "/api";'
);

// 3. Login réel
code = code.replace(
  `      // En prod : appel réel → apiCall(\`/auth/\${mode}\`, { method:"POST", body:JSON.stringify({username,password}) })
      // Mock pour la démo :
      await new Promise(r => setTimeout(r, 600));
      if (!username || !password) throw new Error("Remplis tous les champs.");
      if (password.length < 8)   throw new Error("Mot de passe trop court (8 car. min).");
      onLogin({ id: 99, username }, "mock_token_" + Date.now());`,
  `      const data = await apiCall(\`/auth/\${mode}\`, {
        method: "POST",
        body: JSON.stringify({ username, password })
      });
      onLogin(data.user, data.token);`
);

// 4. Matchs réels
code = code.replace(
  `  const [matches, setMatches]           = useState(MOCK_MATCHES);
  const [predictions, setPredictions]   = useState({
    // mock : l'utilisateur a déjà pronostiqué le match 2
    2: { pred_home: 3, pred_away: 0, points_earned: 1 }
  });
  const [loading, setLoading]           = useState(false);`,
  `  const [matches, setMatches]     = useState([]);
  const [predictions, setPredictions] = useState({});
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    apiCall('/matches')
      .then(data => setMatches(data.matches || []))
      .catch(err  => console.error('Erreur matchs :', err))
      .finally(()  => setLoading(false));
  }, []);`
);

// 5. Pronostic réel
code = code.replace(
  `      // En prod : await apiCall("/predict", { method:"POST", body:JSON.stringify({ matchId:match.id, predHome:+home, predAway:+away }) }, token)
      await new Promise(r => setTimeout(r, 500)); // mock`,
  `      await apiCall("/predict", {
        method: "POST",
        body: JSON.stringify({ matchId: match.id, predHome: +home, predAway: +away })
      }, token);`
);

// 6. Classement réel
code = code.replace(
  `  const [ranking, setRanking] = useState(MOCK_RANKING);
  const [loading, setLoading] = useState(false);`,
  `  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiCall('/ranking')
      .then(data => setRanking(data.classement || []))
      .catch(err  => console.error('Erreur classement :', err))
      .finally(()  => setLoading(false));
  }, []);`
);

fs.writeFileSync(path, code);
console.log('✅ App.jsx mis à jour avec succès !');