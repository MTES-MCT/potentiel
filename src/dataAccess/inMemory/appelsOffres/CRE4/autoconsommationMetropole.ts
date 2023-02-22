import { AppelOffre } from '@entities';

const autoconsommationMetropole: AppelOffre = {
  id: 'CRE4 - Autoconsommation métropole',
  type: 'autoconso',
  title:
    'portant sur la réalisation et l’exploitation d’Installations de production d’électricité à partir d’énergies renouvelables en autoconsommation et situées en métropole continentale',
  shortTitle: 'CRE4 - Autoconsommation métropole',
  launchDate: 'mars 2017',
  unitePuissance: 'MWc',
  delaiRealisationEnMois: 24,
  delaiRealisationTexte: 'vingt-quatre (24) mois',
  decoupageParTechnologie: false,
  paragraphePrixReference: '7.2',
  paragrapheDelaiDerogatoire: '6.3',
  paragrapheAttestationConformite: '6.5',
  paragrapheEngagementIPFPGPFC: '',
  afficherParagrapheInstallationMiseEnServiceModification: true,
  renvoiModification: '5.3',
  affichageParagrapheECS: false,
  renvoiDemandeCompleteRaccordement: '6.1',
  renvoiRetraitDesignationGarantieFinancieres: '',
  renvoiEngagementIPFPGPFC: '',
  paragrapheClauseCompetitivite: '2.10',
  tarifOuPrimeRetenue: 'la prime retenue',
  tarifOuPrimeRetenueAlt: 'cette prime',
  afficherValeurEvaluationCarbone: false,
  afficherPhraseRegionImplantation: false,
  dossierSuiviPar: 'aopv.dgec@developpement-durable.gouv.fr',
  soumisAuxGarantiesFinancieres: 'non soumis',
  changementPuissance: {
    ratios: {
      min: 0.8,
      max: 1,
    },
  },
  choisirNouveauCahierDesCharges: true,
  donnéesCourriersRéponse: {
    texteEngagementRéalisationEtModalitésAbandon: {
      référenceParagraphe: '6.3',
      dispositions: `Le Candidat dont l’offre a été retenue met en service l’Installation dans les conditions du présent cahier des charges, et réalise l’Installation conformément aux éléments du dossier de candidature (les possibilités et modalités de modification sont indiquées au 5.4). 
Par exception, le Candidat est délié de cette obligation : 
- en cas de retrait de l’autorisation d’urbanisme par l’autorité compétente ou d’annulation de cette autorisation à la suite d’un contentieux. Les retraits gracieux sur demande du candidat ne sont pas concernés. 
-  en  cas  de  non  obtention  ou  de  retrait  de  toute  autre  autorisation  administrative  ou  dérogation nécessaire à la réalisation du projet. 
Il en informe dans ce cas le Préfet en joignant les pièces justificatives. La garantie financière est alors levée. 
Le Candidat peut également être délié de cette obligation selon appréciation du ministre chargé de l’énergie  suite  à  une  demande  dûment  justifiée.  Le  Ministre  peut  accompagner  son accord  de conditions. L’accord du Ministre et les conditions imposées le cas échéant, ne limitent pas la possibilité de recours de l’Etat aux sanctions du 8.2.`,
    },
    texteIdentitéDuProducteur: {
      référenceParagraphe: '2.5',
      dispositions: `Le Candidat doit être le Producteur de l’Installation de production. Il ne peut pas indiquer dans son offre qu’une autre société sera le Producteur de l’Installation de production au cas où le projet serait retenu.`,
    },
  },
  periodes: [
    {
      id: '1',
      title: 'première',
      type: 'legacy',
      cahierDesCharges: {
        référence: '2017/S 054-100223',
        url: 'https://www.cre.fr/media/fichiers/publications/appelsoffres/autoconso-metropole-ancienne-version-du-cahier-des-charges-dans-sa-version-applicable-a-la-1ere-periode',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
      donnéesCourriersRéponse: {
        texteChangementDePuissance: {
          référenceParagraphe: '5.4.4',
          dispositions: `Les modifications de la Puissance installée avant l’Achèvement sont autorisées, sous réserve que la Puissance de l’Installation modifiée soit comprise entre quatre-vingt pourcents (80 %) et cent pourcents (100 %) de la Puissance formulée dans l’offre. Elles doivent faire l’objet d’une information au Préfet. Les modifications de la Puissance installée hors de cette fourchette ou après l’Achèvement ne sont pas autorisées.`,
        },
        texteDélaisDAchèvement: {
          référenceParagraphe: '6.4',
          dispositions: `Le Candidat dont l’offre a été retenue s’engage à ce que l’Achèvement de son Installation intervienne avant une limite définie par la date la plus tardive des deux dates suivantes :
- vingt-quatre (24) mois à compter de la Date de désignation.
- deux mois à compter de la fin des travaux de raccordement, sous réserve que le Producteur ait mis en oeuvre toutes les démarches dans le respect des exigences du gestionnaire de réseau pour que les travaux de raccordement soient réalisés dans les délais. Dans ce cas, l’attestation de conformité doit être transmise au Cocontractant dans un délai de 2 mois à compter de la fin des travaux de raccordement (date déclarée par le gestionnaire de réseau).
En cas de dépassement de ce délai, la durée de contrat mentionnée au 7.1 est amputée d’un raccourcissement R égal à la durée T de dépassement : R = T. Des dérogations au délai d’Achèvement sont toutefois possibles dans le cas où des contentieux administratifs effectués à l’encontre de toute autorisation administrative nécessaire à la réalisation du projet ont pour effet de retarder l’achèvement de l’installation. Dans ce cas, un délai supplémentaire égal à la durée entre la date du recours initial et la date de la décision définitive attestée par la décision ayant autorité de la chose jugée est alors accordé dans le cadre de contentieux.
Ces retards sont réputés autorisés sous réserve de pouvoir les justifier auprès de l’acheteur obligé. Des délais supplémentaires, laissés à l’appréciation du Préfet, peuvent être accordés en cas d’événement imprévisible à la Date de désignation et extérieur au Producteur, dûment justifié.

`,
        },
        texteChangementDActionnariat: {
          référenceParagraphe: '5.4.2',
          dispositions: `Les modifications de la structure du capital du Candidat sont réputées autorisées. Elles doivent faire l’objet d’une information au Préfet dans un délai d’un (1) mois.`,
        },
        texteChangementDeProducteur: {
          référenceParagraphe: '5.4.1',
          dispositions: `Les changements de Producteur sont réputés autorisés.
Ils doivent faire l’objet d’une information au Préfet dans un délai d’un mois. A cette fin, le producteur transmet à la DREAL de la région concernée par le projet, les statuts de la nouvelle société.`,
        },
      },
    },
    {
      id: '2',
      title: 'deuxième',
      type: 'legacy',
      cahierDesCharges: {
        référence: '2017/S 054-100223',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/Autoconso-Ancienne-version-du-cahier-des-charges-dans-sa-version-applicable-a-la-2eme-periode',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
      donnéesCourriersRéponse: {
        texteChangementDePuissance: {
          référenceParagraphe: '5.4.4',
          dispositions: `Les modifications de la Puissance installée avant l’Achèvement sont autorisées, sous réserve que la Puissance de l’Installation modifiée soit comprise entre quatre-vingt pourcents (80 %) et cent pourcents (100 %) de la Puissance formulée dans l’offre. Elles doivent faire l’objet d’une information au Préfet. Les modifications de la Puissance installée hors de cette fourchette ou après l’Achèvement ne sont pas autorisées.`,
        },
        texteDélaisDAchèvement: {
          référenceParagraphe: '6.4',
          dispositions: `Le Candidat dont l’offre a été retenue s’engage à ce que l’Achèvement de son Installation intervienne avant une limite définie par la date la plus tardive des deux dates suivantes :
- vingt-quatre (24) mois à compter de la Date de désignation.
- deux mois à compter de la fin des travaux de raccordement, sous réserve que le Producteur ait mis en oeuvre toutes les démarches dans le respect des exigences du gestionnaire de réseau pour que les travaux de raccordement soient réalisés dans les délais. Dans ce cas, l’attestation de conformité doit être transmise au Cocontractant dans un délai de 2 mois à compter de la fin des travaux de raccordement (date déclarée par le gestionnaire de réseau).
En cas de dépassement de ce délai, la durée de contrat mentionnée au 7.1 est amputée d’un raccourcissement R égal à la durée T de dépassement : R = T. Des dérogations au délai d’Achèvement sont toutefois possibles dans le cas où des contentieux administratifs effectués à l’encontre de toute autorisation administrative nécessaire à la réalisation du projet ont pour effet de retarder l’achèvement de l’installation. Dans ce cas, un délai supplémentaire égal à la durée entre la date du recours initial et la date de la décision définitive attestée par la décision ayant autorité de la chose jugée est alors accordé dans le cadre de contentieux.
Ces retards sont réputés autorisés sous réserve de pouvoir les justifier auprès de l’acheteur obligé. Des délais supplémentaires, laissés à l’appréciation du Préfet, peuvent être accordés en cas d’événement imprévisible à la Date de désignation et extérieur au Producteur, dûment justifié.`,
        },
        texteChangementDActionnariat: {
          référenceParagraphe: '5.4.2',
          dispositions: `Les modifications de la structure du capital du Candidat sont réputées autorisées. Elles doivent faire l’objet d’une information au Préfet dans un délai d’un (1) mois.`,
        },
        texteChangementDeProducteur: {
          référenceParagraphe: '5.4.1',
          dispositions: `Les changements de Producteur sont réputés autorisés.
Ils doivent faire l’objet d’une information au Préfet dans un délai d’un mois. A cette fin, le producteur transmet à la DREAL de la région concernée par le projet, les statuts de la nouvelle société.`,
        },
      },
    },
    {
      id: '3',
      title: 'troisième',
      type: 'legacy',
      cahierDesCharges: {
        référence: '2017/S 054-100223',
        url: 'https://www.cre.fr/media/fichiers/publications/appelsoffres/telecharger-le-cahier-des-charges-en-vigueur-dans-sa-version-modifiee-le-24-avril-2018',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
      donnéesCourriersRéponse: {
        texteChangementDePuissance: {
          référenceParagraphe: '5.3.4',
          dispositions: `Les modifications de la Puissance installée avant l’Achèvement sont autorisées, sous réserve que la Puissance de l’Installation modifiée soit comprise entre quatre-vingt pourcents (80 %) et cent pourcents (100 %) de la Puissance formulée dans l’offre. Elles doivent faire l’objet d’une information au Préfet. Les modifications de la Puissance installée hors de cette fourchette ou après l’Achèvement ne sont pas autorisées.`,
        },
        texteDélaisDAchèvement: {
          référenceParagraphe: '6.4',
          dispositions: `Le Candidat dont l’offre a été retenue s’engage à ce que l’Achèvement de son Installation intervienne avant une limite définie par la date la plus tardive des deux dates suivantes :
- vingt-quatre (24) mois à compter de la Date de désignation.
- deux mois à compter de la fin des travaux de raccordement, sous réserve que le Producteur ait mis en oeuvre toutes les démarches dans le respect des exigences du gestionnaire de réseau pour que les travaux de raccordement soient réalisés dans les délais. Dans ce cas, l’attestation de conformité doit être transmise au Cocontractant dans un délai de 2 mois à compter de la fin des travaux de raccordement (date déclarée par le gestionnaire de réseau).
En cas de dépassement de ce délai, la durée de contrat mentionnée au 7.1 est amputée d’un raccourcissement R égal à la durée T de dépassement : R = T. Des dérogations au délai d’Achèvement sont toutefois possibles dans le cas où des contentieux administratifs effectués à l’encontre de toute autorisation administrative nécessaire à la réalisation du projet ont pour effet de retarder l’achèvement de l’installation. Dans ce cas, un délai supplémentaire égal à la durée entre la date du recours initial et la date de la décision définitive attestée par la décision ayant autorité de la chose jugée est alors accordé dans le cadre de contentieux.
Ces retards sont réputés autorisés sous réserve de pouvoir les justifier auprès de l’acheteur obligé. Des délais supplémentaires, laissés à l’appréciation du Préfet, peuvent être accordés en cas d’événement imprévisible à la Date de désignation et extérieur au Producteur, dûment justifié.`,
        },
        texteChangementDActionnariat: {
          référenceParagraphe: '5.4.2',
          dispositions: `Les modifications de la structure du capital du Candidat sont réputées autorisées. Elles doivent faire l’objet d’une information au Préfet dans un délai d’un (1) mois.`,
        },
        texteChangementDeProducteur: {
          référenceParagraphe: '5.4.1',
          dispositions: `Les changements de Producteur sont réputés autorisés.
Ils doivent faire l’objet d’une information au Préfet dans un délai d’un mois. A cette fin, le producteur transmet à la DREAL de la région concernée par le projet, les statuts de la nouvelle société.`,
        },
      },
    },
    {
      id: '4',
      title: 'quatrième',
      type: 'legacy',
      cahierDesCharges: {
        référence: '2017/S 054-100223',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/Ancienne-version-du-cahier-des-charges-dans-sa-version-applicable-a-la-4eme-periode',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
      donnéesCourriersRéponse: {
        texteChangementDePuissance: {
          référenceParagraphe: '5.3.4',
          dispositions: `Les modifications de la Puissance installée avant l’Achèvement sont autorisées, sous réserve que la Puissance de l’Installation modifiée soit comprise entre quatre-vingt pourcents (80 %) et cent pourcents (100 %) de la Puissance formulée dans l’offre. Elles doivent faire l’objet d’une information au Préfet. Les modifications de la Puissance installée hors de cette fourchette ou après l’Achèvement ne sont pas autorisées.`,
        },
        texteDélaisDAchèvement: {
          référenceParagraphe: '6.3',
          dispositions: `Le Candidat dont l’offre a été retenue s’engage à ce que l’Achèvement de son Installation intervienne avant une limite définie par la date la plus tardive des deux dates suivantes :
- vingt-quatre (24) mois à compter de la Date de désignation.
- deux mois à compter de la fin des travaux de raccordement, sous réserve que le Producteur ait mis en oeuvre toutes les démarches dans le respect des exigences du gestionnaire de réseau pour que les travaux de raccordement soient réalisés dans les délais. Dans ce cas, l’attestation de conformité doit être transmise au Cocontractant dans un délai de 2 mois à compter de la fin des travaux de raccordement (date déclarée par le gestionnaire de réseau).
En cas de dépassement de ce délai, la durée de contrat mentionnée au 7.1 est amputée d’un raccourcissement R égal à la durée T de dépassement : R = T. Des dérogations au délai d’Achèvement sont toutefois possibles dans le cas où des contentieux administratifs effectués à l’encontre de toute autorisation administrative nécessaire à la réalisation du projet ont pour effet de retarder l’achèvement de l’installation. Dans ce cas, un délai supplémentaire égal à la durée entre la date du recours initial et la date de la décision définitive attestée par la décision ayant autorité de la chose jugée est alors accordé dans le cadre de contentieux.
Ces retards sont réputés autorisés sous réserve de pouvoir les justifier auprès de l’acheteur obligé. Des délais supplémentaires, laissés à l’appréciation du Préfet, peuvent être accordés en cas d’événement imprévisible à la Date de désignation et extérieur au Producteur, dûment justifié.`,
        },
        texteChangementDActionnariat: {
          référenceParagraphe: '5.3.2',
          dispositions: `Les modifications de la structure du capital du Candidat sont réputées autorisées. Elles doivent faire l’objet d’une information au Préfet dans un délai d’un (1) mois.`,
        },
        texteChangementDeProducteur: {
          référenceParagraphe: '5.3.1',
          dispositions: `Les changements de Producteur sont réputés autorisés.
Ils doivent faire l’objet d’une information au Préfet dans un délai d’un mois. A cette fin, le producteur transmet à la DREAL de la région concernée par le projet, les statuts de la nouvelle société.`,
        },
      },
    },
    {
      id: '5',
      title: 'cinquième',
      type: 'legacy',
      cahierDesCharges: {
        référence: '2017/S 054-100223',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/Telecharger-le-cahier-des-charges-en-vigueur-dans-sa-version-modifiee-le-22-novembre-20182',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
      donnéesCourriersRéponse: {
        texteChangementDePuissance: {
          référenceParagraphe: '5.3.4',
          dispositions: `Les modifications de la Puissance installée avant l’Achèvement sont autorisées, sous réserve que la Puissance de l’Installation modifiée soit comprise entre quatre-vingt pourcents (80 %) et cent pourcents (100 %) de la Puissance formulée dans l’offre. Elles doivent faire l’objet d’une information au Préfet. Les modifications de la Puissance installée hors de cette fourchette ou après l’Achèvement ne sont pas autorisées.`,
        },
        texteDélaisDAchèvement: {
          référenceParagraphe: '6.3',
          dispositions: `Le Candidat dont l’offre a été retenue s’engage à ce que l’Achèvement de son Installation intervienne avant une limite définie par la date la plus tardive des deux dates suivantes :
- vingt-quatre (24) mois à compter de la Date de désignation.
- deux mois à compter de la fin des travaux de raccordement, sous réserve que le Producteur ait mis en oeuvre toutes les démarches dans le respect des exigences du gestionnaire de réseau pour que les travaux de raccordement soient réalisés dans les délais. Dans ce cas, l’attestation de conformité doit être transmise au Cocontractant dans un délai de 2 mois à compter de la fin des travaux de raccordement (date déclarée par le gestionnaire de réseau).
En cas de dépassement de ce délai, la durée de contrat mentionnée au 7.1 est amputée d’un raccourcissement R égal à la durée T de dépassement : R = T. Des dérogations au délai d’Achèvement sont toutefois possibles dans le cas où des contentieux administratifs effectués à l’encontre de toute autorisation administrative nécessaire à la réalisation du projet ont pour effet de retarder l’achèvement de l’installation. Dans ce cas, un délai supplémentaire égal à la durée entre la date du recours initial et la date de la décision définitive attestée par la décision ayant autorité de la chose jugée est alors accordé dans le cadre de contentieux.
Ces retards sont réputés autorisés sous réserve de pouvoir les justifier auprès de l’acheteur obligé. Des délais supplémentaires, laissés à l’appréciation du Préfet, peuvent être accordés en cas d’événement imprévisible à la Date de désignation et extérieur au Producteur, dûment justifié.`,
        },
        texteChangementDActionnariat: {
          référenceParagraphe: '5.3.2',
          dispositions: `Les modifications de la structure du capital du Candidat sont réputées autorisées. Elles doivent faire l’objet d’une information au Préfet dans un délai d’un (1) mois.`,
        },
        texteChangementDeProducteur: {
          référenceParagraphe: '5.3.1',
          dispositions: `Les changements de Producteur sont réputés autorisés.
Ils doivent faire l’objet d’une information au Préfet dans un délai d’un mois. A cette fin, le producteur transmet à la DREAL de la région concernée par le projet, les statuts de la nouvelle société.`,
        },
      },
    },
    {
      id: '6',
      title: 'sixième',
      type: 'legacy',
      cahierDesCharges: {
        référence: '2017/S 054-100223',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/Autoconso-Telecharger-le-cahier-des-charges-en-vigueur-dans-sa-version-modifiee-le-18-juin-2019',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
      donnéesCourriersRéponse: {
        texteChangementDePuissance: {
          référenceParagraphe: '5.3.4',
          dispositions: `Les modifications de la Puissance installée avant l’Achèvement sont autorisées, sous réserve que la Puissance de l’Installation modifiée soit comprise entre quatre-vingt pourcents (80 %) et cent pourcents (100 %) de la Puissance formulée dans l’offre. Elles doivent faire l’objet d’une information au Préfet. Les modifications de la Puissance installée hors de cette fourchette ou après l’Achèvement ne sont pas autorisées.`,
        },
        texteDélaisDAchèvement: {
          référenceParagraphe: '6.3',
          dispositions: `Le Candidat dont l’offre a été retenue s’engage à ce que l’Achèvement de son Installation intervienne avant une limite définie par la date la plus tardive des deux dates suivantes :
- vingt-quatre (24) mois à compter de la Date de désignation.
- deux mois à compter de la fin des travaux de raccordement, sous réserve que le Producteur ait mis en oeuvre toutes les démarches dans le respect des exigences du gestionnaire de réseau pour que les travaux de raccordement soient réalisés dans les délais. Dans ce cas, l’attestation de conformité doit être transmise au Cocontractant dans un délai de 2 mois à compter de la fin des travaux de raccordement (date déclarée par le gestionnaire de réseau).
En cas de dépassement de ce délai, la durée de contrat mentionnée au 7.1 est amputée d’un raccourcissement R égal à la durée T de dépassement : R = T. Des dérogations au délai d’Achèvement sont toutefois possibles dans le cas où des contentieux administratifs effectués à l’encontre de toute autorisation administrative nécessaire à la réalisation du projet ont pour effet de retarder l’achèvement de l’installation. Dans ce cas, un délai supplémentaire égal à la durée entre la date du recours initial et la date de la décision définitive attestée par la décision ayant autorité de la chose jugée est alors accordé dans le cadre de contentieux.
Ces retards sont réputés autorisés sous réserve de pouvoir les justifier auprès de l’acheteur obligé. Des délais supplémentaires, laissés à l’appréciation du Préfet, peuvent être accordés en cas d’événement imprévisible à la Date de désignation et extérieur au Producteur, dûment justifié.`,
        },
        texteChangementDActionnariat: {
          référenceParagraphe: '5.3.2',
          dispositions: `Les modifications de la structure du capital du Candidat sont réputées autorisées. Elles doivent faire l’objet d’une information au Préfet dans un délai d’un (1) mois.`,
        },
        texteChangementDeProducteur: {
          référenceParagraphe: '5.3.1',
          dispositions: `Les changements de Producteur sont réputés autorisés.
Ils doivent faire l’objet d’une information au Préfet dans un délai d’un mois. A cette fin, le producteur transmet à la DREAL de la région concernée par le projet, les statuts de la nouvelle société.`,
        },
      },
    },
    {
      id: '7',
      title: 'septième',
      noteThreshold: 20.04,
      certificateTemplate: 'cre4.v0',
      cahierDesCharges: {
        référence: '2017/S 054-100223',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/autoconsommation-02-01-2020-telecharger-le-cahier-des-charges-en-vigueur',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
      donnéesCourriersRéponse: {
        texteChangementDePuissance: {
          référenceParagraphe: '5.3.4',
          dispositions: `Les modifications de la Puissance installée avant l’Achèvement sont autorisées, sous réserve que la Puissance de l’Installation modifiée soit comprise entre quatre-vingt pourcents (80 %) et cent pourcents (100 %) de la Puissance formulée dans l’offre. Elles doivent faire l’objet d’une information au Préfet. Les modifications de la Puissance installée hors de cette fourchette ou après l’Achèvement ne sont pas autorisées.`,
        },
        texteDélaisDAchèvement: {
          référenceParagraphe: '6.3',
          dispositions: `Le Candidat dont l’offre a été retenue s’engage à ce que l’Achèvement de son Installation intervienne avant une limite définie par la date la plus tardive des deux dates suivantes :
- vingt-quatre (24) mois à compter de la Date de désignation.
- deux mois à compter de la fin des travaux de raccordement, sous réserve que le Producteur ait mis en oeuvre toutes les démarches dans le respect des exigences du gestionnaire de réseau pour que les travaux de raccordement soient réalisés dans les délais. Dans ce cas, l’attestation de conformité doit être transmise au Cocontractant dans un délai de 2 mois à compter de la fin des travaux de raccordement (date déclarée par le gestionnaire de réseau).
En cas de dépassement de ce délai, la durée de contrat mentionnée au 7.1 est amputée d’un raccourcissement R égal à la durée T de dépassement : R = T. Des dérogations au délai d’Achèvement sont toutefois possibles dans le cas où des contentieux administratifs effectués à l’encontre de toute autorisation administrative nécessaire à la réalisation du projet ont pour effet de retarder l’achèvement de l’installation. Dans ce cas, un délai supplémentaire égal à la durée entre la date du recours initial et la date de la décision définitive attestée par la décision ayant autorité de la chose jugée est alors accordé dans le cadre de contentieux.
Ces retards sont réputés autorisés sous réserve de pouvoir les justifier auprès de l’acheteur obligé. Des délais supplémentaires, laissés à l’appréciation du Préfet, peuvent être accordés en cas d’événement imprévisible à la Date de désignation et extérieur au Producteur, dûment justifié.`,
        },
        texteChangementDActionnariat: {
          référenceParagraphe: '5.3.2',
          dispositions: `Les modifications de la structure du capital du Candidat sont réputées autorisées. Elles doivent faire l’objet d’une information au Préfet dans un délai d’un (1) mois.`,
        },
        texteChangementDeProducteur: {
          référenceParagraphe: '5.3.1',
          dispositions: `Les changements de Producteur sont réputés autorisés.
Ils doivent faire l’objet d’une information au Préfet dans un délai d’un mois. A cette fin, le producteur transmet à la DREAL de la région concernée par le projet, les statuts de la nouvelle société.`,
        },
      },
    },
    {
      id: '8',
      title: 'huitième',
      noteThreshold: 32.04,
      certificateTemplate: 'cre4.v1',
      cahierDesCharges: {
        référence: '2017/S 054-100223',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/ao-autoconso-metro-telecharger-le-cahier-des-charges-en-vigueur-dans-sa-version-modifiee-le-04-juin-2020',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
      donnéesCourriersRéponse: {
        texteChangementDePuissance: {
          référenceParagraphe: '5.3.4',
          dispositions: `Les modifications de la Puissance installée avant l’Achèvement sont autorisées, sous réserve que la Puissance de l’Installation modifiée soit comprise entre quatre-vingt pourcents (80 %) et cent pourcents (100 %) de la Puissance formulée dans l’offre. Elles doivent faire l’objet d’une information au Préfet. Les modifications de la Puissance installée hors de cette fourchette ou après l’Achèvement ne sont pas autorisées.`,
        },
        texteDélaisDAchèvement: {
          référenceParagraphe: '6.3',
          dispositions: `Le Candidat dont l’offre a été retenue s’engage à ce que l’Achèvement de son Installation intervienne avant une limite définie par la date la plus tardive des deux dates suivantes :
- vingt-quatre (24) mois à compter de la Date de désignation.
- deux mois à compter de la fin des travaux de raccordement, sous réserve que le Producteur ait mis en oeuvre toutes les démarches dans le respect des exigences du gestionnaire de réseau pour que les travaux de raccordement soient réalisés dans les délais. Dans ce cas, l’attestation de conformité doit être transmise au Cocontractant dans un délai de 2 mois à compter de la fin des travaux de raccordement (date déclarée par le gestionnaire de réseau).
En cas de dépassement de ce délai, la durée de contrat mentionnée au 7.1 est amputée d’un raccourcissement R égal à la durée T de dépassement : R = T. Des dérogations au délai d’Achèvement sont toutefois possibles dans le cas où des contentieux administratifs effectués à l’encontre de toute autorisation administrative nécessaire à la réalisation du projet ont pour effet de retarder l’achèvement de l’installation. Dans ce cas, un délai supplémentaire égal à la durée entre la date du recours initial et la date de la décision définitive attestée par la décision ayant autorité de la chose jugée est alors accordé dans le cadre de contentieux.
Ces retards sont réputés autorisés sous réserve de pouvoir les justifier auprès de l’acheteur obligé. Des délais supplémentaires, laissés à l’appréciation du Préfet, peuvent être accordés en cas d’événement imprévisible à la Date de désignation et extérieur au Producteur, dûment justifié.`,
        },
        texteChangementDActionnariat: {
          référenceParagraphe: '5.3.2',
          dispositions: `Les modifications de la structure du capital du Candidat sont réputées autorisées. Elles doivent faire l’objet d’une information au Préfet dans un délai d’un (1) mois.`,
        },
        texteChangementDeProducteur: {
          référenceParagraphe: '5.3.1',
          dispositions: `Les changements de Producteur sont réputés autorisés.
Ils doivent faire l’objet d’une information au Préfet dans un délai d’un mois. A cette fin, le producteur transmet à la DREAL de la région concernée par le projet, les statuts de la nouvelle société.`,
        },
      },
    },
    {
      id: '9',
      title: 'neuvième',
      noteThreshold: 9.9,
      certificateTemplate: 'cre4.v1',
      cahierDesCharges: {
        référence: '2017/S 054-100223',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/ao-autoconso-metro-telecharger-le-cahier-des-charges-en-vigueur-dans-sa-version-modifiee-le-04-juin-2020',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
      donnéesCourriersRéponse: {
        texteChangementDePuissance: {
          référenceParagraphe: '5.3.4',
          dispositions: `Les modifications de la Puissance installée avant l’Achèvement sont autorisées, sous réserve que la Puissance de l’Installation modifiée soit comprise entre quatre-vingt pourcents (80 %) et cent pourcents (100 %) de la Puissance formulée dans l’offre. Elles doivent faire l’objet d’une information au Préfet. Les modifications de la Puissance installée hors de cette fourchette ou après l’Achèvement ne sont pas autorisées.`,
        },
        texteDélaisDAchèvement: {
          référenceParagraphe: '6.3',
          dispositions: `Le Candidat dont l’offre a été retenue s’engage à ce que l’Achèvement de son Installation intervienne avant une limite définie par la date la plus tardive des deux dates suivantes :
- vingt-quatre (24) mois à compter de la Date de désignation.
- deux mois à compter de la fin des travaux de raccordement, sous réserve que le Producteur ait mis en oeuvre toutes les démarches dans le respect des exigences du gestionnaire de réseau pour que les travaux de raccordement soient réalisés dans les délais. Dans ce cas, l’attestation de conformité doit être transmise au Cocontractant dans un délai de 2 mois à compter de la fin des travaux de raccordement (date déclarée par le gestionnaire de réseau).
En cas de dépassement de ce délai, la durée de contrat mentionnée au 7.1 est amputée d’un raccourcissement R égal à la durée T de dépassement : R = T. Des dérogations au délai d’Achèvement sont toutefois possibles dans le cas où des contentieux administratifs effectués à l’encontre de toute autorisation administrative nécessaire à la réalisation du projet ont pour effet de retarder l’achèvement de l’installation. Dans ce cas, un délai supplémentaire égal à la durée entre la date du recours initial et la date de la décision définitive attestée par la décision ayant autorité de la chose jugée est alors accordé dans le cadre de contentieux.
Ces retards sont réputés autorisés sous réserve de pouvoir les justifier auprès de l’acheteur obligé. Des délais supplémentaires, laissés à l’appréciation du Préfet, peuvent être accordés en cas d’événement imprévisible à la Date de désignation et extérieur au Producteur, dûment justifié.`,
        },
        texteChangementDActionnariat: {
          référenceParagraphe: '5.3.2',
          dispositions: `Les modifications de la structure du capital du Candidat sont réputées autorisées. Elles doivent faire l’objet d’une information au Préfet dans un délai d’un (1) mois.`,
        },
        texteChangementDeProducteur: {
          référenceParagraphe: '5.3.1',
          dispositions: `Les changements de Producteur sont réputés autorisés.
Ils doivent faire l’objet d’une information au Préfet dans un délai d’un mois. A cette fin, le producteur transmet à la DREAL de la région concernée par le projet, les statuts de la nouvelle société.`,
        },
      },
    },
    {
      id: '10',
      title: 'dixième',
      noteThreshold: 44.9,
      certificateTemplate: 'cre4.v1',
      cahierDesCharges: {
        référence: '2017/S 054-100223',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/telecharger-le-cahier-des-charges-en-vigueur-dans-sa-version-modifiee-le-26-avril-2021',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
      donnéesCourriersRéponse: {
        texteChangementDePuissance: {
          référenceParagraphe: '5.3.4',
          dispositions: `Les modifications de la Puissance installée avant la Mise en service sont autorisées, sous réserve que la Puissance de l’Installation modifiée soit comprise entre soixante-dix pourcents et cent pourcents de la Puissance formulée dans l’offre. Elles doivent faire l’objet d’une information au Préfet. Les modifications de la Puissance installée hors de cette fourchette ne sont pas autorisées.`,
        },
        texteDélaisDAchèvement: {
          référenceParagraphe: '6.3',
          dispositions: `Le Candidat dont l’offre a été retenue s’engage à ce que l’Achèvement de son Installation intervienne avant une limite définie par la date la plus tardive des deux dates suivantes :
- vingt-quatre (24) mois à compter de la Date de désignation.
- deux mois à compter de la fin des travaux de raccordement, sous réserve que le Producteur ait mis en oeuvre toutes les démarches dans le respect des exigences du gestionnaire de réseau pour que les travaux de raccordement soient réalisés dans les délais. Dans ce cas, l’attestation de conformité doit être transmise au Cocontractant dans un délai de 2 mois à compter de la fin des travaux de raccordement (date déclarée par le gestionnaire de réseau).
En cas de dépassement de ce délai, la durée de contrat mentionnée au 7.1 est amputée d’un raccourcissement R égal à la durée T de dépassement : R = T. Des dérogations au délai d’Achèvement sont toutefois possibles dans le cas où des contentieux administratifs effectués à l’encontre de toute autorisation administrative nécessaire à la réalisation du projet ont pour effet de retarder l’achèvement de l’installation. Dans ce cas, un délai supplémentaire égal à la durée entre la date du recours initial et la date de la décision définitive attestée par la décision ayant autorité de la chose jugée est alors accordé dans le cadre de contentieux.
Ces retards sont réputés autorisés sous réserve de pouvoir les justifier auprès de l’acheteur obligé. Des délais supplémentaires, laissés à l’appréciation du Préfet, peuvent être accordés en cas d’événement imprévisible à la Date de désignation et extérieur au Producteur, dûment justifié.`,
        },
        texteChangementDActionnariat: {
          référenceParagraphe: '5.3.2',
          dispositions: `Les modifications de la structure du capital du Candidat sont réputées autorisées. Elles doivent faire l’objet d’une information au Préfet dans un délai d’un (1) mois.`,
        },
        texteChangementDeProducteur: {
          référenceParagraphe: '5.3.1',
          dispositions: `Les changements de Producteur sont réputés autorisés.
Ils doivent faire l’objet d’une information au Préfet dans un délai d’un mois. A cette fin, le producteur transmet à la DREAL de la région concernée par le projet, les statuts de la nouvelle société.`,
        },
      },
    },
  ],
  familles: [],
  cahiersDesChargesModifiésDisponibles: [
    {
      type: 'modifié',
      paruLe: '30/07/2021',
      url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/30072021-avis-modificatif-cre4-autoconsommation-metropole-2',
      donnéesCourriersRéponse: {
        texteChangementDePuissance: {
          référenceParagraphe: '5.3.4',
          dispositions: `Avant l'achèvement, les modifications de la Puissance installée sont autorisées, sous réserve que la Puissance de l’Installation modifiée soit comprise entre quatre-vingts pourcents (80%) et cent pourcents (100%) de la Puissance formulée dans l’offre. Elles doivent faire l’objet d’une information au Préfet.
 Les modifications à la baisse, en-dessous de 80% de la Puissance formulée dans l'offre et imposées par une décision de l’Etat à l’égard de toute autorisation administrative nécessaire à la réalisation du projet, sont autorisées. Elles doivent faire l’objet d’une information au Préfet.
 Des modifications à la baisse, en-dessous de 80% de la Puissance formulée dans l'offre et imposée par un événement extérieur au candidat, peuvent également être autorisées par le Préfet de manière exceptionnelle, sur demande dûment motivée.`,
        },
      },
    },
  ],
};

export { autoconsommationMetropole };
