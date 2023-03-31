#Language: fr-FR
Fonctionnalité: Ajouter un gestionnaire de réseau

    Scénario: Un administrateur ajoute un gestionnaire de réseau
        Quand un administrateur ajoute un gestionnaire de réseau
        | Code EIC       | 17X100A100A0001A |
        | Raison sociale | Enedis           |
        | Format         | XXX              | 
        | Légende        | Trois lettres    |
        Alors le gestionnaire devrait être ajouté

    Scénario: Un administrateur ajoute un gestionnaire de réseau déjà existant
        Etant donné un gestionnaire de réseau ayant pour code EIC "17X100A100A0001B"
        Quand un administrateur ajoute un gestionnaire de réseau ayant le même code EIC
        Alors l'administrateur devrait être informé que "Le gestionnaire de réseau existe déjà"
