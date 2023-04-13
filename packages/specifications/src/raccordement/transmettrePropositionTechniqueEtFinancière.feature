#Language: fr-FR
Fonctionnalité: Transmettre une proposition technique et financière

    Scénario: Un porteur de projet transmet une proposition technique et financière pour ce dossier de raccordement
        Etant donné un dossier de raccordement
        Quand le porteur de projet transmet une proposition technique et financière pour ce dossier de raccordement avec la date de signature au "2021-04-28"
        Alors une proposition technique et financière devrait être consultable dans le dossier de raccordement avec une date de signature au "2021-04-28"

    Scénario: Impossible de transmettre une proposition technique et financière pour un projet sans dossier de raccordement
        Quand un administrateur transmet une proposition technique et financière pour un projet n'ayant aucun dossier de raccordement
        Alors un administrateur devrait être informé que "Le projet n'a aucun dossier de raccordement"

     Scénario: Impossible de transmettre une proposition technique et financière pour un dossier de raccordement non référencé
        Etant donné un dossier de raccordement
        Quand un administrateur transmet une proposition technique et financière pour un dossier de raccordement non référencé
        Alors un administrateur devrait être informé que "Le dossier de raccordement n'est pas référencé" 
