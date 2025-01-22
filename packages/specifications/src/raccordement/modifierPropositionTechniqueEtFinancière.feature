# language: fr
Fonctionnalité: Modifier une proposition technique et financière

    Contexte:
        Etant donné le gestionnaire de réseau "Enedis"
        Et le projet lauréat "Du boulodrome de Marseille"
        Et le gestionnaire de réseau "Enedis" attribué au raccordement du projet lauréat

    Scénario: Un porteur de projet modifie une proposition technique et financière
        Etant donné une demande complète de raccordement pour le projet lauréat
        Et une proposition technique et financière pour le dossier de raccordement du projet lauréat
        Quand le porteur modifie la proposition technique et financière pour le dossier de raccordement du projet lauréat
        Alors la proposition technique et financière signée devrait être consultable dans le dossier de raccordement du projet lauréat

    Scénario: Impossible de modifier une proposition technique et financière pour un projet sans dossier de raccordement
        Quand le porteur modifie la proposition technique et financière pour le dossier de raccordement du projet lauréat avec :
            | La référence du dossier de raccordement | OUE-RP-2022-000033 |
        Alors le porteur devrait être informé que "Le dossier n'est pas référencé dans le raccordement de ce projet"

    Scénario: Impossible de modifier une proposition technique et financière pour un dossier n'étant pas référencé dans le raccordement du projet
        Etant donné une demande complète de raccordement pour le projet lauréat avec :
            | La référence du dossier de raccordement | OUE-RP-2022-000033 |
        Quand le porteur modifie la proposition technique et financière pour le dossier de raccordement du projet lauréat avec :
            | La référence du dossier de raccordement | OUE-RP-2022-000034 |
        Alors le porteur devrait être informé que "Le dossier n'est pas référencé dans le raccordement de ce projet"

    Scénario: Impossible de modifier une proposition technique et financière avec une date de signature dans le futur
        Etant donné une demande complète de raccordement pour le projet lauréat
        Et une proposition technique et financière pour le dossier de raccordement du projet lauréat
        Quand le porteur modifie la proposition technique et financière pour le dossier de raccordement du projet lauréat avec :
            | La date de signature | 2999-12-31 |
        Alors le porteur devrait être informé que "La date ne peut pas être une date future"

    # À vérifier côté métier
    @NotImplemented
    Scénario: Impossible de modifier une proposition technique et financière si la date de mise en service est déjà renseignée

