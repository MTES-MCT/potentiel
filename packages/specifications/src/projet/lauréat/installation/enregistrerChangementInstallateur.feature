# language: fr
@installateur
@installation
Fonctionnalité: Enregistrer un changement d'installateur d'un projet lauréat

    Contexte:
        Etant donné le projet lauréat "Du boulodrome de Marseille" avec :
            | appel d'offres | PPE2 - Petit PV Bâtiment |
            | installateur   | Installateur.Inc         |
        Et la dreal "Dreal du sud" associée à la région du projet
        Et un cahier des charges permettant la modification du projet

    Scénario: Entrgistrer un changement d'installateur pour un projet lauréat en tant que porteur
        Quand le porteur enregistre un changement d'installateur du projet lauréat
        Alors l'installateur du projet lauréat devrait être mis à jour
        Et le changement d'installateur enregistré devrait être consultable
