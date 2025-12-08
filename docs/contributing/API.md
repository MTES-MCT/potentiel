# API

L'application Potentiel expose une API destinée à automatiser certaines opérations avec les parties prenantes.

## Description

L'API est hébergée au même titre que le reste de l'application, grâce aux [API Routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) de Next.js.

L'authentification est gérée par Keycloak, via le flow OAuth [client credentials](https://oauth.net/2/grant-types/client-credentials/). Chaque intégration donne lieu à un client keycloak. La procédure de création est détaillée plus bas.

## Cas d'usage

### Intégration avec les gestionnaires réseaux

Le cas des gestionnaires réseau nécessite de lier le client OAuth à un identifiant de gestionnaire réseau. Pour cela, on utilise les Groupes keycloak, et on fait en sorte que les groupes d'un utilisateur soit inclus dans son token JWT.

## Mise en place

L'ajout d'une nouvelle intégration demande, à ce jour, certaines opérations manuelles, à effectuer par l'équipe Potentiel.

- Créer un client Keycloak dans le realm Potentiel, de type `OpenID Connect`
- Activer `Client authentication`, et dans Authentication flow, décocher `Standard flow` et `Direct access grants`, cocher `Service accounts roles`
- le secret du client peut être trouvé dans l'onglet `Credentials`.

Configuration spécifique aux groupes, si nécessaire (ex: GestionnairesRéseau)

- Dans l'onglet `Client scopes` du client nouvellement créé, cliquer sur le premier scope (`...-dedicated`), puis `Add mapper` > `By configuration` > `Group membership`:
  - Name: `user-groups` (n'impacte pas la configuration )
  - Token Claim Name: `groups` (important)
  - garder les options par défaut
  - sauvegarder
- depuis la section `Users` du Realm, accéder au compte de service du client nouvellement créé (`service-account-...`)
- Ajouter un email au service account (NB: pas besoin que ce soit un email valide, le format recommandé est `NOM_DU_CLIENT@clients`, ex: `grd-integration-enedis@clients`). Sauvegarder.
- Ouvrir l'onglet `Groups` de l'utilisateur, puis `Join Group` et sélectionner `>` à coté de `GestionnairesRéseau`, puis cocher l'identifiant du gestionnaire concerné. (nb: s'il n'existe pas, le créer depuis la section `Groups` du Realm)

## Utilisation

### Générer un token

```bash
export CLIENT_ID=...
export CLIENT_SECRET=...
export ISSUER_URL=http://.../realms/Potentiel

curl -X POST \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials&client_id=$CLIENT_ID&client_secret=$CLIENT_SECRET" \
  "$ISSUER_URL/protocol/openid-connect/token"
```

### Utiliser le token

Le token généré ci-dessus doit-être passé au format `Bearer TOKEN` dans le header `Authorization` de toutes les requêtes passées à l'API.

Pour tester l'API, le token peut être utilisé dans le [playground](https://potentiel-dev.osc-fr1.scalingo.io/api/doc)
