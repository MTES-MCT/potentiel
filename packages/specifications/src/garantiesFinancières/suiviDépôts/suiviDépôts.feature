#Language: fr-FR
Fonctionnalité: Migrer des garanties financières à déposer

 Scénario: Migrer les garanties financières legacy 
        Etant donné le projet "classé" "Centrale éolienne 20" de la région "Nouvelle-Aquitaine"
        Quand un développeur migre des garanties financières à déposer pour le projet "Centrale éolienne 20" avec :
            | date limite de dépôt | 2023-11-01            |
        Alors il devrait y avoir un dépôt de garanties financières "en attente" pour le projet "Centrale éolienne 20" avec :
            | date limite de dépôt | 2023-11-01            |
            | région               | Nouvelle-Aquitaine    |

 Scénario: Filtrer les dépôts en attente selon le statut du projet
        Etant donné le projet "abandonné" "Centrale éolienne 20" de la région "Nouvelle-Aquitaine"
        Quand un développeur migre des garanties financières à déposer pour le projet "Centrale éolienne 20" avec :
            | date limite de dépôt | 2023-11-01            |
        Alors la liste des projets en attente de dépôt de garanties financières pour la région "Nouvelle-Aquitaine" devrait être vide

   
                       