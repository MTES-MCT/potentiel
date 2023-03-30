#Language: fr-FR
Fonctionnalité: Modifier un gestionnaire de réseau

Scénario: Un administrateur modifie un gestionnaire de réseau
    Etant donné un gestionnaire de réseau
    Quand un administrateur modifie les données du gestionnaire de réseau
    Alors le gestionnaire de réseau devrait être mis à jour

    Scénario: Un administrateur modifie un gestionnaire de réseau inconnu
    Quand un administrateur modifie la raison sociale d'un gestionnaire de réseau inconnu
    Alors l'administrateur devrait être informé que "Le gestionnaire de réseau n'existe pas"
