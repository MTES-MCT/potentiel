# language: fr
@garanties-financières
@mainlevée
Fonctionnalité: Accorder une mainlevée des garanties financières directement avec l'abandon du projet

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec : 
            | appel d'offres | PPE2 - Petit PV Bâtiment |
            | période        | 1                        |
        Et des garanties financières actuelles pour le projet lauréat avec :
            | type GF | consignation |    
        Et un cahier des charges permettant la modification du projet
        Et la dreal "Dreal du sud" associée à la région du projet

    Scénario: Un utilisateur Dreal accorde la mainlevée avec l'abandon du projet
        Etant donné une demande d'abandon en cours pour le projet lauréat
        Quand la DREAL accorde la mainlevée des garanties financières avec l'abandon
        Alors une demande de mainlevée de garanties financières devrait être consultable
        Et les garanties financières actuelles du projet sont levées
        Et un email a été envoyé au porteur avec :
            | sujet                          | Potentiel - Du boulodrome de Marseille - Demande d'abandon accordée |
            | nom_projet                     | Du boulodrome de Marseille                                          |
            | url                            | https://potentiel.beta.gouv.fr/laureats/.*/abandon                  |
            | mainlevée_garanties_financières | true                                                                |

    Scénario: Impossible d'accorder une mainlevée avec l'abandon si les garanties financières ne sont pas constituées
        Etant donné le projet lauréat "Du boulodrome de l'Estaque" avec : 
            | appel d'offres | PPE2 - Petit PV Bâtiment |
            | période        | 1                        |
        Et une demande d'abandon en cours pour le projet lauréat
        Quand la DREAL accorde la mainlevée des garanties financières avec l'abandon
        Alors l'utilisateur devrait être informé que "L'attestation et la date de prise d'effet des garanties financières sont requises"

    Scénario: Impossible d'accorder une mainlevée avec l'abandon d'un projet exempté de garanties financières
        Etant donné des garanties financières actuelles pour le projet lauréat avec :
            | type GF              | exemption  |
            | date de constitution | 2025-01-01 |
        Et une demande d'abandon en cours pour le projet lauréat    
        Quand la DREAL accorde la mainlevée des garanties financières avec l'abandon
        Alors la DREAL devrait être informé que "Le projet est exempt de garanties financières"

    Scénario: Impossible d'accorder une mainlevée avec l'abandon si le projet dispose de garanties financières échues
        Etant donné des garanties financières actuelles échues le "2024-07-17" pour le projet lauréat
        Et une demande d'abandon en cours pour le projet lauréat  
        Quand la DREAL accorde la mainlevée des garanties financières avec l'abandon
        Alors la DREAL devrait être informé que "Les garanties financières du projet sont déjà échues"

    Scénario: Impossible d'accorder une mainlevée avec l'abandon d'un projet s'il y a un dépôt de garanties financières en cours
        Etant donné un dépôt de garanties financières avec :
            | type GF | consignation |  
        Et une demande d'abandon en cours pour le projet lauréat  
        Quand la DREAL accorde la mainlevée des garanties financières avec l'abandon
        Alors la DREAL devrait être informé que "Vous avez de nouvelles garanties financières à traiter pour ce projet. Pour demander la levée des garanties financières déjà validées vous devez d'abord annuler le dernier dépôt en attente de validation."

    
