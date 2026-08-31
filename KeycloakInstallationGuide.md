# Guide d'implémentation — Keycloak + Angular 19

Ce guide te montre comment intégrer OAuth2/OIDC avec Keycloak dans une app Angular 19.

---

## 1. Installation des dépendances

```bash
npm install
# ou si tu as déjà Angular CLI
npm install angular-oauth2-oidc
```

Ajoute `angular-oauth2-oidc` au `package.json` (voir fichier fourni).

---

## 2. Structure des fichiers

Crée cette structure dans `src/app/` :

```
src/
├── app/
│   ├── services/
│   │   └── auth.service.ts          ← Service d'authentification
│   ├── guards/
│   │   └── auth.guard.ts            ← Route guards
│   ├── interceptors/
│   │   └── auth.interceptor.ts      ← HTTP interceptor
│   ├── components/
│   │   ├── login.component.ts
│   │   ├── login-callback.component.ts
│   │   ├── dashboard.component.ts   ← À créer (ta page d'accueil)
│   │   ├── admin.component.ts       ← À créer (page admin)
│   │   └── forbidden.component.ts   ← À créer (erreur 403)
│   ├── app.component.ts             ← Root component
│   ├── app.routes.ts                ← Configuration du routing
│   ├── app.config.ts                ← Configuration providers
│   └── main.ts
└── index.html
```

---

## 3. Copie les fichiers fournis

Copie chacun des fichiers générer dans les dossiers correspondants:

- `auth.service.ts` → `src/app/services/auth.service.ts`
- `auth.guard.ts` → `src/app/guards/auth.guard.ts`
- `auth.interceptor.ts` → `src/app/interceptors/auth.interceptor.ts`
- `login.component.ts` → `src/app/components/login.component.ts`
- `login-callback.component.ts` → `src/app/components/login-callback.component.ts`
- `app.component.ts` → `src/app/app.component.ts`
- `app.routes.ts` → `src/app/app.routes.ts`
- `app.config.ts` → `src/app/app.config.ts`
- `main.ts` → `src/main.ts`

---

## 4. Crée les composants manquants

Tu dois créer 3 composants simples (les autres existent dans les fichiers fournis) :

### `src/app/components/dashboard.component.ts`

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <h2>Bienvenue, {{ (currentUser$ | async)?.username }}</h2>
      <p>Vous êtes connecté à l'application LoL Demo Server.</p>
      
      <div class="info-box">
        <h3>Vos informations</h3>
        <p><strong>Rôles :</strong> {{ getUserRolesText() }}</p>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 20px;
    }
    .info-box {
      background: white;
      padding: 15px;
      border-radius: 5px;
      margin-top: 20px;
    }
  `]
})
export class DashboardComponent {
  currentUser$ = this.authService.currentUser$;

  constructor(private authService: AuthService) { }

  getUserRolesText(): string {
    return this.authService.getUserRoles().join(', ') || 'Aucun rôle';
  }
}
```

### `src/app/components/admin.component.ts`

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin">
      <h2>Panneau Administrateur</h2>
      <p>Seuls les utilisateurs avec le rôle ADMIN peuvent voir cette page.</p>
    </div>
  `,
  styles: [`
    .admin {
      padding: 20px;
      background: white;
      border-radius: 5px;
    }
  `]
})
export class AdminComponent { }
```

### `src/app/components/forbidden.component.ts`

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="forbidden">
      <h2>Accès Refusé (403)</h2>
      <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
      <a routerLink="/dashboard">← Retour au dashboard</a>
    </div>
  `,
  styles: [`
    .forbidden {
      padding: 40px;
      text-align: center;
      background: white;
      border-radius: 5px;
      max-width: 600px;
      margin: 40px auto;
    }
    a {
      color: #667eea;
      text-decoration: none;
      font-weight: bold;
    }
    a:hover {
      text-decoration: underline;
    }
  `]
})
export class ForbiddenComponent { }
```

---

## 5. Configures les URLs Keycloak dans `auth.service.ts`

Vérifie ces valeurs dans le service :

```typescript
// À adapter si nécessaire :
clientId: 'lol-demo-server-client',           // Nom du client Keycloak
redirectUri: window.location.origin + '/login/callback',
issuer: 'http://localhost:9090/realms/lol-demo-server-realm', // Ton realm
```

**Important pour Docker** : Comme Angular tourne dans un container sur le port 3000 ET que Keycloak tourne sur 9090, la communication se fait via `localhost` (depuis le container). Si tu as besoin que Keycloak soit accessible depuis l'extérieur du container, utilise `host.docker.internal` ou configure les URLs correctement dans ton `docker-compose.yml`.

---

## 6. Lance l'app Angular

```bash
# Avec npm
npm start

# Ou avec Docker (il y a déjà le Dockerfile)
docker build -t lol-demo-server-frontend .
docker run -p 3000:4000 lol-demo-server-frontend
```

L'app démarre sur `http://localhost:3000` (ou 4000 selon ta config).

---

## 7. Flux complet de test

1. **Va sur** `http://localhost:3000/`
2. **Tu es redirigé vers** `/login` (pas authentifié)
3. **Clique sur** "Se connecter avec Keycloak"
4. **Keycloak demande** tes credentials (login/password)
5. **Keycloak redirige** vers `http://localhost:3000/login/callback?code=...`
6. **Angular échange le code** contre un JWT
7. **Tu es redirigé vers** `/dashboard` (authentifié)
8. **Le header affiche** ton username et un bouton "Déconnexion"

---

## 8. Points clés à vérifier

### ✅ Keycloak config
- [ ] Client `lol-demo-server-client` existe
- [ ] Client authentication : ON (Confidential)
- [ ] Direct access grants : ON
- [ ] Standard flow : ON
- [ ] Valid redirect URIs : `http://localhost:3000/login/callback`
- [ ] Web origins : `http://localhost:3000`
- [ ] Client scope "realm roles" assigné au client

### ✅ Spring Boot config
- [ ] `issuer-uri` pointe vers Keycloak
- [ ] JwtDecoder bean créé
- [ ] Security config avec les guards

### ✅ Angular config
- [ ] `angular-oauth2-oidc` installé
- [ ] `issuer` dans auth.service.ts pointe vers le bon realm
- [ ] AppComponent utilise `AuthService`
- [ ] Routing avec les guards

---

## 9. Dépannage

### "Client not allowed for direct access grants"
→ Reactive le toggle Direct Access Grants dans Keycloak et resauvegarde

### "Redirect URI mismatch"
→ Vérifie que `Valid redirect URIs` dans Keycloak = `http://localhost:3000/login/callback`

### "Token not valid"
→ Vérifie que le token n'a pas expiré, ou que le Bearer est bien formaté dans le header HTTP

### CORS error
→ Ajoute `http://localhost:3000` dans "Web origins" du client Keycloak

---

## 10. Améliorations futures

- [ ] Ajouter un interceptor pour refresh le token automatiquement avant expiration
- [ ] Stocker les tokens en HttpOnly cookies (plus sécurisé que localStorage)
- [ ] Ajouter un interceptor d'erreur 401 qui force le logout
- [ ] Implémenter le "Remember me" avec un Refresh Token
- [ ] Créer une page "Profil" qui affiche l'ID Token complet
