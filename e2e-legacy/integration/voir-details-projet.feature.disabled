# language: fr
Fonctionnalité: Page projet

  @porteur-projet
  Scénario: Je vois les détails du projet (porteur)
    Etant donné que mon compte est lié aux projets suivants
      | nomProjet | appelOffreId | periodeId | classe | notifiedOn |
      | projet 1  | Fessenheim   | 2         | Classé | 1234       |
    Lorsque je me rends sur la page du projet "projet 1"
    Alors le menu action est visible
    Et le lien pour "Télécharger l'attestation" est visible
    Lorsque j'ouvre la section "Contact"
    Alors le lien pour "Donner accès à un autre utilisateur" est visible

  @porteur-projet
  Scénario: Je vois les notes détaillées (porteur de projet AO innovation)
    Etant donné que mon compte est lié aux projets suivants
      | nomProjet | appelOffreId      | periodeId | classe | notifiedOn |
      | projet 1  | CRE4 - Innovation | 2         | Classé | 1234       |
    Lorsque je me rends sur la page du projet "projet 1"
    Alors le lien pour "Résultats de l'appel d'offres" est visible
    Lorsque j'ouvre la section "Résultats de l'appel d'offres"
    Alors je vois les notes du projet

  @dreal
  Scénario: Je vois les détails du projet (dreal)
    Etant donné que je suis dreal de la region "Corse"
    Et les projets suivants
      | nomProjet | appelOffreId | periodeId | regionProjet     | classe | notifiedOn |
      | projet 1  | Fessenheim   | 2         | Corse / Bretagne | Classé | 1234       |
    Lorsque je me rends sur la page du projet "projet 1"
    Alors le menu action n'est pas visible
    Et le lien pour "Télécharger l'attestation" n'est pas visible
    Lorsque j'ouvre la section "Contact"
    Alors le lien pour "Donner accès à un autre utilisateur" n'est pas visible

  @dreal
  Scénario: Je n'ai pas accès à ce projet (dreal)
    Etant donné que je suis dreal de la region "Corse"
    Et les projets suivants
      | nomProjet | regionProjet | classe | notifiedOn |
      | projet 1  | Bretagne     | Classé | 1234       |
    Alors je ne peux pas me rendre sur la page du projet "projet 1"

  @dreal
  Scénario: Je ne vois pas les notes détaillées (dreal AO innovation)
    Etant donné que je suis dreal de la region "Corse"
    Et les projets suivants
      | nomProjet | appelOffreId      | periodeId | regionProjet | classe | notifiedOn |
      | projet 1  | CRE4 - Innovation | 2         | Corse        | Classé | 1234       |
    Lorsque je me rends sur la page du projet "projet 1"
    Alors le lien pour "Résultats de l'appel d'offres" n'est pas visible
    Et je ne vois pas les notes du projet

  @admin
  Scénario: Je vois les détails du projet (admin)
    Etant donné que les projets suivants
      | nomProjet | appelOffreId | periodeId | classe | notifiedOn |
      | projet 1  | Fessenheim   | 2         | Classé | 1234       |
    Lorsque je me rends sur la page du projet "projet 1"
    Alors le menu action est visible
    Et le lien pour "Télécharger l'attestation" est visible
    Lorsque j'ouvre la section "Contact"
    Alors le lien pour "Donner accès à un autre utilisateur" est visible