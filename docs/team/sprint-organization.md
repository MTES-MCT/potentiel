# Organisation de l'équipe de développement

## Semaine type

- Le premier lundi du sprint :
  - de 10h à 11h : Démo, sprint planning
  - de 11h15 à 12h : préparation des tâches de développement
- Le dernier mercredi du sprint :
  - de 10h à 11h : Rétrospective et préparation du prochain sprint
- Le dernier vendredi du sprint :
  - de 10h à 11h : Retrospective dev
  - de 14h à 17h : Préparation de la démo et du sprint planning du lundi
    - Revue de la roadmap de la dette technique
    - Conception et estimation des prochains sujets du sprint
    - Déploiement sur staging pour la démo ...
- Tous les jours :
  - de 9h30 à 9h45 : Daily meeting
  - de 10h à 12h et de 14h à 17h : Séance de Mob Programming

## Daily Meeting

- Durée : 15 min
- Chaque membre de l'équipe dit :
  - Ce qu'il a fait la veille
  - Ce qu'il va faire aujourd'hui
  - S'il est bloqué et a besoin d'aide

## Mob programming

- But : Développer en équipe les fonctionnalités prioritaires du sprint
- Avantages : éviter la surcharge des revues de code, mieux gérer le turnover ...
- Inconvénient : épuisant si pas bien organisé/timeboxé
- Déroulement :
  - De 10h à 12h et de 14h à 17h en semaine
  - La personne au clavier est guidée par les autres membres de l'équipe pendant 10 min
  - Une pause de 10 min par heure
- Si un membre doit faire une tâche annexe (correction d'un bug, aide support, passer un coup de fil ...) il peut sortir de la session avec l'accord de l'équipe et y revenir plus tard
- En dehors des horaires de Mob chacun peut avancer sur des sujets annexes (remboursement de la dette, rédaction de documentation, veille, ...)

## Gestion du support

- Rôle tournant par semaine :
  - Responsabilité :
    - Présenter la démonstration au début du sprint
    - Répondre aux questions de SAV
    - Investiguer les erreurs en production (sentry, remontées SAV)
    - Stopper l'équipe de dev si besoin de régler un problème COMPLEXE, URGENT et BLOQUANT pour les utilisateurs

## Conception des fonctionnalités

- Entre développeurs :
  - Créer un [event storming](../event-stormings/event-storming.template.drawio.svg) pour :
    - Identifier les éléments du DDD (events, commands, aggregates, read models, actors, ...)
    - Faire émerger le vocabulaire métier
    - Identifier les points flous pour les éclaircir avec les experts métier
- Avec les experts métier :
  - Éclaircir les points flous identifié lors de l'event storming
  - Valider l'event storming pour pouvoir commencer l'implémentation
  - Pour chaque commande définir les critères d'acceptation sous forme de scénarios grâce au language Gherkin
