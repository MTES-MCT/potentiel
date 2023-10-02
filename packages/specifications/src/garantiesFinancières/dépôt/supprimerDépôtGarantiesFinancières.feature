#Language: fr-FR

Fonctionnalité: Supprimer un dépôt de garanties financières
    Contexte: 
        Etant donné le projet "classé" "Centrale éolienne 20" de la région "Nouvelle-Aquitaine"

    Scénario: Supprimer un dépôt de garanties financières 
        Etant donné des garanties financières à déposer pour le projet "Centrale éolienne 20" avec :
            | date limite de dépôt | 2023-11-01            |
        Et un dépôt de garanties financières pour le projet "Centrale éolienne 20"
        Quand un utilisateur avec le rôle porteur-projet supprime le dépôt de garanties financières pour le projet "Centrale éolienne 20"
        Alors le dépôt de garanties financières devrait être supprimé pour le projet "Centrale éolienne 20"
        Et il devrait y avoir un dépôt de garanties financières "en attente" pour le projet "Centrale éolienne 20" avec :
            | date limite de dépôt | 2023-11-01            |
            | région               | Nouvelle-Aquitaine    |

    Scénario: Impossible de supprimer un dépôt inexistant
        Quand un utilisateur avec le rôle porteur-projet supprime le dépôt de garanties financières pour le projet "Centrale éolienne 20"
        Alors l'utilisateur devrait être informé que "Le dépôt de garanties financières n'a pas été trouvé pour ce projet. Veuillez contacter un administrateur si le problème persiste."  

                       