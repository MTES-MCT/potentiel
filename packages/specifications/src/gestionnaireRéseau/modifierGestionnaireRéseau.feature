# language: fr
@gestionnaire-réseau
Fonctionnalité: Modifier un gestionnaire de réseau

    Contexte:
        Etant donné un gestionnaire de réseau

    Scénario: Modifier un gestionnaire de réseau
        Quand le DGEC validateur modifie le gestionnaire de réseau
        Alors le gestionnaire de réseau devrait être consultable

    Scénario: Impossible de modifier un gestionnaire de réseau avec un gestionnaire inconnu
        Quand le DGEC validateur modifie le gestionnaire de réseau avec :
            | Code EIC       | inconnu                     |
            | Raison sociale | Gestionnaire réseau inconnu |
        Alors la dgec devrait être informé que "Le gestionnaire de réseau n'est pas référencé"

    Scénario: Impossible de modifier un gestionnaire de réseau avec les mêmes valeurs
        Quand le DGEC validateur modifie le gestionnaire de réseau avec les mêmes valeurs
        Alors la dgec devrait être informé que "Le gestionnaire de réseau n'a pas été modifié"
