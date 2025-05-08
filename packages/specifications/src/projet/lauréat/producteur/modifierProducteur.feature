# language: fr
@select
Fonctionnalité: Modifier le producteur d'un projet lauréat

    # TODO : notifs
    Scénario: Modifier le producteur d'un projet lauréat en tant qu'admin
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offre | PPE2 - Bâtiment |
            | période       | 1               |
        Quand le DGEC validateur modifie le producteur du projet lauréat
        Alors le producteur du projet lauréat devrait être mis à jour

    # Et un email a été envoyé au porteur avec :
    #     | sujet      | Potentiel - Modification du producteur pour le projet Du boulodrome de Marseille dans le département(.*) |
    #     | nom_projet | Du boulodrome de Marseille                                                                                  |
    #     | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                       |
    # Et un email a été envoyé à la dreal avec :
    #     | sujet      | Potentiel - Modification du producteur pour le projet Du boulodrome de Marseille dans le département(.*) |
    #     | nom_projet | Du boulodrome de Marseille                                                                                  |
    #     | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                       |
    Scénario: Modifier le producteur d'un projet lauréat abandonné
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offre | PPE2 - Bâtiment |
            | période       | 1               |
        Et un abandon accordé pour le projet lauréat
        Quand le DGEC validateur modifie le producteur du projet lauréat
        Alors le producteur du projet lauréat devrait être mis à jour

    # Et un email a été envoyé au porteur avec :
    #     | sujet      | Potentiel - Modification du producteur pour le projet Du boulodrome de Marseille dans le département(.*) |
    #     | nom_projet | Du boulodrome de Marseille                                                                                  |
    #     | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                       |
    # Et un email a été envoyé à la dreal avec :
    #     | sujet      | Potentiel - Modification du producteur pour le projet Du boulodrome de Marseille dans le département(.*) |
    #     | nom_projet | Du boulodrome de Marseille                                                                                  |
    #     | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                       |                                                                          |
    Scénario: Modifier le producteur d'un projet lauréat achevé
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offre | PPE2 - Bâtiment |
            | période       | 1               |
        Et une attestation de conformité transmise pour le projet lauréat
        Quand le DGEC validateur modifie le producteur du projet lauréat
        Alors le producteur du projet lauréat devrait être mis à jour

    # Et un email a été envoyé au porteur avec :
    #     | sujet      | Potentiel - Modification du producteur pour le projet Du boulodrome de Marseille dans le département(.*) |
    #     | nom_projet | Du boulodrome de Marseille                                                                                  |
    #     | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                       |
    # Et un email a été envoyé à la dreal avec :
    #     | sujet      | Potentiel - Modification du producteur pour le projet Du boulodrome de Marseille dans le département(.*) |
    #     | nom_projet | Du boulodrome de Marseille                                                                                  |
    #     | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                       |
    Scénario: Modifier le producteur d'un projet lauréat dont l'appel d'offre empêche un changement avant l'achèvement du projet
        Etant donné le projet lauréat legacy "Du boulodrome de Bordeaux" avec :
            | appel d'offre | Eolien |
            | période       | 1      |
        Quand le DGEC validateur modifie le producteur du projet lauréat
        Alors le producteur du projet lauréat devrait être mis à jour

    # Et un email a été envoyé au porteur avec :
    #     | sujet      | Potentiel - Modification du producteur pour le projet Du boulodrome de Marseille dans le département(.*) |
    #     | nom_projet | Du boulodrome de Marseille                                                                                  |
    #     | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                       |
    # Et un email a été envoyé à la dreal avec :
    #     | sujet      | Potentiel - Modification du producteur pour le projet Du boulodrome de Marseille dans le département(.*) |
    #     | nom_projet | Du boulodrome de Marseille                                                                                  |
    #     | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                       |                                                                           |
    Scénario: Impossible de modifier le producteur avec une valeur identique
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offre | PPE2 - Bâtiment |
            | période       | 1               |
        Quand le DGEC validateur modifie le producteur avec une valeur identique pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Le nouveau producteur est identique à celui associé au projet"

    Scénario: Impossible de modifier le producteur d'un projet éliminé
        Etant donné le projet éliminé "Du bouchon lyonnais"
        Quand le DGEC validateur modifie le producteur du projet lauréat
        Alors l'utilisateur devrait être informé que "Le projet lauréat n'existe pas"

    Scénario: Impossible de modifier le producteur d'un projet lauréat inexistant
        Quand le DGEC validateur modifie le producteur du projet lauréat
        Alors l'utilisateur devrait être informé que "Le projet lauréat n'existe pas"
