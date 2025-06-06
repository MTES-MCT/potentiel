# language: fr
Fonctionnalité: Importer une candidature

    Plan du scénario: Importer une candidature
        Quand le DGEC validateur importe la candidature "Du boulodrome de Marseille" avec :
            | statut | <Statut> |
        Alors la candidature devrait être consultable

        Exemples:
            | Statut  |
            | classé  |
            | éliminé |

    Scénario: Impossible d'importer 2 fois la même candidature
        Etant donné la candidature lauréate "Du boulodrome de Marseille"
        Quand le DGEC validateur importe la candidature "Du boulodrome de Marseille" avec :
            | statut | classé |
        Alors l'administrateur devrait être informé que "Il est impossible d'importer 2 fois la même candidature"

    Scénario: Impossible d'importer une candidature avec un AO inexistant
        Quand le DGEC validateur importe la candidature "Du boulodrome de Marseille" avec :
            | statut        | classé     |
            | appel d'offre | inexistant |
            | période       | 1          |
        Alors l'administrateur devrait être informé que "L'appel d'offre spécifié n'existe pas"

    Scénario: Impossible d'importer une candidature avec une période d'AO inexistante
        Quand le DGEC validateur importe la candidature "Du boulodrome de Marseille" avec :
            | statut        | classé          |
            | appel d'offre | PPE2 - Bâtiment |
            | période       | 812             |
        Alors l'administrateur devrait être informé que "La période d'appel d'offre spécifiée n'existe pas"

    Scénario: Impossible d'importer une candidature avec une famille d'AO inexistante
        Quand le DGEC validateur importe la candidature "Du boulodrome de Marseille" avec :
            | statut  | classé |
            | famille | 812    |
        Alors l'administrateur devrait être informé que "La famille de période d'appel d'offre spécifiée n'existe pas"

    Scénario: Impossible d'importer une candidature sans GF, pour un AO soumis aux GF
        Quand le DGEC validateur importe la candidature "Du boulodrome de Marseille" avec :
            | statut        | classé          |
            | appel d'offre | PPE2 - Bâtiment |
            | période       | 1               |
            | famille       |                 |
            | type GF       |                 |
        Alors l'administrateur devrait être informé que "Les garanties financières sont requises pour cet appel d'offre ou famille"

    Scénario: Impossible d'importer une candidature classée avec des GF "avec date d'échéance" si la date d'échéance est manquante
        Quand le DGEC validateur importe la candidature "Du boulodrome de Marseille" avec :
            | statut        | classé             |
            | appel d'offre | PPE2 - Bâtiment    |
            | période       | 1                  |
            | famille       |                    |
            | type GF       | avec-date-échéance |
        Alors l'administrateur devrait être informé que "La date d'échéance des garanties financières est requise"

    Scénario: Impossible d'importer une candidature classée avec des GF sans date d'échéance si la date d'échéance est indiquée
        Quand le DGEC validateur importe la candidature "Du boulodrome de Marseille" avec :
            | statut          | classé                    |
            | appel d'offre   | PPE2 - Bâtiment           |
            | période         | 1                         |
            | famille         |                           |
            | type GF         | six-mois-après-achèvement |
            | date d'échéance | 2024-01-01                |
        Alors l'administrateur devrait être informé que "La date d'échéance pour ce type de garanties financières ne peut être renseignée"

    Scénario: Impossible d'importer une candidature d'une période d'AO "legacy"
        Quand le DGEC validateur importe la candidature "Du boulodrome de Marseille" avec :
            | statut        | classé                      |
            | appel d'offre | CRE4 - Autoconsommation ZNI |
            | période       | 1                           |
            | famille       |                             |
        Alors l'administrateur devrait être informé que "Cette période est obsolète et ne peut être importée"

    Scénario: Impossible d'importer une candidature avec choix du coefficient K si la période ne le propose pas
        Quand le DGEC validateur importe la candidature "Du boulodrome de Marseille" avec :
            | statut               | classé          |
            | appel d'offre        | PPE2 - Bâtiment |
            | période              | 9               |
            | famille              |                 |
            | coefficient K choisi | oui             |
        Alors l'administrateur devrait être informé que "Le choix du coefficient K ne peut être renseigné pour cette période"

    Plan du Scénario: Impossible d'importer une candidature avec une technologie non disponible pour l'appel d'offres
        Quand le DGEC validateur importe la candidature "Du boulodrome de Marseille" avec :
            | appel d'offre | <Appel d'offre> |
            | technologie   | <Technologie>   |
        Alors l'administrateur devrait être informé que "Cette technologie n'est pas disponible pour cet appel d'offre"

        Exemples:
            | Appel d'offre   | Technologie |
            | PPE2 - Bâtiment | eolien      |
            | PPE2 - Sol      | eolien      |
            | PPE2 - Eolien   | pv          |

    Scénario: Impossible d'importer une candidature sans technologie si l'AO a plusieurs technologies
        Quand le DGEC validateur importe la candidature "Du boulodrome de Marseille" avec :
            | statut        | classé        |
            | appel d'offre | PPE2 - Neutre |
            | technologie   | N/A           |
        Alors l'administrateur devrait être informé que "Une technologie est requise pour cet appel d'offre"

    Scénario: Importer une candidature sans technologie si l'AO a une seule technologie
        Quand le DGEC validateur importe la candidature "Du boulodrome de Marseille" avec :
            | statut        | classé     |
            | appel d'offre | PPE2 - Sol |
            | technologie   | N/A        |
        Alors la candidature devrait être consultable

    Scénario: Impossible d'importer une candidature sans choix du coefficient K si la période le propose
        Quand le DGEC validateur importe la candidature "Du boulodrome de Marseille" avec :
            | statut               | classé          |
            | appel d'offre        | PPE2 - Bâtiment |
            | période              | 10              |
            | famille              |                 |
            | coefficient K choisi |                 |
        Alors l'administrateur devrait être informé que "Le choix du coefficient K est requis pour cette période"
