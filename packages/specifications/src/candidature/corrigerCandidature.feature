# language: fr
@candidature
Fonctionnalité: Corriger une candidature

    Contexte:
        Etant donné la candidature lauréate "Du boulodrome de Marseille"

    Scénario: Corriger une candidature non notifiée
        Quand le DGEC validateur corrige la candidature avec :
            | nom candidat | abcd |
        Alors la candidature devrait être consultable
        Et le détail de la candidature devrait être consultable
        Et le porteur n'a pas été prévenu que son attestation a été modifiée

    Scénario: Corriger une candidature et ses détails (typiquement, par CSV)
        Quand le DGEC validateur corrige la candidature avec :
            | nom candidat | abcd                  |
            | détails      | {"Note carbone": "1"} |
        Alors la candidature devrait être consultable
        Et le détail de la candidature devrait être consultable

    Scénario: Corriger une candidature avec des champs de localité uniquement
        Quand le DGEC validateur corrige la candidature avec :
            | adresse 1 | ma nouvelle adresse |
        Alors la candidature devrait être consultable
        Et le détail de la candidature devrait être consultable
        Et le porteur n'a pas été prévenu que son attestation a été modifiée

    Scénario: Corriger une candidature notifiée en régénérant l'attestation
        Etant donné le projet lauréat "Boulodrome Sainte Livrade"
        Quand le DGEC validateur corrige la candidature avec :
            | nom candidat               | abcd |
            | doit régénérer attestation | oui  |
        Alors la candidature devrait être consultable
        Et l'attestation de désignation de la candidature devrait être consultable
        Et l'attestation de désignation de la candidature devrait être régénérée
        Et le détail de la candidature devrait être consultable
        Et le porteur a été prévenu que son attestation a été modifiée

    Scénario: Corriger une candidature notifiée sans régénérer l'attestation
        Etant donné le projet lauréat "Boulodrome Sainte Livrade"
        Quand le DGEC validateur corrige la candidature avec :
            | nom candidat               | abcd |
            | doit régénérer attestation | non  |
        Alors la candidature devrait être consultable
        Et l'attestation de désignation de la candidature devrait être consultable
        Et l'attestation de désignation de la candidature ne devrait pas être régénérée
        Et le détail de la candidature devrait être consultable
        Et le porteur n'a pas été prévenu que son attestation a été modifiée

    Scénario: Impossible de régénérer l'attestation d'une candidature non notifiée
        Quand le DGEC validateur corrige la candidature avec :
            | nom candidat               | abcd |
            | doit régénérer attestation | oui  |
        Alors l'administrateur devrait être informé que "L'attestation d'une candidature non notifiée ne peut pas être régénérée"

    Scénario: Impossible de changer l'AO d'une candidature
        Quand le DGEC validateur corrige la candidature avec :
            | appel d'offres | x |
        Alors l'administrateur devrait être informé que "L'appel d'offres spécifié n'existe pas"

    Scénario: Impossible de changer la période d'une candidature
        Quand le DGEC validateur corrige la candidature avec :
            | période | x |
        Alors l'administrateur devrait être informé que "La période spécifiée de l'appel d'offres n'existe pas"

    Scénario: Impossible de corriger une candidature avec une famille d'AO inexistante
        Quand le DGEC validateur corrige la candidature avec :
            | famille | x |
        Alors l'administrateur devrait être informé que "La famille spécifiée de la période de l'appel d'offres n'existe pas"

    Scénario: Impossible de changer le numéro CRE d'une candidature
        Quand le DGEC validateur corrige la candidature avec :
            | numéro CRE | x |
        Alors l'administrateur devrait être informé que "La candidature n'existe pas"

    Scénario: Impossible de corriger une candidature sans modifications
        Quand le DGEC validateur corrige la candidature sans modification
        Alors l'administrateur devrait être informé que "La candidature ne contient aucune modification"

    Scénario: Impossible de regénérer l'attestation d'une candidature sans modifications
        Etant donné le projet lauréat "Boulodrome Sainte Livrade"
        Quand le DGEC validateur corrige la candidature avec :
            | doit régénérer attestation | oui |
        Alors l'administrateur devrait être informé que "La candidature ne contient aucune modification"

    Scénario: Impossible de changer le statut d'une candidature lauréate notifiée en éliminée
        Etant donné le projet lauréat "Boulodrome Sainte Livrade"
        Quand le DGEC validateur corrige la candidature avec :
            | statut | éliminé |
        Alors l'administrateur devrait être informé que "Le statut d'une candidature ne peut être modifié après la notification"

    Scénario: Impossible de changer le statut d'une candidature éliminée notifiée en lauréate
        Etant donné le projet éliminé "Boulodrome Sainte Livrade"
        Quand le DGEC validateur corrige la candidature avec :
            | statut | classé |
        Alors l'administrateur devrait être informé que "Le statut d'une candidature ne peut être modifié après la notification"

    Plan du Scénario: Impossible de corriger une candidature avec une technologie non disponible pour l'appel d'offres
        Etant donné la candidature lauréate "Du boulodrome de Marseille" avec :
            | appel d'offres | <Appel d'offre> |
            | technologie    | N/A             |
        Quand le DGEC validateur corrige la candidature avec :
            | technologie | <Technologie> |
        Alors l'administrateur devrait être informé que "Cette technologie n'est pas disponible pour cet appel d'offres"

        Exemples:
            | Appel d'offre   | Technologie |
            | PPE2 - Bâtiment | eolien      |
            | PPE2 - Sol      | eolien      |
            | PPE2 - Eolien   | pv          |

    Scénario: Impossible de corriger une candidature sans indiquer de technologie si l'AO a plusieurs technologies disponibles
        Etant donné la candidature lauréate "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Neutre |
            | technologie    | pv            |
        Quand le DGEC validateur corrige la candidature avec :
            | technologie | N/A |
        Alors l'administrateur devrait être informé que "Une technologie est requise pour cet appel d'offres"

    Scénario: Impossible de corriger une candidature sans choix du coefficient K si la période le propose
        Etant donné la candidature lauréate "Du boulodrome de Marseille" avec :
            | statut         | classé          |
            | appel d'offres | PPE2 - Bâtiment |
            | période        | 10              |
            | famille        |                 |
        Quand le DGEC validateur corrige la candidature avec :
            | coefficient K choisi |  |
        Alors l'administrateur devrait être informé que "Le choix du coefficient K est requis pour cette période"

    Scénario: Impossible de corriger une candidature avec choix du coefficient K si la période ne le propose pas
        Etant donné la candidature lauréate "Du boulodrome de Marseille" avec :
            | statut         | classé          |
            | appel d'offres | PPE2 - Bâtiment |
            | période        | 9               |
            | famille        |                 |
        Quand le DGEC validateur corrige la candidature avec :
            | coefficient K choisi | oui |
        Alors l'administrateur devrait être informé que "Le choix du coefficient K ne peut être renseigné pour cette période"

    # champs spécifiques à l'appel d'offres simplifié - début
    Scénario: Corriger la puissance de site d'une candidature pour un appel d'offres qui a ce champ
        Etant donné la candidature lauréate "Du boulodrome de Marseille" avec :
            | appel d'offres    | PPE2 - Petit PV Bâtiment |
            | puissance de site | 100                      |
        Quand le DGEC validateur corrige la candidature avec :
            | puissance de site | 200 |
        Alors la candidature devrait être consultable

    Scénario: Corriger l'autorisation d'urbanisme d'une candidature pour un appel d'offres qui a ce champ
        Etant donné la candidature lauréate "Du boulodrome de Marseille" avec :
            | appel d'offres                                 | PPE2 - Petit PV Bâtiment |
            | numéro de l'autorisation d'urbanisme           | ancien numéro            |
            | date d'obtention de l'autorisation d'urbanisme | 01/01/2025               |
        Quand le DGEC validateur corrige la candidature avec :
            | numéro de l'autorisation d'urbanisme           | nouveau numéro |
            | date d'obtention de l'autorisation d'urbanisme | 01/07/2025     |
        Alors la candidature devrait être consultable

    Scénario: Corriger l'installateur d'une candidature pour un appel d'offres qui a ce champ
        Etant donné la candidature lauréate "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Petit PV Bâtiment |
            | installateur   | Installateur.Junior.Inc  |
        Quand le DGEC validateur corrige la candidature avec :
            | installateur | Installateur.Senior.Inc |
        Alors la candidature devrait être consultable

    Scénario: Corriger la nature de l'exploitation d'une candidature pour un appel d'offres qui a ce champ
        Etant donné la candidature lauréate "Du boulodrome de Marseille" avec :
            | appel d'offres                   | PPE2 - Petit PV Bâtiment         |
            | type de nature de l'exploitation | vente-avec-injection-en-totalité |
        Quand le DGEC validateur corrige la candidature avec :
            | type de nature de l'exploitation | vente-avec-injection-du-surplus |
            | taux prévisionnel aci            | 54                              |
        Alors la candidature devrait être consultable

    Scénario: Corriger le dispositif de stockadge d'une candidature pour un appel d'offres qui a ce champ requis
        Etant donné la candidature lauréate "Du boulodrome de Marseille" avec :
            | appel d'offres                           | PPE2 - Petit PV Bâtiment |
            | installation avec dispositif de stockage | oui                      |
            | capacité du dispositif                   | 3                        |
            | puissance du dispositif                  | 6                        |
        Quand le DGEC validateur corrige la candidature avec :
            | installation avec dispositif de stockage | non |
            | capacité du dispositif                   |     |
            | puissance du dispositif                  |     |
        Alors la candidature devrait être consultable

    Scénario: Impossible de corriger une candidature sans puissance de site pour un appel d'offres qui a ce champ requis
        Etant donné la candidature lauréate "Du boulodrome de Marseille" avec :
            | appel d'offres    | PPE2 - Petit PV Bâtiment |
            | puissance de site | 100                      |
        Quand le DGEC validateur corrige la candidature avec :
            | puissance de site |  |
        Alors l'administrateur devrait être informé que "La puissance de site est requise pour cet appel d'offres"

    Scénario: Impossible de corriger une candidature avec une puissance de site si l'appel d'offres ne le propose pas
        Quand le DGEC validateur corrige la candidature avec :
            | puissance de site | 100 |
        Alors l'administrateur devrait être informé que "La puissance de site ne peut être renseignée pour cet appel d'offres"

    Scénario: Impossible de corriger une candidature avec un installateur si l'appel d'offres ne le propose pas
        Quand le DGEC validateur corrige la candidature avec :
            | installateur | Installateur.Inc |
        Alors l'administrateur devrait être informé que "L'installateur ne peut être renseigné pour cet appel d'offres"

    Scénario: Impossible de corriger une candidature avec nature de l'exploitation si l'appel d'offres ne le propose pas
        Quand le DGEC validateur corrige la candidature avec :
            | type de nature de l'exploitation | vente-avec-injection-en-totalité |
        Alors l'administrateur devrait être informé que "La nature de l'exploitation ne peut être renseignée pour cet appel d'offres"

    Scénario: Impossible de corriger une candidature sans autorisation d'urbanisme si l'appel d'offres a ces champs requis
        Etant donné la candidature lauréate "Du boulodrome de Marseille" avec :
            | appel d'offres                                 | PPE2 - Petit PV Bâtiment |
            | numéro de l'autorisation d'urbanisme           | numéro d'autorisation    |
            | date d'obtention de l'autorisation d'urbanisme | 10/08/2024               |
        Quand le DGEC validateur corrige la candidature avec :
            | numéro de l'autorisation d'urbanisme           |  |
            | date d'obtention de l'autorisation d'urbanisme |  |
        Alors l'administrateur devrait être informé que "Le numéro et la date d'obtention de l'autorisation d'urbanisme sont requis pour cet appel d'offres"

    Scénario: Impossible de corriger une candidature avec une date d'obtention de l'autorisation d'urbanisme dans le futur
        Etant donné la candidature lauréate "Du boulodrome de Marseille" avec :
            | appel d'offres                                 | PPE2 - Petit PV Bâtiment |
            | numéro de l'autorisation d'urbanisme           | numéro d'autorisation    |
            | date d'obtention de l'autorisation d'urbanisme | 10/08/2024               |
        Quand le DGEC validateur corrige la candidature avec :
            | date d'obtention de l'autorisation d'urbanisme | 10/08/2070 |
        Alors l'administrateur devrait être informé que "La date d'obtention de l'autorisation d'urbanisme doit être antérieure à la date du jour"

    Scénario: Impossible de corriger une candidature sans dispositif de stockage pour un appel d'offres qui a ce champ requis
        Etant donné la candidature lauréate "Du boulodrome de Marseille" avec :
            | appel d'offres                           | PPE2 - Petit PV Bâtiment |
            | installation avec dispositif de stockage | oui                      |
        Quand le DGEC validateur corrige la candidature avec :
            | installation avec dispositif de stockage |  |
        Alors l'administrateur devrait être informé que "Le dispositif de stockage est requis pour cet appel d'offres"


# champs spécifiques à l'appel d'offres simplifié - fin