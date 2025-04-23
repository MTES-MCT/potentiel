# language: fr
Fonctionnalité: Choisir un cahier des charges

    # TODO ajouter notifications
    # Et un email a été envoyé au porteur avec :
    #     | sujet      | Potentiel - Nouveau mode d'instruction choisi pour les demandes liées à votre projet Du boulodrome de Marseille |
    #     | nom_projet | Du boulodrome de Marseille                                                                                      |
    #     | url        | https://potentiel.beta.gouv.fr/projet/.*/details.html                                                           |
    Scénario: Choisir un cahier des charges modifié
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offre | PPE2 - Eolien |
            | période       | 1             |
        Quand le porteur choisit le cahier des charges "modifié paru le 30/08/2022"
        Alors le cahier des charges devrait être modifié

    # TODO ajouter notifications
    Scénario: Choisir le cahier des charges initial après avoir choisi un cahier des charges modifié
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offre | PPE2 - Eolien |
            | période       | 1             |
        Et le cahier des charges "modifié paru le 30/08/2022" choisi pour le projet lauréat
        Quand le porteur choisit le cahier des charges "initial"
        Alors le cahier des charges devrait être modifié

    Scénario: Impossible de choisir un cahier des charges identique au cahier des charges actuel
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offre | PPE2 - Eolien |
            | période       | 1             |
        Et le cahier des charges "modifié paru le 30/08/2022" choisi pour le projet lauréat
        Quand le porteur choisit le cahier des charges "modifié paru le 30/08/2022"
        Alors l'utilisateur devrait être informé que "Ce cahier des charges est identique à l'actuel"

    Scénario: Impossible de choisir un cahier des charges modifié inexistant
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offre | PPE2 - Eolien |
            | période       | 9             |
        Quand le porteur choisit le cahier des charges "modifié paru le 30/08/2022"
        Alors l'utilisateur devrait être informé que "Ce cahier des charges n'est pas disponible pour cette période"

    Scénario: Impossible de revenir au cahier des charges initial après avoir choisi un cahier des charges modifié si l'appel d'offre ne le permet pas
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offre | CRE4 - Bâtiment |
            | période       | 13              |
        Et le cahier des charges "modifié paru le 30/08/2022" choisi pour le projet lauréat
        Quand le porteur choisit le cahier des charges "initial"
        Alors l'utilisateur devrait être informé que "Il est impossible de revenir au cahier de charges en vigueur à la candidature"

    # Et un email a été envoyé au porteur
    # à ajouter après la migration Délai
    @NotImplemented
    Scénario: Choisir le cahier des charges du 30/08/2022 pour un projet mis en service dans l'intervalle défini applique le délai
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et une demande complète de raccordement pour le projet lauréat
        Et une date de mise en service pour le dossier de raccordement du projet lauréat
        Quand le porteur choisit le cahier des charges "30/08/2022"
        Alors le cahier des charges devrait être modifié
        Et la date d'achèvement a été modifiée

    # à ajouter après la migration Délai
    @NotImplemented
    Scénario: Choisir le cahier des charges du 30/08/2022 pour un projet mis en service hors de l'intervalle défini n'applique pas le délai
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Quand le porteur choisit un cahier des charges pour le projet lauréat
        Alors le cahier des charges devrait être modifié
        Et la date d'achèvement n'a pas été modifiée

    # à ajouter après la migration Délai
    @NotImplemented
    Scénario: Choisir le cahier des charges du 30/08/2022 pour un projet pas encore en service n'applique pas de délai
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Quand le porteur choisit un cahier des charges pour le projet lauréat
        Alors le cahier des charges devrait être modifié
        Et la date d'achèvement n'a pas été modifiée
