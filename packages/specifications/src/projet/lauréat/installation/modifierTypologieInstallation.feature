# language: fr
@typologie-installation
@installation
Fonctionnalité: Modifier la typologie d'un projet

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et un cahier des charges permettant la modification du projet
        Et la dreal "Dreal du sud" associée à la région du projet

    Scénario: Modifier la typologie d'installation du projet lauréat
        Quand le DGEC validateur modifie la typologie d'installation du projet lauréat
        Alors l'installation du projet lauréat devrait être mise à jour
        Et la typologie d'installation du projet lauréat devrait être mise à jour

    Scénario: Impossible de modifier la typologie d'installation sans modification
        Quand le DGEC validateur modifie la typologie d'installation avec une valeur identique pour le projet lauréat
        Alors l'utilisateur devrait être informé que "La typologie d'installation est identique"
