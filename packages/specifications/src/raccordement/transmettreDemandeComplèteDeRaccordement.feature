#Language: fr-FR
Fonctionnalité: Transmettre une demande complète de raccordement

    Scénario: Un porteur de projet transmet une demande complète de raccordement pour son projet
        Quand le porteur d'un projet transmet une demande complète de raccordement auprès d'un gestionnaire de réseau avec :
            | La date de qualification                   | 2022-10-28         |
            | La référence de la demande de raccordement | OUE-RP-2022-000033 |
        Alors le projet devrait avoir une demande complète de raccordement pour ce gestionnaire de réseau
        Et la demande est consultable dans la liste des demandes complètes de raccordement du projet

    Scénario: Un porteur de projet transmet plusieurs demandes complètes de raccordement pour son projet
        Etant donné un projet avec une demande complète de raccordement transmise auprès d'un gestionnaire de réseau avec :
            | La date de qualification                   | 2022-10-28         |
            | La référence de la demande de raccordement | OUE-RP-2022-000033 |
        Quand le porteur du projet transmet une autre demande complète de raccordement auprès du même gestionnaire de réseau avec :
            | La date de qualification                   | 2022-10-28         |
            | La référence de la demande de raccordement | NOP-RP-2022-000034 |
        Alors le projet devrait avoir 2 demandes complètes de raccordement pour ce gestionnaire de réseau

    # Scénario: Impossible de transmettre une demande complète de raccordement auprès d'un autre gestionnaire de réseau
    #     Etant donné un projet avec un demande de raccordement transmise auprès d'un gestionnaire de réseau
    #     Quand le porteur du projet transmet une demande complète de raccordement auprès d'un autre gestionnaire de réseau
    #     Alors le porteur devrait être informé que "Il est impossible de transmettre une demande complète de raccordement auprès de plusieurs gestionnaires de réseau"

    # Scénario: Impossible de transmettre une demande complète de raccordement auprès d'un gestionnaire de réseau inconnu
    #     Etant donné un projet
    #     Quand le porteur du projet transmet une demande complète de raccordement auprès d'un gestionnaire de réseau inconnu
    #     Alors le porteur devrait être informé que "Le gestionnaire de réseau n'est pas référencé"

    # Scénario: Impossible de transmettre une demande complète de raccordement pour un projet inconnu
    #     Quand le porteur du projet transmet une demande complète de raccordement pour un projet inconnu
    #     Alors le porteur devrait être informé que "Le projet n'existe pas"

    # Scénario: Impossible de transmettre une demande complète de raccordement pour un projet sur lequel le porteur n'a pas les accès
    #     Etant donné un projet
    #     Quand le porteur du projet transmet une demande complète de raccordement auprès d'un gestionnaire de réseau
    #     Alors le porteur devrait être informé que "Accès au projet refusé"