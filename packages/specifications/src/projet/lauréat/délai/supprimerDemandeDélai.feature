# language: fr
@délai
Fonctionnalité: Supprimer la demande de délai

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Eolien |
        Et la dreal "Dreal du sud" associée à la région du projet
        Et un cahier des charges permettant la modification du projet

    Scénario: Accorder un abandon annule la demande de délai en cours d'un projet lauréat
        Etant donné une demande de délai en cours pour le projet lauréat
        Et une demande d'abandon en cours pour le projet lauréat
        Quand l'administrateur accorde la demande d'abandon pour le projet lauréat
        Alors la demande de délai ne devrait plus être consultable
