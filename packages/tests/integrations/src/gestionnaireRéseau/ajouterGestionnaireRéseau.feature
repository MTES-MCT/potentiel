#Language: fr-FR
Fonctionnalité: Ajouter un gestionnaire de réseau

    Scénario: Un administrateur ajoute un gestionnaire de réseau
        Quand un administrateur ajoute un gestionnaire de réseau
        Alors le gestionnaire devrait être ajouté

    Scénario: Un administrateur ajoute un gestionnaire de réseau déjà existant
        Etant donné un gestionnaire de réseau avec un code EIC
        Quand un administrateur ajoute un gestionnaire de réseau ayant le même code EIC
        Alors le gestionnaire de réseau ne devrait pas être ajouté
        Et l'admin devrait être informé que le gestionnaire existe déjà
