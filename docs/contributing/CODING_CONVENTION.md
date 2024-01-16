# Convention de codage

## Application Web

### Framework/Approche utilisé :

- [NextJS](https://nextjs.org/) (App router + SSR)
- [React](https://fr.legacy.reactjs.org/)
- Atomic Web Design ([Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/))
- [react-dsfr](https://github.com/codegouvfr/react-dsfr)

### Structure :

```
├── packages
|   ├── applications
|   |   ├── ssr : Application NextJS
|   |   |   ├── src
|   |   |   |   ├── app        : emplacements des points d'entrées de l'application
|   |   |   |   ├── components : composants visuels organisés en suivant l'approche Atomic Design
|   |   |   |   ├── types
|   |   |   |   ├── utils      : fonctions utilitaires
|   |   |   ├── public : assets publics

```

### Routing (répertoire `app`)

Les répertoires permettant de formaliser les routes de l'applications sont plurialisés afin d'avoir des URLs du genre :

- pour l'accès à l'abandon d'un projet lauréat : `/laureats/[:id]/abandon`
- la liste complète des abandons : `/abandons`

### page.tsx

Pour afficher le contenu d'une URL, on utilise une `page.tsx` qui a les responsabilités suivantes :

- D'abord, récupérer les données à afficher à l'aide d'une `query` en utilisant le `mediator`
- Ensuite, convertir le `read model` en `props`
- Enfin retourner la page correspondante située dans la partie `pages` de l'Atomic Design (répertoire `components`)

### Les utilitaires clés

- Pour gérer les erreurs d'une page, il faut utiliser le composant utilitaire `PageWithErrorHandling`
- Pour récupérer l'utilisateur courant il faut utiliser l'utilitaire `withUtilisateur`
- En ce qui concerne les actions de formulaire utiliser l'utilitaire `formAction`

## Domaine métier

### Queries

### Use cases

### Commands

### Sagas

### Value type

## Infrastructure

### Adapters

### Notifications

### Projectors
