# language: fr
@gestionnaire-réseau
Fonctionnalité: Ajouter un gestionnaire de réseau

    Scénario: Ajouter un gestionnaire de réseau
        Quand le DGEC validateur ajoute un gestionnaire de réseau
        Alors le gestionnaire de réseau devrait être consultable

    Scénario: Impossible d'ajouter 2 gestionnaires de réseau avec un code EIC identique
        Etant donné un gestionnaire de réseau
            | Code EIC       | 17X100A100A0001B       |
            | Raison sociale | Arc Energies Maurienne |
        Quand le DGEC validateur ajoute un gestionnaire de réseau avec le même code EIC
        Alors la dgec devrait être informé que "Le gestionnaire de réseau existe déjà"
