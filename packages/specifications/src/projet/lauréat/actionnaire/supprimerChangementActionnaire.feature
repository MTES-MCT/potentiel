# language: fr
@actionnaire
Fonctionnalité: Supprimer la demande de changement d'actionnaire

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres | Eolien                      |
            | période        | 6                           |
            | actionnariat   | investissement-participatif |
        Et la dreal "Dreal du sud-ouest" associée à la région du projet
        Et un cahier des charges permettant la modification du projet

    Scénario: Le système supprime la demande de changement d'actionnaire si celui-ci est abandonné
        Etant donné une demande de changement d'actionnaire en cours pour le projet lauréat
        Et une demande d'abandon en cours pour le projet lauréat
        Quand le DGEC validateur accorde la demande d'abandon pour le projet lauréat
        Alors la demande de changement de l'actionnaire ne devrait plus être consultable
