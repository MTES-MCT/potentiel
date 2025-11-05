# language: fr
@lauréat
Fonctionnalité: Enregistrer un changement de nom d'un projet lauréat en tant que porteur

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Petit PV Bâtiment |
        Et la dreal "Dreal du sud" associée à la région du projet

    Scénario: Enregistrer un changement de nom d'un projet lauréat en tant que porteur
        Quand un porteur enregistre un changement de nom du projet
        Alors le projet lauréat devrait être consultable
        Et un email a été envoyé à la dreal avec :
            | sujet      | Potentiel - Déclaration de changement de nom pour le projet Du boulodrome de Marseille dans le département(.*) |
            | nom_projet | Du boulodrome de Marseille                                                                                     |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                          |
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Déclaration de changement de nom pour le projet Du boulodrome de Marseille dans le département(.*) |
            | nom_projet | Du boulodrome de Marseille                                                                                     |
            | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                          |

    Scénario: Impossible d'enregistrer un changement de nom d'un projet abandonné
        Etant donné un abandon accordé pour le projet lauréat "Du boulodrome de Marseille"
        Quand un porteur enregistre un changement de nom du projet
        Alors le porteur devrait être informé que "Impossible de faire un changement pour un projet abandonné"

    Scénario: Impossible de faire un changement d'un projet lauréat si une demande d'abandon est en cours
        Et une demande d'abandon en cours pour le projet lauréat
        Quand un porteur enregistre un changement de nom du projet
        Alors le porteur devrait être informé que "Impossible de faire un changement car une demande d'abandon est en cours pour le projet"

    Scénario: Impossible d'enregistrer le changement de producteur d'un projet achevé
        Et une attestation de conformité transmise pour le projet lauréat
        Quand un porteur enregistre un changement de nom du projet
        Alors le porteur devrait être informé que "Impossible de faire un changement pour un projet achevé"

    Scénario: Impossible d'enregistrer un changement de nom d'un projet lauréat avec la même valeur
        Quand un porteur enregistre un changement de nom du projet avec la même valeur
        Alors l'utilisateur devrait être informé que "Les informations du projet n'ont pas été modifiées"

    # Règle AO
    Scénario: Impossible d'enregistrer un changement de nom d'un projet lauréat si le CDC ne le permet pas
        Etant donné le projet lauréat "Du boulodrome de Toulouse"
        Quand un porteur enregistre un changement de nom du projet
        Alors l'utilisateur devrait être informé que "Le cahier des charges de ce projet ne permet pas ce changement"
