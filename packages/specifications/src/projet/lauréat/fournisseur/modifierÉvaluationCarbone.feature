# language: fr
@fournisseur
Fonctionnalité: Modifier l'évaluation carbone du projet

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille"
        Et un cahier des charges permettant la modification du projet
        Et la dreal "Dreal du sud" associée à la région du projet

    Scénario: Modifier l'évaluation carbone du projet
        Quand un administrateur modifie l'évaluation carbone du projet
        Alors le fournisseur devrait être mis à jour
        Et un email a été envoyé à la dreal avec :
            | sujet      | Potentiel - Du boulodrome de Marseille - Modification de l'évaluation carbone simplifiée |
            | nom_projet | Du boulodrome de Marseille                                                               |
            | url        | https://potentiel.beta.gouv.fr/laureats/.*                                               |
        Et un email a été envoyé au porteur avec :
            | sujet      | Potentiel - Du boulodrome de Marseille - Modification de l'évaluation carbone simplifiée |
            | nom_projet | Du boulodrome de Marseille                                                               |
            | url        | https://potentiel.beta.gouv.fr/laureats/.*                                               |

    Scénario: Impossible de modifier l'évaluation carbone avec une valeur identique
        Quand un administrateur modifie l'évaluation carbone du projet avec la même valeur
        Alors l'utilisateur devrait être informé que "L'évaluation carbone doit avoir une valeur différente"

    Scénario: Impossible de modifier l'évaluation carbone avec une valeur négative
        Quand un administrateur modifie l'évaluation carbone du projet avec :
            | évaluation carbone | -1 |
        Alors l'utilisateur devrait être informé que "L'évaluation carbone ne peut être négative"

    Scénario: Impossible de modifier l'évaluation carbone avec une valeur autre qu'un nombre
        Quand un administrateur modifie l'évaluation carbone du projet avec :
            | évaluation carbone | hello |
        Alors l'utilisateur devrait être informé que "L'évaluation carbone doit être un nombre"
