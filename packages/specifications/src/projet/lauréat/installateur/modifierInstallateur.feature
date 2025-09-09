# language: fr
@installateur
@select
Fonctionnalité: Modifier l'installateur d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et la dreal "Dreal du sud" associée à la région du projet
        Et un cahier des charges permettant la modification du projet

    Scénario: Modifier l'installateur d'un projet lauréat en tant qu'admin
        Quand le DGEC validateur modifie l'installateur du projet lauréat
        Alors l'installateur du projet lauréat devrait être mis à jour

    # Et un email a été envoyé au porteur avec :
    #     | sujet      | Potentiel - Modification du producteur pour le projet Du boulodrome de Marseille dans le département(.*) |
    #     | nom_projet | Du boulodrome de Marseille                                                                               |
    #     | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                    |
    # Et un email a été envoyé à la dreal avec :
    #     | sujet      | Potentiel - Modification du producteur pour le projet Du boulodrome de Marseille dans le département(.*) |
    #     | nom_projet | Du boulodrome de Marseille                                                                               |
    #     | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                    |
    Scénario: Modifier l'installateur d'un projet lauréat abandonné
        Etant donné un abandon accordé pour le projet lauréat
        Quand le DGEC validateur modifie l'installateur du projet lauréat
        Alors l'installateur du projet lauréat devrait être mis à jour

    # Et un email a été envoyé au porteur avec :
    #     | sujet      | Potentiel - Modification du producteur pour le projet Du boulodrome de Marseille dans le département(.*) |
    #     | nom_projet | Du boulodrome de Marseille                                                                               |
    #     | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                    |
    # Et un email a été envoyé à la dreal avec :
    #     | sujet      | Potentiel - Modification du producteur pour le projet Du boulodrome de Marseille dans le département(.*) |
    #     | nom_projet | Du boulodrome de Marseille                                                                               |
    #     | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                    |
    Scénario: Modifier l'installateur d'un projet lauréat achevé
        Etant donné une attestation de conformité transmise pour le projet lauréat
        Quand le DGEC validateur modifie l'installateur du projet lauréat
        Alors l'installateur du projet lauréat devrait être mis à jour

    # Et un email a été envoyé au porteur avec :
    #     | sujet      | Potentiel - Modification du producteur pour le projet Du boulodrome de Marseille dans le département(.*) |
    #     | nom_projet | Du boulodrome de Marseille                                                                               |
    #     | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                    |
    # Et un email a été envoyé à la dreal avec :
    #     | sujet      | Potentiel - Modification du producteur pour le projet Du boulodrome de Marseille dans le département(.*) |
    #     | nom_projet | Du boulodrome de Marseille                                                                               |
    #     | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                    |
    Scénario: Impossible de modifier l'installateur avec une valeur identique
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et la dreal "Dreal du sud" associée à la région du projet
        Quand le DGEC validateur modifie l'installateur avec une valeur identique pour le projet lauréat
        Alors l'utilisateur devrait être informé que "Le nouvel installateur est identique à celui associé au projet"

    Scénario: Impossible de modifier l'installateur d'un projet éliminé
        Etant donné le projet éliminé "Du bouchon lyonnais"
        Quand le DGEC validateur modifie l'installateur du projet éliminé
        Alors l'utilisateur devrait être informé que "Le projet lauréat n'existe pas"
