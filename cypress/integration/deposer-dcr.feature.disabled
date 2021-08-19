# language: fr
Fonctionnalité: Transmettre l'attestation de demande complète de raccordement (DCR)

  @porteur-projet
  Scénario: Transmettre mon attestation de DCR
    Etant donné que mon compte est lié aux projets suivants
      | nomProjet | classe | notifiedOn | dcrDueOn | dcrSubmittedOn | appelOffreId | periodeId | familleId |
      | projet 1  | Classé | 1234       | 1234     | 0              | Fessenheim   | 2         | 1         |
    Lorsque je me rends sur la page du projet "projet 1"
    Et que je click sur le bouton "Indiquer la date de demande"
    Et que je saisis la valeur "20/05/2020" dans le champ "date"
    Et que je saisis la valeur "1234" dans le champ "numero-dossier"
    Lorsque je choisis un fichier dans le champ pièce-jointe
    Et que je valide le formulaire
    Alors on me notifie la réussite par "Votre demande de raccordement a bien été enregistrée."
    Et je vois que l'étape "Demande complète de raccordement" de la frise est validée
    Et l'étape a été enregistrée dans l'historique du projet