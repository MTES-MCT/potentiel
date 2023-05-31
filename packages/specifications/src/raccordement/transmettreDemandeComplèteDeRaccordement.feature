#Language: fr-FR
Fonctionnalité: Transmettre une demande complète de raccordement

    Scénario: Un porteur de projet transmet une demande complète de raccordement pour son projet
        Quand le porteur d'un projet transmet une demande complète de raccordement auprès d'un gestionnaire de réseau avec :
            | La date de qualification                | 2022-10-28         |
            | La référence du dossier de raccordement | OUE-RP-2022-000033 |
        Alors le projet devrait avoir un dossier de raccordement pour ce gestionnaire de réseau
        Et le dossier est consultable dans la liste des dossiers de raccordement du projet
        Et l'accusé de réception devrait être enregistré et consultable pour ce dossier de raccordement

    Scénario: Un porteur de projet transmet plusieurs demandes complètes de raccordement pour son projet
        Etant donné un projet avec une demande complète de raccordement transmise auprès d'un gestionnaire de réseau avec :
            | La date de qualification                   | 2022-10-28         |
            | La référence du dossier de raccordement | OUE-RP-2022-000033 |
        Quand le porteur du projet transmet une autre demande complète de raccordement auprès du même gestionnaire de réseau avec :
            | La date de qualification                   | 2022-10-28         |
            | La référence du dossier de raccordement | NOP-RP-2022-000034 |
        Alors le projet devrait avoir 2 dossiers de raccordement pour ce gestionnaire de réseau

    Scénario: Impossible de transmettre une demande complète de raccordement auprès d'un autre gestionnaire de réseau
        Etant donné un projet avec une demande complète de raccordement transmise auprès d'un gestionnaire de réseau
        Quand le porteur du projet transmet une demande complète de raccordement auprès d'un autre gestionnaire de réseau
        Alors le porteur devrait être informé que "Il est impossible de transmettre une demande complète de raccordement auprès de plusieurs gestionnaires de réseau"

    Scénario: Impossible de transmettre une demande complète de raccordement auprès d'un gestionnaire de réseau non référencé
        Quand le porteur du projet transmet une demande complète de raccordement auprès d'un gestionnaire de réseau non référencé
        Alors le porteur devrait être informé que "Le gestionnaire de réseau n'est pas référencé"