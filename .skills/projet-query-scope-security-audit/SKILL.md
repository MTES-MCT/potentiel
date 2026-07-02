---
name: projet-query-scope-security-audit
description: "Audit de securite des Query de @potentiel-domain/projet pour verifier l'application systematique des droits via getScopeProjetUtilisateur sur identifiantProjet et regions. Compatible Copilot et Claude Code."
---

# Skill: Audit Scope Securite des Query Projet

# Objectif
Verifier que toutes les Query du package @potentiel-domain/projet appliquent correctement les droits d'acces via getScopeProjetUtilisateur, avec filtrage effectif sur:
- identifiantProjet
- regions

# Perimetre d'audit
- Auditer uniquement les Query de type liste (naming ou chemin contenant lister).
- Exclure les Query de type consulter de cet audit.

# Compatibilite
- Copilot (format SKILL.md)
- Claude Code (contenu agentique reutilisable tel quel)

# Quand utiliser ce skill
- Revue de securite applicative sur le domaine projet
- Relecture de Pull Request touchant des Query
- Controle de regression apres refactor de Query
- Verification avant release

# Analyse de reference (cas attendu)
Reference analysee: packages/domain/projet/src/lauréat/représentantLégal/changement/lister/listerChangementReprésentantLégal.query.ts

Le pattern cible observe dans cette Query est:
1. La Query recoit utilisateur dans son payload.
2. Les dependances incluent getScopeProjetUtilisateur.
3. Le handler calcule scope au debut via getScopeProjetUtilisateur(Email.convertirEnValueType(utilisateur)).
4. Le filtre principal applique identifiantProjet: Where.matchAny(scope.identifiantProjets).
5. Le filtre de region applique localite.region: Where.matchAny(scope.regions) ou Where.matchAny(scope.régions) selon les types.
6. Les filtres metier (statut, appelOffre, nomProjet) s'ajoutent au scope, ils ne le remplacent pas.
7. L'acces aux donnees (list/get) se fait apres calcul du scope.

# Procedure d'audit
1. Lister uniquement les Query de type liste du package projet
2. Identifier pour chaque query si elle expose un acces lie a un utilisateur
3. Verifier le pattern de scope (appel + filtres)
4. Signaler les ecarts avec severite et correction proposee

# Commandes utiles
Utiliser ces commandes comme base:

```bash
rg --files packages/domain/projet/src | rg '/lister/.*\.query\.ts$'
```

```bash
rg -n "getScopeProjetUtilisateur|scope\.|identifiantProjet|region|région|Where\.matchAny" packages/domain/projet/src
```

```bash
rg -n "type .*Query = Message<|utilisateur:" packages/domain/projet/src | rg "Lister|lister"
```

# Checklist de conformite
Pour chaque fichier query:
- Presence de getScopeProjetUtilisateur dans les dependances
- Appel de getScopeProjetUtilisateur dans le handler
- Conversion de utilisateur en ValueType avant appel
- Filtre explicite sur identifiantProjet base sur scope.identifiantProjets
- Filtre explicite sur regions base sur scope.regions ou scope.régions
- Aucun chemin de code ne contourne le scope
- Aucun appel list/get avant calcul du scope (sauf cas explicitement public)
- Si le scope n'est pas applique: presence obligatoire d'un commentaire explicite de justification securite dans le fichier

# Regles de decision
Classer chaque query dans une categorie:
- Conforme: pattern complet, pas de contournement
- Conforme (exception documentee): absence de verification compensee par un commentaire explicite justifiant pourquoi la query peut etre consideree saine
- A verifier: pattern partiel ou ambigu
- Non conforme: absence de scope ou filtre incomplet
- Hors perimetre: query explicitement publique et documentee

# Format de rapport
Produire un rapport synthetique en tableau:
- Fichier
- Statut (Conforme, A verifier, Non conforme, Hors perimetre)
- Justification courte
- Correctif propose

# Correctifs recommandes
En cas de non conformite:
1. Ajouter getScopeProjetUtilisateur dans les dependances
2. Recuperer scope en debut de handler
3. Appliquer Where.matchAny(scope.identifiantProjets) sur identifiantProjet
4. Appliquer Where.matchAny(scope.regions) sur la region du projet
5. Ajouter un test de non regression pour ce controle d'acces

# Sortie attendue de l'agent
Toujours produire:
1. Un tableau de resultat complet (une ligne par Query).
2. Une section Risques majeurs avec les seules Non conformites.
3. Une section Correctifs minimaux avec snippets de patch proposes.

# Notes
- Si une query ne recoit pas utilisateur mais retourne des donnees de projet sensibles, ouvrir un point de securite.
- Sans commentaire explicite de justification securite, une query de liste sans verification de scope est Non conforme.
