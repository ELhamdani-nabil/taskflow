# TaskFlow - Questions & Réponses des TP

## Séance 1 : Web Moderne & React

**Q1 : Ouvrez `index.html`. Que contient le `<body>` ? Lien avec le CSR ?**  
**R :** Le `<body>` contient `<div id="root"></div>` et un script qui charge `main.tsx`. C’est le principe du Client-Side Rendering (CSR) : React prend le contrôle de cette div et injecte dynamiquement l’interface. Le HTML initial est quasiment vide, tout est généré par JavaScript.

**Q2 : Quelle différence entre des données en dur dans le code et une API REST ?**  
**R :** Les données en dur sont statiques et nécessitent une recompilation pour être modifiées. Une API REST permet de récupérer les données dynamiquement via HTTP, ce qui est plus réaliste et flexible (on peut modifier les données sans toucher au frontend). Cela prépare l’application à se connecter à une vraie API plus tard.

**Q3 : Pourquoi `className` au lieu de `class` en JSX ?**  
**R :** Parce que `class` est un mot réservé en JavaScript. JSX est une extension syntaxique de JavaScript, on utilise donc `className` (qui correspond à l’attribut DOM `class`).

**Q4 : Pourquoi `key={p.id}` est obligatoire dans `.map()` ? Que se passe-t-il avec l’index ?**  
**R :** La `key` aide React à identifier quels éléments ont changé, été ajoutés ou supprimés. Sans clé stable, React ne peut pas optimiser le rendu. Utiliser l’index comme clé peut causer des bugs si la liste est réordonnée ou modifiée (ex : lors d’un filtrage). L’id unique est donc recommandé.

**Q5 : Combien de fois le `useEffect` s’exécute-t-il ? Pourquoi ?**  
**R :** Une seule fois, car le tableau de dépendances est vide (`[]`). L’effet est exécuté après le premier rendu (montage) et jamais ensuite.

**Q6 : Arrêtez json-server (Ctrl+C) et rechargez. Que se passe-t-il ?**  
**R :** Les requêtes `fetch` échouent, le bloc `catch` est exécuté, et `loading` passe à `false`. L’application affiche « Chargement… » puis reste sans données, et une erreur est affichée dans la console.

**Q7 : Ouvrez l’onglet Network. Voyez-vous les requêtes vers `localhost:4000` ? Quel code HTTP ?**  
**R :** Oui, si le serveur tourne, on voit deux requêtes GET avec un code 200 (OK). Si le serveur est arrêté, les requêtes échouent avec un statut `(failed)` ou 404.

**Q8 : Modifiez `db.json` et rechargez. Les nouvelles données s’affichent ? Décrivez le cycle.**  
**R :** Oui, après rechargement manuel, le `useEffect` s’exécute à nouveau, fetch récupère les données mises à jour, `setProjects`/`setColumns` sont appelés, et les composants sont re-rendus. Cycle : modification du fichier → json-server met à jour ses données → requête HTTP → fetch → setState → nouveau rendu.

**Q9 : Dessinez le flux : json-server → fetch → useState → useEffect → composants → props.**  
**R :**  
1. **json-server** expose les données via HTTP.  
2. **fetch** (dans `useEffect`) envoie une requête GET.  
3. Les données JSON sont passées à `setProjects` / `setColumns`.  
4. **useState** met à jour les valeurs → nouveau rendu de `App`.  
5. **Composants** (`Sidebar`, `MainContent`) reçoivent les nouvelles données via **props**.  
6. Les props sont utilisées pour générer le JSX.

---

## Séance 2 : Auth Context & Protected Layout

**Q2 : Pourquoi le `useAuth()` lance une erreur si le context est null ? Quel bug ça prévient ?**  
**R :** Cela empêche d’utiliser le hook en dehors du provider. Si on l’utilise dans un composant non encapsulé par `<AuthProvider>`, on obtient une erreur explicative plutôt qu’un comportement inattendu (ex : `undefined`). Cela facilite le débogage.

**Q3 : Sans Context, comment feriez-vous pour partager le user entre Header, Sidebar et Login ? Combien de props ?**  
**R :** Il faudrait remonter l’état dans le parent commun (App) et le passer par props à chaque composant (prop drilling). Cela nécessiterait de nombreuses props (user, login, logout) et deviendrait vite lourd.

**Q4 : Pourquoi `e.preventDefault()` est indispensable dans handleSubmit ?**  
**R :** Pour empêcher le comportement par défaut du formulaire qui est de recharger la page. Sans cela, la page serait rafraîchie et on perdrait l’état React.

**Q5 : Que fait la destruction `{ password: _, ...user }` ? Pourquoi exclure le password ?**  
**R :** On extrait la propriété `password` dans une variable `_` (ignorée) et on récupère toutes les autres propriétés dans `user`. On exclut le mot de passe car il ne doit pas être stocké dans le state (sécurité). On ne garde que les infos nécessaires.

**Q6 : Pourquoi le Dashboard est un composant séparé et pas tout dans App ?**  
**R :** Pour des raisons de clarté et de séparation des responsabilités. `App` s’occupe de la condition d’authentification et `Dashboard` gère l’affichage principal. Cela évite d’avoir un composant trop gros et facilite la maintenance.

**Q7 : Testez le flux complet.**  
**R :** (Réponse pratique) On se connecte, on voit le dashboard, on se déconnecte, on revient au login. Tout fonctionne.

**Q8 : onLogout est un CALLBACK. Dessinez le flux : Header → onClick → onLogout → dispatch LOGOUT → App re-render → Login.**  
**R :**  
1. Clic sur le bouton "Déconnexion" dans `Header`.  
2. La prop `onLogout` (callback) est exécutée, ce qui appelle `dispatch({ type: 'LOGOUT' })`.  
3. Le reducer met à jour l'état (`user: null`).  
4. Le contexte notifie les consommateurs, donc `App` se re-rend.  
5. Dans `App`, `!authState.user` est vrai, donc `Login` est affiché.

**Q9 : Pourquoi le flash disparaît avec `useLayoutEffect` ?**  
**R :** `useLayoutEffect` s’exécute **avant** que le navigateur n’affiche la peinture (paint), tandis que `useEffect` s’exécute après. Avec `useEffect`, l’utilisateur voit d’abord le rendu initial (position (0,0)) puis un saut vers la bonne position. Avec `useLayoutEffect`, le calcul de position se fait avant l’affichage, donc l’utilisateur voit directement la bonne position.

**Q10 : Pourquoi ne pas utiliser `useLayoutEffect` partout si c’est mieux ?**  
**R :** `useLayoutEffect` bloque la peinture, ce qui peut ralentir l’affichage si les calculs sont lourds. Il est recommandé de l’utiliser seulement pour les effets qui nécessitent une mise à jour avant le rendu visuel (comme la mesure du DOM). Pour la plupart des cas (appels API, subscriptions), `useEffect` est suffisant et plus performant.

---

## Séance 3 : React Router, Axios & CRUD

**Q1 : Pourquoi `<Navigate />` (composant) et pas `navigate()` (hook) ici ?**  
**R :** Parce que `ProtectedRoute` est un composant qui doit retourner un élément JSX. `navigate()` est un hook et ne peut pas être appelé directement dans le rendu. `<Navigate />` est un composant qui effectue la redirection lors du rendu.

**Q2 : Quelle différence entre `navigate(from)` et `navigate(from, { replace: true })` ?**  
**R :** `navigate(from)` ajoute une nouvelle entrée dans l’historique du navigateur, donc l’utilisateur peut revenir à la page de login avec le bouton retour. `navigate(from, { replace: true })` remplace l’entrée courante de l’historique, donc le bouton retour ne ramène pas à la page de login (comportement souhaité après connexion).

**Q3 : Après un POST, pourquoi fait-on `setProjects(prev => [...prev, data])` plutôt qu’un re-fetch GET ?**  
**R :** Pour éviter une requête supplémentaire inutile. La réponse du POST contient déjà le projet créé (avec son id généré par json-server). On peut donc l’ajouter directement à l’état local, ce qui est plus efficace et plus rapide.

**Q5 : Quelle différence entre `<Link>` et `<NavLink>` ? Pourquoi `NavLink` ici ?**  
**R :** `<Link>` permet simplement de naviguer. `<NavLink>` en plus peut détecter si le lien correspond à l’URL courante et appliquer un style actif (`isActive`). On l’utilise ici pour mettre en surbrillance le projet sélectionné dans la sidebar.

**Q6 : Ce composant (`ProjectForm`) sert pour le POST ET le PUT. Qu'est-ce qui change entre les deux usages ?**  
**R :** Pour le POST, `initialName` et `initialColor` sont vides (ou valeurs par défaut). Pour le PUT, on passe les valeurs actuelles du projet à modifier via `initialName` et `initialColor`, et le `submitLabel` peut être "Modifier". La logique de soumission reste identique.

**Q7 : Arrêtez json-server et tentez un POST. Le message s'affiche ?**  
**R :** Oui, l’erreur est capturée par le bloc `catch` et affichée via le state `error`.

**Q8 : Avec fetch, un 404 ne lance PAS d’erreur. Avec Axios, que se passe-t-il ?**  
**R :** Avec Axios, une réponse HTTP avec un statut hors de la plage 2xx (comme 404) est considérée comme une erreur et déclenche le bloc `catch`. C’est un comportement différent de `fetch`, qui ne rejette la promesse que pour des erreurs réseau.