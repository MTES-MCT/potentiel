# language: fr
@raccordement
@document-raccordement
Fonctionnalité: Modifier le type d'un document de raccordement par le système

    Contexte:
        Etant donné le gestionnaire de réseau "Enedis"
        Et le projet lauréat "Du boulodrome de Marseille"
        Et un cahier des charges permettant la modification du projet
        Et le gestionnaire de réseau "Enedis" attribué au raccordement du projet lauréat
        Et la dreal "Dreal du sud" associée à la région du projet

    Plan du scénario: Modifier un type de document
        Etant donné une demande complète de raccordement pour le projet lauréat
        Et un document proposition technique et financière pour le projet lauréat
        Quand le système modifie le type du document avec :
            | document modifié         | proposition-technique-et-financière |
            | nouveau type de document | convention-de-raccordement          |
        Alors le document devrait être consultable dans le dossier de raccordement du projet lauréat

    Scénario: Impossible de modifier un document avec un type déjà transmis
        Etant donné une demande complète de raccordement pour le projet lauréat
        Et un document convention de raccordement pour le projet lauréat
        Et un document proposition technique et financière pour le projet lauréat
        Quand le système modifie le type du document avec :
            | document modifié         | convention-de-raccordement          |
            | nouveau type de document | proposition-technique-et-financière |
        Alors le porteur devrait être informé que "Un document de type proposition-technique-et-financière a déjà été transmis pour ce dossier de raccordement"

    Scénario: Impossible de modifier un type de document avec un type incompatible
        Etant donné une demande complète de raccordement pour le projet lauréat
        Et un document convention de raccordement pour le projet lauréat
        Et un document proposition technique et financière pour le projet lauréat
        Quand le système modifie le type du document avec :
            | document modifié         | <ancien type>  |
            | nouveau type de document | <nouveau type> |
        Alors le porteur devrait être informé que "Un document de type <nouveau type> a déjà été transmis pour ce dossier de raccordement"

        Exemples:
            | ancien type                         | nouveau type                        |
            | convention-de-raccordement          | proposition-technique-et-financière |
            | proposition-technique-et-financière | convention-de-raccordement          |

    Scénario: Impossible de modifier un document qui n'a pas été transmis
        Etant donné une demande complète de raccordement pour le projet lauréat
        Quand le système modifie le type du document avec :
            | document modifié         | convention-de-raccordement |
            | nouveau type de document | convention-de-raccordement |
        Alors le système devrait être informé que "Il n'existe pas de document de ce type dans ce dossier de raccordement"

    Scénario: Impossible de modifier un document sans modification
        Etant donné une demande complète de raccordement pour le projet lauréat
        Et un document transmis pour le projet lauréat
        Quand le système modifie le type du document avec les mêmes valeurs
        Alors le système devrait être informé que "Aucune modification n’a été apportée"

