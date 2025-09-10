# language: fr
@candidature
Fonctionnalité: Importer une candidature

    Plan du scénario: Importer une candidature
        Quand le DGEC validateur importe la candidature "Du boulodrome de Marseille" avec :
            | statut | <Statut> |
        Alors la candidature devrait être consultable

        Exemples:
            | Statut  |
            | classé  |
            | éliminé |

    Plan du Scénario: Importer une candidature avec les différents types de garanties financières
        Quand le DGEC validateur importe la candidature "Du boulodrome de Marseille" avec :
            | statut               | classé                 |
            | appel d'offre        | <appel d'offre>        |
            | type GF              | <type GF>              |
            | date de délibération | <date de délibération> |
            | date d'échéance      | <date d'échéance>      |
        Alors la candidature devrait être consultable

        Exemples:
            | appel d'offre            | type GF                   | date d'échéance | date de délibération |
            | PPE2 - Bâtiment          | consignation              |                 |                      |
            | PPE2 - Sol               | avec-date-échéance        | 01/12/2042      |                      |
            | PPE2 - Innovation        | six-mois-après-achèvement |                 |                      |
            | PPE2 - Petit PV Bâtiment | garantie-bancaire         |                 |                      |
            | PPE2 - Petit PV Bâtiment | exemption                 |                 | 02/11/2023           |

    Scénario: Importer une candidature avec un champ optionnel "obligation de solarisation "
        Quand le DGEC validateur importe la candidature "Du boulodrome de Marseille" avec :
            | statut                     | classé |
            | obligation de solarisation | oui    |
        Alors la candidature devrait être consultable

    Scénario: Importer une candidature avec un champ optionnel "installateur"
        Quand le DGEC validateur importe la candidature "Du boulodrome de Marseille" avec :
            | statut       | classé           |
            | installateur | Installateur.Inc |
        Alors la candidature devrait être consultable

    Scénario: Importer une candidature avec une puissance de site pour un appel d'offre qui a ce champ requis
        Quand le DGEC validateur importe la candidature "Du boulodrome de Marseille" avec :
            | appel d'offre     | PPE2 - Petit PV Bâtiment |
            | puissance de site | 100                      |
        Alors la candidature devrait être consultable

    Scénario: Importer une candidature avec une autorisation d'urbanisme pour un appel d'offre qui a ce champ requis
        Quand le DGEC validateur importe la candidature "Du boulodrome de Marseille" avec :
            | appel d'offre                                  | PPE2 - Petit PV Bâtiment |
            | numéro de l'autorisation d'urbanisme           | 123                      |
            | date d'obtention de l'autorisation d'urbanisme | 01/08/2025               |
        Alors la candidature devrait être consultable

    Scénario: Impossible d'importer 2 fois la même candidature
        Etant donné la candidature lauréate "Du boulodrome de Marseille" avec :
            | appel d'offre | PPE2 - Bâtiment |
            | période       | 1               |
            | famille       |                 |
            | numéro CRE    | abc             |
        Quand le DGEC validateur importe la candidature "Du boulodrome de Marseille" avec :
            | appel d'offre | PPE2 - Bâtiment |
            | période       | 1               |
            | famille       |                 |
            | numéro CRE    | abc             |
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

    Scénario: Impossible d'importer une candidature classée avec une date d'échéance pour un type de GF qui n'en attend pas
        Quand le DGEC validateur importe la candidature "Du boulodrome de Marseille" avec :
            | statut          | classé                    |
            | appel d'offre   | PPE2 - Bâtiment           |
            | période         | 1                         |
            | famille         |                           |
            | type GF         | six-mois-après-achèvement |
            | date d'échéance | 2024-01-01                |
        Alors l'administrateur devrait être informé que "La date d'échéance ne peut être renseignée pour ce type de garanties financières"

    Scénario: Impossible d'importer une candidature classée avec exemption de GF si la date de délibération est manquante
        Quand le DGEC validateur importe la candidature "Du boulodrome de Marseille" avec :
            | statut        | classé                   |
            | appel d'offre | PPE2 - Petit PV Bâtiment |
            | type GF       | exemption                |
        Alors l'administrateur devrait être informé que "La date de délibération de l'exemption des garanties financières est requise"

    Scénario: Impossible d'importer une candidature classée avec exemption de GF si la date de délibération est future
        Quand le DGEC validateur importe la candidature "Du boulodrome de Marseille" avec :
            | statut               | classé                   |
            | appel d'offre        | PPE2 - Petit PV Bâtiment |
            | type GF              | exemption                |
            | date de délibération | 2050-01-01               |
        Alors l'administrateur devrait être informé que "La date de délibération de l'exemption des garanties financières ne peut pas être une date future"

    Scénario: Impossible d'importer une candidature classée avec une date de délibération pour un type de GF qui n'en attend pas
        Quand le DGEC validateur importe la candidature "Du boulodrome de Marseille" avec :
            | statut               | classé                    |
            | appel d'offre        | PPE2 - Bâtiment           |
            | période              | 1                         |
            | famille              |                           |
            | type GF              | six-mois-après-achèvement |
            | date de délibération | 2024-01-01                |
        Alors l'administrateur devrait être informé que "La date de délibération ne peut être renseignée pour ce type de garanties financières"

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

    Scénario: Impossible d'importer une candidature avec un type de garanties financières non disponible dans l'appel d'offre
        Quand le DGEC validateur importe la candidature "Du boulodrome de Marseille" avec :
            | statut        | classé            |
            | appel d'offre | PPE2 - Bâtiment   |
            | type GF       | garantie-bancaire |
        Alors l'administrateur devrait être informé que "Ce type de garanties financières n'est pas disponible pour cet appel d'offre"

    Scénario: Impossible d'importer une candidature sans puissance de site pour un appel d'offre qui a ce champ requis
        Quand le DGEC validateur importe la candidature "Du boulodrome de Marseille" avec :
            | appel d'offre     | PPE2 - Petit PV Bâtiment |
            | puissance de site |                          |
        Alors l'administrateur devrait être informé que "La puissance de site est requise pour cet appel d'offre"

    Scénario: Impossible d'importer une candidature avec une puissance de site si l'appel d'offre ne le propose pas
        Quand le DGEC validateur importe la candidature "Du boulodrome de Marseille" avec :
            | appel d'offre     | PPE2 - Bâtiment |
            | puissance de site | 200             |
        Alors l'administrateur devrait être informé que "La puissance de site ne peut être renseignée pour cet appel d'offre"

    Scénario: Impossible d'importer une candidature avec l'installateur si l'appel d'offre ne le propose pas
        Quand le DGEC validateur importe la candidature "Du boulodrome de Marseille" avec :
            | appel d'offre | PPE2 - Bâtiment  |
            | installateur  | Installateur.Inc |
        Alors l'administrateur devrait être informé que "L'installateur ne peut être renseigné pour cet appel d'offre"

    Scénario: Impossible d'importer une candidature sans autorisation d'urbanisme pour un appel d'offre qui a ces champs requis
        Quand le DGEC validateur importe la candidature "Du boulodrome de Marseille" avec :
            | appel d'offre                                  | PPE2 - Petit PV Bâtiment |
            | numéro de l'autorisation d'urbanisme           |                          |
            | date d'obtention de l'autorisation d'urbanisme |                          |
        Alors l'administrateur devrait être informé que "Le numéro et la date d'obtention de l'autorisation d'urbanisme sont requis pour cet appel d'offre"

    Scénario: Impossible d'importer une candidature avec une date d'obtention de l'autorisation d'urbanisme dans le futur
        Quand le DGEC validateur importe la candidature "Du boulodrome de Marseille" avec :
            | appel d'offre                                  | PPE2 - Petit PV Bâtiment |
            | numéro de l'autorisation d'urbanisme           | numéro d'autorisation    |
            | date d'obtention de l'autorisation d'urbanisme | 01/02/2060               |
        Alors l'administrateur devrait être informé que "La date d'obtention de l'autorisation d'urbanisme doit être antérieure à la date du jour"
