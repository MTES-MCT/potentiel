# language: fr
@candidature
Fonctionnalité: Importer une candidature (garanties financières)

    Plan du Scénario: Importer une candidature avec les différents types de garanties financières
        Quand le DGEC validateur importe la candidature "Du boulodrome de Marseille" avec :
            | statut          | classé            |
            | appel d'offres  | <appel d'offres>  |
            | type GF         | <type GF>         |
            | date d'échéance | <date d'échéance> |
        Alors la candidature devrait être consultable

        Exemples:
            | appel d'offres           | type GF                   | date d'échéance |
            | PPE2 - Bâtiment          | consignation              |                 |
            | PPE2 - Sol               | avec-date-échéance        | 01/12/2042      |
            | PPE2 - Innovation        | six-mois-après-achèvement |                 |
            | PPE2 - Petit PV Bâtiment | exemption                 |                 |

    Scénario: Impossible d'importer une candidature sans GF, pour un AO soumis aux GF
        Quand le DGEC validateur importe la candidature "Du boulodrome de Marseille" avec :
            | statut         | classé          |
            | appel d'offres | PPE2 - Bâtiment |
            | période        | 1               |
            | famille        |                 |
            | type GF        |                 |
        Alors l'administrateur devrait être informé que "Les garanties financières sont requises pour cet appel d'offres ou famille"

    Scénario: Impossible d'importer une candidature classée avec des GF "avec date d'échéance" si la date d'échéance est manquante
        Quand le DGEC validateur importe la candidature "Du boulodrome de Marseille" avec :
            | statut         | classé             |
            | appel d'offres | PPE2 - Bâtiment    |
            | période        | 1                  |
            | famille        |                    |
            | type GF        | avec-date-échéance |
        Alors l'administrateur devrait être informé que "La date d'échéance des garanties financières est requise"

    Scénario: Impossible d'importer une candidature classée avec des GF constituées dans le futur
        Quand le DGEC validateur importe la candidature "Du boulodrome de Marseille" avec :
            | statut                | classé                  |
            | appel d'offres        | PPE2 -Petit PV Bâtiment |
            | période               | 1                       |
            | famille               |                         |
            | type GF               | exemption               |
            | date de constitution  | 2050-01-01              |
            | format attestation GF | application/pdf         |
        Alors l'administrateur devrait être informé que "La date de prise d'effet des garanties financières ne peut pas être une date future"

    Scénario: Impossible d'importer une candidature classée avec une date d'échéance pour un type de GF qui n'en attend pas
        Quand le DGEC validateur importe la candidature "Du boulodrome de Marseille" avec :
            | statut          | classé                    |
            | appel d'offres  | PPE2 - Bâtiment           |
            | période         | 1                         |
            | famille         |                           |
            | type GF         | six-mois-après-achèvement |
            | date d'échéance | 2024-01-01                |
        Alors l'administrateur devrait être informé que "La date d'échéance ne peut être renseignée pour ce type de garanties financières"

    Scénario: Impossible d'importer une candidature avec un type de garanties financières non disponible dans l'appel d'offres
        Quand le DGEC validateur importe la candidature "Du boulodrome de Marseille" avec :
            | statut         | classé          |
            | appel d'offres | PPE2 - Bâtiment |
            | type GF        | exemption       |
        Alors l'administrateur devrait être informé que "Ce type de garanties financières n'est pas disponible pour cet appel d'offres"
