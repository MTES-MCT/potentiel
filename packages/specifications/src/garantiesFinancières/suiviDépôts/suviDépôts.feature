#Language: fr-FR
Fonctionnalité: Migrer des garanties financières à déposer
    Contexte: 
        Etant donné le projet "classé" "Centrale éolienne 20" de la région "Nouvelle-Aquitaine"

 Scénario: Migrer les garanties financières legacy 
        Quand un développeur migre des garanties financières à déposer pour le projet "Centrale éolienne 20" avec :
            | date limite de dépôt | 2023-11-01            |
        Et il devrait y avoir un dépôt de garanties financières "en attente" pour le projet "Centrale éolienne 20" avec :
            | date limite de dépôt | 2023-11-01            |
            | région               | Nouvelle-Aquitaine    |

   
                       