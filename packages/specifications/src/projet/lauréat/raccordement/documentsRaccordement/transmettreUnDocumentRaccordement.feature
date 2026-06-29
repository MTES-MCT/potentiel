# language: fr
@raccordement
@document-raccordement
Fonctionnalité: Transmettre un document raccordement

  Contexte:
    Etant donné le gestionnaire de réseau "Enedis"
    Et le projet lauréat "Du boulodrome de Marseille"
    Et un cahier des charges permettant la modification du projet
    Et le gestionnaire de réseau "Enedis" attribué au raccordement du projet lauréat

  Scénario: Un porteur de projet transmet un document raccordement pour ce dossier de raccordement
    Etant donné une demande complète de raccordement pour le projet lauréat
    Quand le porteur transmet un document raccordement pour le projet lauréat
    Alors le document raccordement devrait être consultable dans le dossier de raccordement du projet lauréat

  Scénario: Un porteur de projet transmet un document raccordement pour le dossier de raccordement d'un projet achevé
    Etant donné une demande complète de raccordement pour le projet lauréat
    Et l'achèvement réel transmis pour le projet lauréat
    Quand le porteur transmet un document raccordement pour le projet lauréat
    Alors le document raccordement devrait être consultable dans le dossier de raccordement du projet lauréat

  Scénario: Transmettre un document raccordement pour un projet abandonné avec PPA
    Etant donné une demande complète de raccordement pour le projet lauréat
    Et une demande d'abandon accordée avec déclaration de PPA
    Quand le porteur transmet un document raccordement pour le projet lauréat
    Alors le document raccordement devrait être consultable dans le dossier de raccordement du projet lauréat

  Scénario: Transmettre un document raccordement pour un projet en cours d'abandon avec PPA
    Etant donné une demande complète de raccordement pour le projet lauréat
    Et une demande d'abandon en cours avec signalement de PPA pour le projet lauréat
    Quand le porteur transmet un document raccordement pour le projet lauréat
    Alors le document raccordement devrait être consultable dans le dossier de raccordement du projet lauréat

  Scénario: Impossible de transmettre un document raccordement pour un projet sans dossier de raccordement
    Quand le porteur transmet un document raccordement pour le projet lauréat avec :
      | La référence du dossier de raccordement | OUE-RP-2022-000033 |
    Alors le porteur devrait être informé que "Le dossier n'est pas référencé dans le raccordement de ce projet"

  Scénario: Impossible de transmettre un document raccordement pour un dossier n'étant pas référencé dans le raccordement du projet
    Etant donné une demande complète de raccordement pour le projet lauréat
    Quand le porteur transmet un document raccordement pour le projet lauréat avec :
      | La référence du dossier de raccordement | OUE-RP-2022-000034 |
    Alors le porteur devrait être informé que "Le dossier n'est pas référencé dans le raccordement de ce projet"

  Scénario: Impossible de transmettre un document raccordement avec une date de signature dans le futur
    Etant donné une demande complète de raccordement pour le projet lauréat
    Quand le porteur transmet un document raccordement pour le projet lauréat avec :
      | La date de signature | 2999-12-31 |
    Alors le porteur devrait être informé que "La date ne peut pas être une date future"

  Scénario: Impossible de transmettre un document raccordement pour un projet abandonné
    Etant donné une demande complète de raccordement pour le projet lauréat
    Et une demande d'abandon en cours pour le projet lauréat
    Quand le porteur transmet un document raccordement pour le projet lauréat
    Alors le porteur devrait être informé que "Impossible de faire un changement car une demande d'abandon est en cours pour le projet"

  Scénario: Impossible de transmettre un document raccordement pour un projet avec une demande d'abandon en cours
    Etant donné une demande complète de raccordement pour le projet lauréat
    Et une demande d'abandon accordée pour le projet lauréat "Du boulodrome de Marseille"
    Quand le porteur transmet un document raccordement pour le projet lauréat
    Alors le porteur devrait être informé que "Impossible de faire un changement pour un projet abandonné"

  Scénario: Impossible de transmettre un document du même type qu'un document déjà transmis
    Etant donné une demande complète de raccordement pour le projet lauréat
    Et un document raccordement transmis pour le projet lauréat avec :
      | type de document | <type> |
    Quand le porteur transmet un document raccordement pour le projet lauréat avec :
      | type de document | <type> |
    Alors le porteur devrait être informé que "Un document de type <type> a déjà été transmis pour ce dossier de raccordement"

    Exemples:
      | type                                |
      | convention-directe-de-raccordement  |
      | convention-de-raccordement          |
      | proposition-technique-et-financière |

  Scénario: Impossible de transmettre une convention de type "proposition technique et financière" si une convention de type "convention directe de raccordement" a déjà été transmise
    Etant donné une demande complète de raccordement pour le projet lauréat
    Et un document raccordement transmis pour le projet lauréat avec :
      | type de document | convention-directe-de-raccordement |
    Quand le porteur transmet un document raccordement pour le projet lauréat avec :
      | type de document | proposition-technique-et-financière |
    Alors le porteur devrait être informé que "Il est impossible de transmettre un document de type proposition-technique-et-financière pour ce dossier de raccordement"

  Scénario: Impossible de transmettre une convention de type "convention de raccordement" si une convention de type "convention directe de raccordement" a déjà été transmise
    Etant donné une demande complète de raccordement pour le projet lauréat
    Et un document raccordement transmis pour le projet lauréat avec :
      | type de document | convention-directe-de-raccordement |
    Quand le porteur transmet un document raccordement pour le projet lauréat avec :
      | type de document | convention-de-raccordement |
    Alors le porteur devrait être informé que "Il est impossible de transmettre un document de type convention-de-raccordement pour ce dossier de raccordement"

  Scénario: Impossible de transmettre une convention de type "convention directe de raccordement" si une convention de type "convention de raccordement" a déjà été transmise
    Etant donné une demande complète de raccordement pour le projet lauréat
    Et un document raccordement transmis pour le projet lauréat avec :
      | type de document | convention-de-raccordement |
    Quand le porteur transmet un document raccordement pour le projet lauréat avec :
      | type de document | convention-directe-de-raccordement |
    Alors le porteur devrait être informé que "Il est impossible de transmettre un document de type convention-directe-de-raccordement pour ce dossier de raccordement"

  Scénario: Impossible de transmettre une convention de type "convention directe de raccordement" si une convention de type "proposition technique et financière" a déjà été transmise
    Etant donné une demande complète de raccordement pour le projet lauréat
    Et un document raccordement transmis pour le projet lauréat avec :
      | type de document | proposition-technique-et-financière |
    Quand le porteur transmet un document raccordement pour le projet lauréat avec :
      | type de document | convention-directe-de-raccordement |
    Alors le porteur devrait être informé que "Il est impossible de transmettre un document de type convention-directe-de-raccordement pour ce dossier de raccordement"
