# language: fr
@raccordement
@demande-complète-raccordement
Fonctionnalité: Modifier une DCR

    Contexte:
        Etant donné le gestionnaire de réseau "Enedis"
        Et le projet lauréat "Du boulodrome de Marseille"
        Et le gestionnaire de réseau "Enedis" attribué au raccordement du projet lauréat

    Plan du Scénario: Modifier une DCR
        Etant donné une demande complète de raccordement pour le projet lauréat
        Quand <role> modifie la demande complète de raccordement
        Alors le dossier est consultable dans la liste des dossiers de raccordement du projet lauréat
        Et la demande complète de raccordement devrait être consultable dans le dossier de raccordement du projet lauréat

        Exemples:
            | role             |
            | le porteur       |
            | la dreal         |
            | l'administrateur |

    Scénario: Un administrateur modifie une DCR pour un projet en service
        Etant donné une demande complète de raccordement pour le projet lauréat
        Et une date de mise en service pour le dossier de raccordement du projet lauréat
        Quand l'administrateur modifie la demande complète de raccordement
        Alors le dossier est consultable dans la liste des dossiers de raccordement du projet lauréat
        Et la demande complète de raccordement devrait être consultable dans le dossier de raccordement du projet lauréat

    Scénario: Un porteur de projet modifie une DCR importée par le système sans accusé de réception
        Etant donné une demande complète de raccordement sans accusé de réception pour le projet lauréat
        Quand le porteur modifie la demande complète de raccordement
        Alors le dossier est consultable dans la liste des dossiers de raccordement du projet lauréat
        Et la demande complète de raccordement devrait être consultable dans le dossier de raccordement du projet lauréat
        Et une tâche indiquant de "renseigner l'accusé de réception de la demande complète de raccordement" n'est plus consultable dans la liste des tâches du porteur pour le projet

    Plan du scénario: Ajouter une date de qualification à une DCR incomplète pour un projet en service
        Etant donné une demande complète de raccordement sans date de qualification pour le projet lauréat
        Et une date de mise en service pour le dossier de raccordement du projet lauréat
        Quand <role> modifie la demande complète de raccordement
        Alors le dossier est consultable dans la liste des dossiers de raccordement du projet lauréat
        Et la demande complète de raccordement devrait être consultable dans le dossier de raccordement du projet lauréat

        Exemples:
            | role       |
            | le porteur |
            | la dreal   |

    Plan du scénario: Ajouter l'accusé de réception à une DCR incomplète pour un projet en service
        Etant donné une demande complète de raccordement sans accusé de réception pour le projet lauréat
        Et une date de mise en service pour le dossier de raccordement du projet lauréat
        Quand <role> modifie la demande complète de raccordement
        Alors le dossier est consultable dans la liste des dossiers de raccordement du projet lauréat
        Et la demande complète de raccordement devrait être consultable dans le dossier de raccordement du projet lauréat

        Exemples:
            | role       |
            | le porteur |
            | la dreal   |

    Scénario: Impossible de modifier une DCR pour un projet sans dossier de raccordement
        Quand le porteur modifie la demande complète de raccordement avec :
            | La référence du dossier de raccordement | OUE-RP-2022-000033 |
        Alors le porteur devrait être informé que "Le dossier n'est pas référencé dans le raccordement de ce projet"

    Scénario: Impossible de modifier une DCR pour un dossier n'étant pas référencé dans le raccordement du projet
        Etant donné une demande complète de raccordement pour le projet lauréat avec :
            | La référence du dossier de raccordement | OUE-RP-2022-000033 |
        Quand le porteur modifie la demande complète de raccordement avec :
            | La référence du dossier de raccordement | OUE-RP-2022-000034 |
        Alors le porteur devrait être informé que "Le dossier n'est pas référencé dans le raccordement de ce projet"

    Scénario: Impossible de modifier une DCR avec une date de qualification dans le futur
        Etant donné une demande complète de raccordement pour le projet lauréat
        Quand le porteur modifie la demande complète de raccordement avec :
            | La date de qualification | 2999-12-31 |
        Alors le porteur devrait être informé que "La date ne peut pas être une date future"

    Plan du scénario: Impossible de modifier une DCR complète si le projet est déjà en service
        Etant donné une demande complète de raccordement pour le projet lauréat
        Et une date de mise en service pour le dossier de raccordement du projet lauréat
        Quand <role> modifie la demande complète de raccordement
        Alors <role> devrait être informé que "La demande complète de raccordement du dossier ne peut pas être modifiée car celui-ci dispose déjà d'une date de mise en service"

        Exemples:
            | role       |
            | le porteur |
            | la dreal   |
