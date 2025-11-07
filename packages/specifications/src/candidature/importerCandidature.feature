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

    Scénario: Importer une candidature avec un champ optionnel "obligation de solarisation "
        Quand le DGEC validateur importe la candidature "Du boulodrome de Marseille" avec :
            | statut                     | classé |
            | obligation de solarisation | oui    |
        Alors la candidature devrait être consultable

    Scénario: Importer une candidature avec un champ optionnel "installateur"
        Quand le DGEC validateur importe la candidature "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Petit PV Bâtiment |
            | installateur   | Installateur.Inc         |
            | statut         | classé                   |
        Alors la candidature devrait être consultable

    Scénario: Importer une candidature avec un champ requis "nature de l'exploitation"
        Quand le DGEC validateur importe la candidature "Du boulodrome de Marseille" avec :
            | appel d'offres                   | PPE2 - Petit PV Bâtiment         |
            | type de nature de l'exploitation | vente-avec-injection-en-totalité |
            | statut                           | classé                           |
        Alors la candidature devrait être consultable

    Scénario: Importer une candidature avec une puissance de site pour un appel d'offres qui a ce champ requis
        Quand le DGEC validateur importe la candidature "Du boulodrome de Marseille" avec :
            | appel d'offres    | PPE2 - Petit PV Bâtiment |
            | puissance de site | 100                      |
        Alors la candidature devrait être consultable

    Scénario: Importer une candidature avec une autorisation d'urbanisme pour un appel d'offres qui a ce champ requis
        Quand le DGEC validateur importe la candidature "Du boulodrome de Marseille" avec :
            | appel d'offres                                 | PPE2 - Petit PV Bâtiment |
            | numéro de l'autorisation d'urbanisme           | 123                      |
            | date d'obtention de l'autorisation d'urbanisme | 01/08/2025               |
        Alors la candidature devrait être consultable

    Scénario: Importer une candidature avec une information sur le couplage avec un dispositif de stockage pour un appel d'offres qui a ce champ requis
        Quand le DGEC validateur importe la candidature "Du boulodrome de Marseille" avec :
            | appel d'offres                           | PPE2 - Petit PV Bâtiment |
            | installation avec dispositif de stockage | oui                      |
            | puissance du dispositif                  | 3                        |
            | capacité du dispositif                   | 4                        |
        Alors la candidature devrait être consultable

    Scénario: Impossible d'importer 2 fois la même candidature
        Etant donné la candidature lauréate "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Bâtiment |
            | période        | 1               |
            | famille        |                 |
            | numéro CRE     | abc             |
        Quand le DGEC validateur importe la candidature "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Bâtiment |
            | période        | 1               |
            | famille        |                 |
            | numéro CRE     | abc             |
        Alors l'administrateur devrait être informé que "Il est impossible d'importer 2 fois la même candidature"

    Scénario: Impossible d'importer une candidature avec un AO inexistant
        Quand le DGEC validateur importe la candidature "Du boulodrome de Marseille" avec :
            | statut         | classé     |
            | appel d'offres | inexistant |
            | période        | 1          |
        Alors l'administrateur devrait être informé que "L'appel d'offres spécifié n'existe pas"

    Scénario: Impossible d'importer une candidature avec une période d'AO inexistante
        Quand le DGEC validateur importe la candidature "Du boulodrome de Marseille" avec :
            | statut         | classé          |
            | appel d'offres | PPE2 - Bâtiment |
            | période        | 812             |
        Alors l'administrateur devrait être informé que "La période spécifiée de l'appel d'offres n'existe pas"

    Scénario: Impossible d'importer une candidature avec une famille d'AO inexistante
        Quand le DGEC validateur importe la candidature "Du boulodrome de Marseille" avec :
            | statut  | classé |
            | famille | 812    |
        Alors l'administrateur devrait être informé que "La famille spécifiée de la période de l'appel d'offres n'existe pas"

    Scénario: Impossible d'importer une candidature d'une période d'AO "legacy"
        Quand le DGEC validateur importe la candidature "Du boulodrome de Marseille" avec :
            | statut         | classé                      |
            | appel d'offres | CRE4 - Autoconsommation ZNI |
            | période        | 1                           |
            | famille        |                             |
        Alors l'administrateur devrait être informé que "Cette période est obsolète et ne peut être importée"

    Scénario: Impossible d'importer une candidature avec choix du coefficient K si la période ne le propose pas
        Quand le DGEC validateur importe la candidature "Du boulodrome de Marseille" avec :
            | statut               | classé          |
            | appel d'offres       | PPE2 - Bâtiment |
            | période              | 9               |
            | famille              |                 |
            | coefficient K choisi | oui             |
        Alors l'administrateur devrait être informé que "Le choix du coefficient K ne peut être renseigné pour cette période"

    Plan du Scénario: Impossible d'importer une candidature avec une technologie non disponible pour l'appel d'offres
        Quand le DGEC validateur importe la candidature "Du boulodrome de Marseille" avec :
            | appel d'offres | <Appel d'offre> |
            | technologie    | <Technologie>   |
        Alors l'administrateur devrait être informé que "Cette technologie n'est pas disponible pour cet appel d'offres"

        Exemples:
            | Appel d'offre   | Technologie |
            | PPE2 - Bâtiment | eolien      |
            | PPE2 - Sol      | eolien      |
            | PPE2 - Eolien   | pv          |

    Scénario: Impossible d'importer une candidature sans technologie si l'AO a plusieurs technologies
        Quand le DGEC validateur importe la candidature "Du boulodrome de Marseille" avec :
            | statut         | classé        |
            | appel d'offres | PPE2 - Neutre |
            | technologie    | N/A           |
        Alors l'administrateur devrait être informé que "Une technologie est requise pour cet appel d'offres"

    Scénario: Importer une candidature sans technologie si l'AO a une seule technologie
        Quand le DGEC validateur importe la candidature "Du boulodrome de Marseille" avec :
            | statut         | classé     |
            | appel d'offres | PPE2 - Sol |
            | technologie    | N/A        |
        Alors la candidature devrait être consultable

    Scénario: Impossible d'importer une candidature sans choix du coefficient K si la période le propose
        Quand le DGEC validateur importe la candidature "Du boulodrome de Marseille" avec :
            | statut               | classé          |
            | appel d'offres       | PPE2 - Bâtiment |
            | période              | 10              |
            | famille              |                 |
            | coefficient K choisi |                 |
        Alors l'administrateur devrait être informé que "Le choix du coefficient K est requis pour cette période"

    Scénario: Impossible d'importer une candidature sans puissance de site pour un appel d'offres qui a ce champ requis
        Quand le DGEC validateur importe la candidature "Du boulodrome de Marseille" avec :
            | appel d'offres    | PPE2 - Petit PV Bâtiment |
            | puissance de site |                          |
        Alors l'administrateur devrait être informé que "La puissance de site est requise pour cet appel d'offres"

    Scénario: Impossible d'importer une candidature avec une puissance de site si l'appel d'offres ne le propose pas
        Quand le DGEC validateur importe la candidature "Du boulodrome de Marseille" avec :
            | appel d'offres    | PPE2 - Bâtiment |
            | puissance de site | 200             |
        Alors l'administrateur devrait être informé que "La puissance de site ne peut être renseignée pour cet appel d'offres"

    Scénario: Impossible d'importer une candidature avec l'installateur si l'appel d'offres ne le propose pas
        Quand le DGEC validateur importe la candidature "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Bâtiment  |
            | installateur   | Installateur.Inc |
        Alors l'administrateur devrait être informé que "L'installateur ne peut être renseigné pour cet appel d'offres"

    Scénario: Impossible d'importer une candidature avec la nature de l'exploitation si l'appel d'offres ne le propose pas
        Quand le DGEC validateur importe la candidature "Du boulodrome de Marseille" avec :
            | appel d'offres                   | PPE2 - Bâtiment                  |
            | type de nature de l'exploitation | vente-avec-injection-en-totalité |
        Alors l'administrateur devrait être informé que "La nature de l'exploitation ne peut être renseignée pour cet appel d'offres"

    Scénario: Impossible d'importer une candidature sans la nature de l'exploitation si l'appel d'offres la requiert
        Quand le DGEC validateur importe la candidature "Du boulodrome de Marseille" avec :
            | appel d'offres                   | PPE2 - Petit PV Bâtiment |
            | type de nature de l'exploitation |                          |
        Alors l'administrateur devrait être informé que "La nature de l'exploitation est requise pour cet appel d'offres"

    Scénario: Impossible d'importer une candidature sans autorisation d'urbanisme pour un appel d'offres qui a ces champs requis
        Quand le DGEC validateur importe la candidature "Du boulodrome de Marseille" avec :
            | appel d'offres                                 | PPE2 - Petit PV Bâtiment |
            | numéro de l'autorisation d'urbanisme           |                          |
            | date d'obtention de l'autorisation d'urbanisme |                          |
        Alors l'administrateur devrait être informé que "Le numéro et la date d'obtention de l'autorisation d'urbanisme sont requis pour cet appel d'offres"

    Scénario: Impossible d'importer une candidature avec une date d'obtention de l'autorisation d'urbanisme dans le futur
        Quand le DGEC validateur importe la candidature "Du boulodrome de Marseille" avec :
            | appel d'offres                                 | PPE2 - Petit PV Bâtiment |
            | numéro de l'autorisation d'urbanisme           | numéro d'autorisation    |
            | date d'obtention de l'autorisation d'urbanisme | 01/02/2060               |
        Alors l'administrateur devrait être informé que "La date d'obtention de l'autorisation d'urbanisme doit être antérieure à la date du jour"

    Scénario: Impossible d'importer une candidature sans dispositif de stockage pour un appel d'offres qui a ce champ requis
        Quand le DGEC validateur importe la candidature "Du boulodrome de Marseille" avec :
            | appel d'offres                           | PPE2 - Petit PV Bâtiment |
            | installation avec dispositif de stockage |                          |
            | capacité du dispositif                   |                          |
            | puissance du dispositif                  |                          |
        Alors l'administrateur devrait être informé que "Le dispositif de stockage est requis pour cet appel d'offres"

    Scénario: Impossible d'importer une candidature avec dispositif de stockage si l'appel d'offres ne le propose pas
        Quand le DGEC validateur importe la candidature "Du boulodrome de Marseille" avec :
            | appel d'offres                           | PPE2 - Bâtiment |
            | installation avec dispositif de stockage | non             |
        Alors l'administrateur devrait être informé que "Le dispositif de stockage n'est pas attendu pour cet appel d'offres"

    # garanties financières - début
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


# garanties financières - fin