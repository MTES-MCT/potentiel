# language: fr
@garanties-financières
Fonctionnalité: Accorder une mainlevée des garanties financières directement avec l'abandon du projet

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec : 
            | appel d'offres | PPE2 - Petit PV Bâtiment |
            | période        | 1                        |
        Et un cahier des charges permettant la modification du projet
        Et la dreal "Dreal du sud" associée à la région du projet

    Scénario: Un utilisateur Dreal accorde la mainlevée avec l'abandon du projet
        Etant donné des garanties financières actuelles pour le projet lauréat avec :
        | type GF | consignation |
        Et une demande d'abandon en cours pour le projet lauréat
        Quand la DREAL accorde la mainlevée des garanties financières avec l'abandon
        Alors une demande de mainlevée de garanties financières devrait être consultable
        Et les garanties financières actuelles du projet sont levées
        Et un email a été envoyé au porteur avec :
            | sujet                          | Potentiel - Du boulodrome de Marseille - Demande d'abandon accordée |
            | nom_projet                     | Du boulodrome de Marseille                                          |
            | url                            | https://potentiel.beta.gouv.fr/laureats/.*/abandon                  |
            | mainlevée_garanties_financière | true                                                                |
    
    Scénario: Impossible d'accorder une mainlevée avec l'abandon si les garanties financières ne sont pas constituées
        Etant donné une demande d'abandon en cours pour le projet lauréat
        Quand la DREAL accorde la mainlevée des garanties financières avec l'abandon
        Alors l'utilisateur devrait être informé que "L'attestation et la date de prise d'effet des garanties financières sont requises"


