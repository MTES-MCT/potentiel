# language: fr
@accès
Fonctionnalité: Réclamer un projet en tant que porteur

    Plan du scénario: Réclamer un projet avec le même email que celui de la candidature
        Etant donné le projet <Statut> "Du boulodrome d'Agen"
        Et la dreal "Dreal du sud" associée à la région du projet
        Et l'accès retiré au projet <Statut>
        Quand un porteur réclame le projet <Statut> avec le même email que celui de la candidature
        Alors l'utilisateur devrait être actif
        Et le porteur a accès au projet <Statut>
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Du boulodrome d'Agen - Récupération de la gestion du projet |
            | nom_projet | Du boulodrome d'Agen                                                    |
            | url        | <Url>                                                                   |
        Et un email a été envoyé à la dreal avec :
            | sujet      | Potentiel - Du boulodrome d'Agen - Récupération de la gestion du projet |
            | nom_projet | Du boulodrome d'Agen                                                    |
            | url        | <Url>                                                                   |
        Mais le projet <Statut> n'est plus consultable dans la liste des projets à réclamer

        Exemples:
            | Statut  | Url                                        |
            | éliminé | https://potentiel.beta.gouv.fr/elimines/.* |
            | lauréat | https://potentiel.beta.gouv.fr/laureats/.* |

    Scénario: Réclamer un projet en connaissant le prix et le numéro CRE
        Etant donné le projet lauréat "Du boulodrome de Lormont"
        Et la dreal "Dreal du sud" associée à la région du projet
        Et l'accès retiré au projet lauréat
        Quand un porteur réclame le projet lauréat en connaissant le prix et le numéro CRE
        Alors l'utilisateur devrait être actif
        Et le porteur a accès au projet lauréat
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Du boulodrome de Lormont - Récupération de la gestion du projet |
            | nom_projet | Du boulodrome de Lormont                                                    |
            | url        | https://potentiel.beta.gouv.fr/laureats/.*                                  |
        Et un email a été envoyé à la dreal avec :
            | sujet      | Potentiel - Du boulodrome de Lormont - Récupération de la gestion du projet |
            | nom_projet | Du boulodrome de Lormont                                                    |
            | url        | https://potentiel.beta.gouv.fr/laureats/.*                                  |
        Mais le projet lauréat n'est plus consultable dans la liste des projets à réclamer

    Scénario: Impossible de réclamer un projet avec un email différent de celui de la candidature
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et l'accès retiré au projet lauréat
        Quand un porteur réclame le projet lauréat avec un email différent de celui de la candidature
        Alors l'utilisateur devrait être informé que "L'email du porteur ne correspond pas à l'email de la candidature"

    Scénario: Impossible de réclamer un projet sans connaître le prix et le numéro CRE
        Etant donné le projet lauréat "Du boulodrome de Merignac"
        Et l'accès retiré au projet lauréat
        Quand un porteur réclame le projet lauréat sans connaître le prix et le numéro CRE
        Alors l'utilisateur devrait être informé que "Le prix et le numéro CRE spécifiés ne correspondent pas à ceux de la candidature"

    Scénario: Impossible de réclamer un projet non notifié
        Etant donné la candidature lauréate "Du boulodrome de Pessac"
        Quand un porteur réclame la candidature lauréate
        Alors l'utilisateur devrait être informé que "Le projet n'est pas notifié"

    # Ce scénario n'est pas implémenté pour le moment car les specs ne testent pas les permissions,
    # et cette règle est implémentée dans le middelware des permissions
    @NotImplemented
    Scénario: Impossible de réclamer un projet déjà assigné à un porteur
        Etant donné le projet lauréat "Du boulodrome de Bordeaux"
        Quand un porteur réclame le projet lauréat en connaissant le prix et le numéro CRE
        Alors l'utilisateur devrait être informé que "Le projet est déjà assigné à un porteur"
