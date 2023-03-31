#Language: fr-FR
Fonctionnalité: Modifier un gestionnaire de réseau

Scénario: Un administrateur modifie un gestionnaire de réseau
    Etant donné un gestionnaire de réseau
    | Code EIC          | 17X100A100A0001A  |
    | Raison sociale    | Enedis            |
    Quand un administrateur modifie les données du gestionnaire de réseau
    | Raison sociale | RTE              |
    | Légende        | Trois lettres    |
    | Format         | XXX              | 
    Alors le gestionnaire de réseau devrait être à jour dans le référenciel des gestionnaires de réseau
    Et l'administrateur devrait pouvoir consulter les détails à jour du gestionnaire de réseau

Scénario: Un administrateur modifie un gestionnaire de réseau inconnu
    Quand un administrateur modifie un gestionnaire de réseau inconnu
    Alors l'administrateur devrait être informé que "Le gestionnaire de réseau n'existe pas"
