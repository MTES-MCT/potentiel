# language: fr
@candidature
Fonctionnalité: Corriger une candidature

    Contexte:
        Etant donné la candidature lauréate "Du boulodrome de Marseille"

    Scénario: Corriger une candidature non notifiée
        Quand le DGEC validateur corrige la candidature avec :
            | nom candidat | abcd |
        Alors la candidature devrait être consultable
        Et le porteur n'a pas été prévenu que son attestation a été modifiée

    Scénario: Corriger une candidature et ses détails (typiquement, par CSV)
        Quand le DGEC validateur corrige la candidature avec :
            | nom candidat | abcd                  |
            | détails      | {"Note carbone": "1"} |
        Alors la candidature devrait être consultable

    Scénario: Corriger une candidature avec des champs de localité uniquement
        Quand le DGEC validateur corrige la candidature avec :
            | adresse 1 | ma nouvelle adresse |
        Alors la candidature devrait être consultable
        Et le porteur n'a pas été prévenu que son attestation a été modifiée

    Scénario: Corriger une candidature notifiée en régénérant l'attestation
        Etant donné la candidature lauréate notifiée "Boulodrome Sainte Livrade"
        Quand le DGEC validateur corrige la candidature avec :
            | nom candidat               | abcd |
            | doit régénérer attestation | oui  |
        Alors la candidature devrait être consultable
        Et le porteur a été prévenu que son attestation a été modifiée
        Et l'attestation de désignation de la candidature devrait être consultable

    Scénario: Corriger une candidature notifiée sans régénérer l'attestation
        Etant donné la candidature lauréate notifiée "Boulodrome Sainte Livrade"
        Quand le DGEC validateur corrige la candidature avec :
            | nom candidat               | abcd |
            | doit régénérer attestation | non  |
        Alors la candidature devrait être consultable
        Et le porteur n'a pas été prévenu que son attestation a été modifiée
        Et l'attestation de désignation de la candidature devrait être consultable

    Scénario: Impossible de régénérer l'attestation d'une candidature non notifiée
        Quand le DGEC validateur corrige la candidature avec :
            | nom candidat               | abcd |
            | doit régénérer attestation | oui  |
        Alors l'administrateur devrait être informé que "L'attestation d'une candidature non notifiée ne peut pas être régénérée"

    Scénario: Impossible de changer l'AO d'une candidature
        Quand le DGEC validateur corrige la candidature avec :
            | appel d'offre | x |
        Alors l'administrateur devrait être informé que "L'appel d'offre spécifié n'existe pas"

    Scénario: Impossible de changer la période d'une candidature
        Quand le DGEC validateur corrige la candidature avec :
            | période | x |
        Alors l'administrateur devrait être informé que "La période d'appel d'offre spécifiée n'existe pas"

    Scénario: Impossible de corriger une candidature avec une famille d'AO inexistante
        Quand le DGEC validateur corrige la candidature avec :
            | famille | x |
        Alors l'administrateur devrait être informé que "La famille de période d'appel d'offre spécifiée n'existe pas"

    Scénario: Impossible de changer le numéro CRE d'une candidature
        Quand le DGEC validateur corrige la candidature avec :
            | numéro CRE | x |
        Alors l'administrateur devrait être informé que "La candidature n'existe pas"

    Scénario: Impossible de corriger une candidature sans GF, pour un AO soumis aux GF
        Etant donné la candidature lauréate "Centrale PV" avec :
            | appel d'offre | PPE2 - Bâtiment |
            | période       | 1               |
            | famille       |                 |
        Quand le DGEC validateur corrige la candidature avec :
            | type GF |  |
        Alors l'administrateur devrait être informé que "Les garanties financières sont requises pour cet appel d'offre ou famille"

    Scénario: Impossible de corriger une candidature classée avec des GF "avec date d'échéance" si la date d'échéance est manquante
        Quand le DGEC validateur corrige la candidature avec :
            | type GF | avec-date-échéance |
        Alors l'administrateur devrait être informé que "La date d'échéance des garanties financières est requise"

    Scénario: Impossible de corriger une candidature classée avec une date d'échéance pour un type de GF qui n'en attend pas
        Quand le DGEC validateur corrige la candidature avec :
            | type GF         | six-mois-après-achèvement |
            | date d'échéance | 2024-01-01                |
        Alors l'administrateur devrait être informé que "La date d'échéance ne peut être renseignée pour ce type de garanties financières"

    Scénario: Impossible de corriger une candidature classée avec exemption de GF si la date de délibération est manquante
        Quand le DGEC validateur corrige la candidature avec :
            | statut        | classé                   |
            | appel d'offre | PPE2 - Petit PV Bâtiment |
            | type GF       | exemption                |
        Alors l'administrateur devrait être informé que "La date de délibération de l'exemption des garanties financières est requise"

    Scénario: Impossible de corriger une candidature classée avec exemption de GF si la date de délibération est future
        Quand le DGEC validateur corrige la candidature avec :
            | statut               | classé                   |
            | appel d'offre        | PPE2 - Petit PV Bâtiment |
            | type GF              | exemption                |
            | date de délibération | 2050-01-01               |
        Alors l'administrateur devrait être informé que "La date de délibération de l'exemption des garanties financières ne peut pas être une date future"

    Scénario: Impossible de corriger une candidature classée avec une date de délibération pour un type de GF qui n'en attend pas
        Quand le DGEC validateur corrige la candidature avec :
            | statut               | classé                    |
            | appel d'offre        | PPE2 - Bâtiment           |
            | type GF              | six-mois-après-achèvement |
            | date de délibération | 2024-01-01                |
        Alors l'administrateur devrait être informé que "La date de délibération ne peut être renseignée pour ce type de garanties financières"

    Scénario: Impossible de corriger une candidature sans modifications
        Quand le DGEC validateur corrige la candidature sans modification
        Alors l'administrateur devrait être informé que "La candidature ne contient aucune modification"

    Scénario: Impossible de regénérer l'attestation d'une candidature sans modifications
        Etant donné la candidature lauréate notifiée "Boulodrome Sainte Livrade"
        Quand le DGEC validateur corrige la candidature avec :
            | doit régénérer attestation | oui |
        Alors l'administrateur devrait être informé que "La candidature ne contient aucune modification"

    Scénario: Impossible de changer le statut d'une candidature lauréate notifiée en éliminée
        Etant donné la candidature lauréate notifiée "Boulodrome Sainte Livrade"
        Quand le DGEC validateur corrige la candidature avec :
            | statut | éliminé |
        Alors l'administrateur devrait être informé que "Le statut d'une candidature ne peut être modifié après la notification"

    Scénario: Impossible de changer le statut d'une candidature éliminée notifiée en lauréate
        Etant donné la candidature éliminée notifiée "Boulodrome Sainte Livrade"
        Quand le DGEC validateur corrige la candidature avec :
            | statut | classé |
        Alors l'administrateur devrait être informé que "Le statut d'une candidature ne peut être modifié après la notification"

    Scénario: Impossible de changer le type de GF d'une candidature lauréate notifiée
        Etant donné la candidature lauréate notifiée "Boulodrome Sainte Livrade"
        Quand le DGEC validateur corrige la candidature avec :
            | type GF | six-mois-après-achèvement |
        Alors l'administrateur devrait être informé que "Le type de garanties financières d'une candidature ne peut être modifié après la notification"

    Scénario: Impossible de corriger une candidature avec choix du coefficient K si la période ne le propose pas
        Etant donné la candidature lauréate "Du boulodrome de Marseille" avec :
            | statut        | classé          |
            | appel d'offre | PPE2 - Bâtiment |
            | période       | 9               |
            | famille       |                 |
        Quand le DGEC validateur corrige la candidature avec :
            | coefficient K choisi | oui |
        Alors l'administrateur devrait être informé que "Le choix du coefficient K ne peut être renseigné pour cette période"

    Plan du Scénario: Impossible de corriger une candidature avec une technologie non disponible pour l'appel d'offres
        Etant donné la candidature lauréate "Du boulodrome de Marseille" avec :
            | appel d'offre | <Appel d'offre> |
            | technologie   | N/A             |
        Quand le DGEC validateur corrige la candidature avec :
            | technologie | <Technologie> |
        Alors l'administrateur devrait être informé que "Cette technologie n'est pas disponible pour cet appel d'offre"

        Exemples:
            | Appel d'offre   | Technologie |
            | PPE2 - Bâtiment | eolien      |
            | PPE2 - Sol      | eolien      |
            | PPE2 - Eolien   | pv          |

    Scénario: Impossible de corriger une candidature sans indiquer de technologie si l'AO a plusieurs technologies disponibles
        Etant donné la candidature lauréate "Du boulodrome de Marseille" avec :
            | appel d'offre | PPE2 - Neutre |
            | technologie   | pv            |
        Quand le DGEC validateur corrige la candidature avec :
            | technologie | N/A |
        Alors l'administrateur devrait être informé que "Une technologie est requise pour cet appel d'offre"

    Scénario: Impossible de corriger une candidature sans choix du coefficient K si la période le propose
        Etant donné la candidature lauréate "Du boulodrome de Marseille" avec :
            | statut        | classé          |
            | appel d'offre | PPE2 - Bâtiment |
            | période       | 10              |
            | famille       |                 |
        Quand le DGEC validateur corrige la candidature avec :
            | coefficient K choisi |  |
        Alors l'administrateur devrait être informé que "Le choix du coefficient K est requis pour cette période"

    Scénario: Impossible de corriger une candidature avec un type de garanties financières non disponible dans l'appel d'offre
        Etant donné la candidature lauréate "Du boulodrome de Marseille" avec :
            | statut        | classé          |
            | appel d'offre | PPE2 - Bâtiment |
        Quand le DGEC validateur corrige la candidature avec :
            | type GF | garantie-bancaire |
        Alors l'administrateur devrait être informé que "Ce type de garanties financières n'est pas disponible pour cet appel d'offre"
