# language: fr
Fonctionnalité: Réclamer un projet en tant que porteur

    Plan du scénario: Réclamer un projet avec le même email que celui de la candidature
        Etant donné le projet <Statut> "Du boulodrome de Marseille"
        Et l'accès retiré au projet <Statut>
        Quand un porteur réclame le projet <Statut> avec le même email que celui de la candidature
        Alors l'utilisateur doit être créé
        Et le nouveau porteur a accès au projet <Statut>
        Et le projet lauréat n'est plus consultable dans la liste des projets à réclamer

        Exemples:
            | Statut  |
            | éliminé |
            | lauréat |

    Scénario: Réclamer un projet en connaissant le prix et le numéro CRE
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et l'accès retiré au projet lauréat
        Quand un porteur réclame le projet lauréat en connaissant le prix et le numéro CRE
        Alors l'utilisateur doit être créé
        Et le nouveau porteur a accès au projet lauréat
        Alors le projet lauréat n'est plus consultable dans la liste des projets à réclamer

    Scénario: Impossible de réclamer un projet avec un email différent de celui de la candidature
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et l'accès retiré au projet lauréat
        Quand un porteur réclame le projet lauréat avec un email différent de celui de la candidature
        Alors l'utilisateur devrait être informé que "L'email du porteur ne correspond pas à l'email de la candidature"

    Scénario: Impossible de réclamer un projet sans connaître le prix et le numéro CRE
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et l'accès retiré au projet lauréat
        Quand un porteur réclame le projet lauréat sans connaître le prix et le numéro CRE
        Alors l'utilisateur devrait être informé que "Le prix et le numéro CRE spécifiés ne correspondent pas à ceux de la candidature"
