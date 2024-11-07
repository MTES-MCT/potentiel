# language: fr
Fonctionnalité: Importer le représentant légal lors de la désignation d'une candidature lauréate

    Scénario: Importer le représentant légal lors de la désignation d'une candidature lauréate
        Etant donné le DGEC validateur "Robert Robichet"
        Et la candidature lauréate notifiée "Du boulodrome de Marseille"
        Alors le représentant légal du projet lauréat devrait être consultable

    Scénario: Impossible d'importer le représentant légal lors de la désignation d'une candidature inexistante
        Quand le représentant légal est importé pour le projet lauréat
        Alors l'utilisateur devrait être informé que "La candidature n'existe pas"
