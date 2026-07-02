# language: fr
@raccordement
@document-raccordement
Fonctionnalité: Supprimer un document

  Contexte:
    Etant donné le gestionnaire de réseau "Enedis"
    Et le projet lauréat "Du boulodrome de Marseille"
    Et un cahier des charges permettant la modification du projet
    Et le gestionnaire de réseau "Enedis" attribué au raccordement du projet lauréat

  Plan du Scénario: Supprimer un document d'un dossier de raccordement
    Etant donné une demande complète de raccordement pour le projet lauréat
    Et un document <document existant> pour le projet lauréat
    Quand le porteur supprime une <document existant> pour le projet lauréat
    Alors le document ne devrait plus être consultable dans le dossier de raccordement du projet lauréat

    Exemples:
      | document existant                   |
      | proposition technique et financière |
      | convention de raccordement          |
      | convention directe de raccordement  |

  Scénario: Supprimer un document pour le dossier de raccordement d'un projet achevé
    Etant donné une demande complète de raccordement pour le projet lauréat
    Et un document proposition technique et financière pour le projet lauréat
    Et l'achèvement réel transmis pour le projet lauréat
    Quand le porteur supprime un document proposition technique et financière pour le projet lauréat
    Alors le document ne devrait plus être consultable dans le dossier de raccordement du projet lauréat

  Scénario: Supprimer un document pour un projet abandonné avec PPA
    Etant donné une demande complète de raccordement pour le projet lauréat
    Et un document proposition technique et financière pour le projet lauréat
    Et une demande d'abandon accordée avec déclaration de PPA
    Quand le porteur supprime un document proposition technique et financière pour le projet lauréat
    Alors le document ne devrait plus être consultable dans le dossier de raccordement du projet lauréat

  Scénario: Supprimer un document pour un projet en cours d'abandon avec PPA
    Etant donné une demande complète de raccordement pour le projet lauréat
    Et un document proposition technique et financière pour le projet lauréat
    Et une demande d'abandon en cours avec signalement de PPA pour le projet lauréat
    Quand le porteur supprime un document proposition technique et financière pour le projet lauréat
    Alors le document ne devrait plus être consultable dans le dossier de raccordement du projet lauréat

  Scénario: Impossible de modifier un document qui n'a pas été transmis
    Etant donné une demande complète de raccordement pour le projet lauréat
    Et une convention de raccordement pour le projet lauréat
    Quand le porteur supprime un document proposition technique et financière pour le projet lauréat
    Alors le porteur devrait être informé que "Il n'existe pas de document de ce type dans ce dossier de raccordement"

  Scénario: Impossible de supprimer un document pour un projet abandonné
    Etant donné une demande complète de raccordement pour le projet lauréat
    Et un document proposition technique et financière pour le projet lauréat
    Et une demande d'abandon en cours pour le projet lauréat
    Quand le porteur supprime un document proposition technique et financière pour le projet lauréat
    Alors le porteur devrait être informé que "Impossible de faire un changement car une demande d'abandon est en cours pour le projet"

  Scénario: Impossible de supprimer un document pour un projet avec une demande d'abandon en cours
    Etant donné une demande complète de raccordement pour le projet lauréat
    Et un document proposition technique et financière pour le projet lauréat
    Et une demande d'abandon accordée pour le projet lauréat "Du boulodrome de Marseille"
    Quand le porteur supprime un document proposition technique et financière pour le projet lauréat
    Alors le porteur devrait être informé que "Impossible de faire un changement pour un projet abandonné"



