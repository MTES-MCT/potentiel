# language: fr
Fonctionnalité: Supprimer la demande de changement d'actionnaire

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et le porteur "Marcel Patoulatchi" ayant accés au projet lauréat "Du boulodrome de Marseille"
        Et la dreal "Dreal du sud-ouest" associée à la région du projet

    Scénario: Le système supprime la demande de changement d'actionnaire si celui-ci est abandonné
        Etant donné une demande de changement d'actionnaire en cours pour le projet lauréat
        Et une demande d'abandon en cours pour le projet lauréat
        Quand le DGEC validateur accorde l'abandon pour le projet lauréat
        Alors la demande de changement de l'actionnaire ne devrait plus être consultable

    Scénario: Le système supprime la demande de changement d'actionnaire quand une attestation de conformité est transmise pour le projet
        Etant donné une demande de changement d'actionnaire en cours pour le projet lauréat
        Quand le porteur transmet une attestation de conformité pour le projet lauréat "Du boulodrome de Marseille" avec :
            | format attestation                            | application/pdf             |
            | contenu attestation                           | le contenu de l'attestation |
            | date transmission au co-contractant           | 2024-01-01                  |
            | format preuve transmission au co-contractant  | application/pdf             |
            | contenu preuve transmission au co-contractant | le contenu de la preuve     |
            | date                                          | 2024-01-05                  |
        Alors la demande de changement de l'actionnaire ne devrait plus être consultable
