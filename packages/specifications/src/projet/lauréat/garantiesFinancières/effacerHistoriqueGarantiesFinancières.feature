# language: fr
Fonctionnalité: Effacer tout l'historique de garanties financières d'un projet

    Contexte:
        Etant donné le projet lauréat "Centrale PV"

    Scénario: Un admin supprime l'historique de garanties financières d'un projet
        Etant donné des garanties financières validées pour le projet "Centrale PV" avec :
            | type | six-mois-après-achèvement |
        Et des garanties financières à traiter pour le projet "Centrale PV" avec :
            | type | consignation |
        Quand un admin efface l'historique des garanties financières pour le projet "Centrale PV"
        Alors il ne devrait pas y avoir d'historique de garanties financières pour le projet "Centrale PV"

    Scénario: Impossible d'effacer l'historique des garanties financières s'il n'y a aucun historique de garanties financières sur le projet
        Quand un admin efface l'historique des garanties financières pour le projet "Centrale PV"
        Alors l'utilisateur devrait être informé que "Il n'y a aucunes garanties financières sur ce projet"
