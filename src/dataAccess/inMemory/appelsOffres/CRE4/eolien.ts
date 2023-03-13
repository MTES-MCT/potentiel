import { AppelOffre } from '@entities';

const eolien: AppelOffre = {
  autoritéCompétenteDemandesDélai: 'dgec',
  id: 'Eolien',
  type: 'eolien',
  title:
    'portant sur la réalisation et l’exploitation d’Installations de production d’électricité à partir de l’énergie mécanique du vent implantées à terre',
  shortTitle: 'Eolien',
  dossierSuiviPar: 'Sandra Stojkovic (sandra.stojkovic@developpement-durable.gouv.fr)',
  launchDate: 'mai 2017',
  unitePuissance: 'MW',
  tarifOuPrimeRetenue: 'le prix de référence T de l’électricité retenu',
  tarifOuPrimeRetenueAlt: 'ce prix de référence',
  paragraphePrixReference: '7.2',
  affichageParagrapheECS: false,
  paragrapheEngagementIPFPGPFC: '3.3.6',
  renvoiEngagementIPFPGPFC: '3.3.6 et 7.2.2',
  // Fourniture puissance à la pointe ?
  renvoiDemandeCompleteRaccordement: '6.1',
  renvoiSoumisAuxGarantiesFinancieres: 'est précisée au 6.2 du cahier des charges',
  renvoiRetraitDesignationGarantieFinancieres: '5.3 et 6.2',
  // Paragraphes sur l'innovation ?
  // Renvoi 3 sur l'innovation ?
  // Renvoi 4 sur l'innovation ?
  paragrapheDelaiDerogatoire: '6.4',
  delaiRealisationEnMois: 36,
  decoupageParTechnologie: false,
  delaiRealisationTexte: 'trente-six (36) mois',
  paragrapheAttestationConformite: '6.5',
  afficherParagrapheInstallationMiseEnServiceModification: true,
  renvoiModification: '5.4',
  // Paragraphe diminution de l'offre ?
  paragrapheClauseCompetitivite: '2.7',
  afficherPhraseRegionImplantation: false,
  afficherValeurEvaluationCarbone: false,
  soumisAuxGarantiesFinancieres: 'après candidature',
  garantieFinanciereEnMois: 51,
  doitPouvoirChoisirCDCInitial: true,
  changementPuissance: {
    ratios: {
      min: 0.9,
      max: 1.1,
    },
  },
  donnéesCourriersRéponse: {
    texteEngagementRéalisationEtModalitésAbandon: {
      référenceParagraphe: '6.3 et 6.6',
      dispositions: `Le Candidat dont l’offre a été retenue réalise l’Installation dans les conditions du présent cahier des charges et conformément aux éléments du dossier de candidature (les possibilités et modalités de modification sont indiquées au 5.4).

En cas de retrait de l’autorisation environnementale mentionnée au 3.3.3 par l’autorité compétente, d’annulation de cette autorisation à la suite d’un contentieux, ou, dans le cadre des première et troisième période, d’un rejet de sa demande pour cette même autorisation, le Candidat dont l’offre a été sélectionnée peut se désister. Il en fait la demande au ministre chargé de l’énergie sans délai et il est dans ce cas délié de ses obligations au titre du présent appel d’offres.`,
    },
    texteChangementDePuissance: {
      référenceParagraphe: `5.4.5`,
      dispositions: `Les modifications de la Puissance installée avant l’Achèvement sont autorisées, sous réserve que la Puissance de l’Installation modifiée soit comprise entre quatre-vingt-dix pourcents (90 %) et cent-dix pourcents (110 %) de la Puissance indiquée dans l’offre. Elles doivent faire l’objet d’une information au Préfet.
Les modifications de la Puissance installée hors de cette fourchette ou les modifications à la hausse de la Puissance installée après l’Achèvement ne sont pas autorisées.
Par dérogation, les modifications à la baisse de la Puissance installée qui seraient imposées soit par une décision de l’Etat dans le cadre de la procédure d’autorisation mentionnée au 3.3.3 pour la première et la troisième période de candidature, ou par une décision de justice concernant l’autorisation mentionnée au 3.3.3 pour l’ensemble des périodes de candidature, sont acceptées. Elles doivent faire l’objet d’une information au Préfet.`,
    },
    texteChangementDActionnariat: {
      référenceParagraphe: '5.4.2',
      dispositions: `Les modifications de la structure du Capital du Candidat avant la constitution des garanties financières prévues au 6.2 ne sont pas autorisées.
Après constitution des garanties financières, si le Candidat n’a pas joint à son offre la lettre d’engagement du 3.3.6, les modifications de la structure du Capital du Candidat sont réputées autorisées. Elles doivent faire l’objet d’une information au Préfet dans un délai d’un (1) mois. Si le Candidat a joint à son offre la lettre d’engagement du 3.3.6, les modifications de la structure du Capital du Candidat doivent être autorisées par le Préfet.`,
    },
    texteIdentitéDuProducteur: {
      référenceParagraphe: '2.5',
      dispositions: `Le Candidat doit être le Producteur de l’Installation de production. Il ne peut pas indiquer dans son offre qu’une autre société sera le Producteur de l’Installation de production au cas où le projet serait retenu.`,
    },
    texteChangementDeProducteur: {
      référenceParagraphe: `5.4.1`,
      dispositions: `Aucun changement de Producteur n’est possible avant l’Achèvement.
Les changements de Producteur postérieurement à l’Achèvement sont réputés autorisés. Ils doivent faire l’objet d’une information préalable au Préfet et à EDF au minimum un (1) mois à l’avance.`,
    },
  },
  periodes: [
    {
      id: '1',
      title: 'première',
      type: 'legacy',
      cahierDesCharges: {
        référence: '2017/S 083-161855',
        url: 'https://www.cre.fr/media/fichiers/publications/appelsoffres/ancienne-version-du-cahier-des-charges-dans-sa-version-applicable-a-la-1ere-periode-ao-eolien-08112017',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
      garantieFinanciereEnMoisSansAutorisationEnvironnementale: 57,
      donnéesCourriersRéponse: {
        texteDélaisDAchèvement: {
          référenceParagraphe: '6.4',
          dispositions: `          
          Le  Candidat  dont  l’offre  a  été  retenue  s’engage  à  transmettre  à  EDF  l’attestation  de  conformité mentionnée au 6.5 dans un délai de trente-six (36) mois à compter de la Date de désignation. 
En cas de dépassement de ce délai, la durée de contrat mentionnée au 7.1 est réduite de la durée de dépassement. 
Sous  réserve  que  la  demande  complète  de  raccordement  de  l’Installation  ait  été  déposée  dans  les conditions  prévues  par  le  6.1  et  sous  réserve  que  le  Producteur  ait  mis  en  œuvre  toutes  les démarches  dans  le  respect  des  exigences  du  gestionnaire  de  réseau  pour  que  les  travaux  de raccordement soient réalisés dans les délais, les délais de transmission de l’attestation mentionnés ci-dessus sont prolongés lorsque la  mise  en service de l’Installation est  retardée du fait des délais nécessaires  à  la  réalisation  des  travaux  de  raccordement.  Dans  ce  cas,  le  Producteur  transmet l’attestation de conformité dans un délai de 2 mois à compter de la fin des travaux de raccordement notifiée   par   tout   document   transmis   par   le   gestionnaire   du   réseau   compétent.   
En   cas   de dépassement de ce délai, la durée de contrat mentionnée au 7.1  est amputée d’un raccourcissement égal à la durée de dépassement.
Pour la première période de candidature uniquement, les délais de transmission de l’attestation de conformité sont également prolongés lorsque des recours contentieux dirigés contre les autorisations administratives nécessaires à la réalisation de l'Installation ont eu pour effet de retarder son achèvement. La durée prise en compte pour calculer la prorogation des délais débute à la date d'enregistrement de chaque première requête de première instance et s'achève à la date à laquelle la dernière décision juridictionnelle relative à cette requête est devenue définitive.
Des délais supplémentaires, laissés à l’appréciation du ministre chargé de l’énergie, peuvent être accordés en cas d’événement imprévisible à la Date de désignation et extérieur au Producteur, dûment justifié.
Dans tous les cas, l’attribution des délais est soumis à la prolongation de la garantie financière mentionnée au 6.2 d’une durée équivalente à celle desdits délais, aucun délai ne pourra être accordé sans preuve de la prolongation de la garantie. Il appartient au Producteur d’informer EDF dans le cas d’obtention de délais, et ce dans les deux (2) semaines suivant la réception de la décision du ministre.
`,
        },
      },
    },
    {
      id: '2',
      title: 'deuxième',
      type: 'legacy',
      cahierDesCharges: {
        référence: '2017/S 083-161855',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/cdc-eolien-ancienne-version-du-cahier-des-charges-dans-sa-version-applicable-a-la-2eme-periode',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
      donnéesCourriersRéponse: {
        texteDélaisDAchèvement: {
          référenceParagraphe: '6.4',
          dispositions: `
          Le  Candidat  dont  l’offre  a  été  retenue  s’engage  à  transmettre  à  EDF  l’attestation  de  conformité mentionnée au 6.5 dans un délai de trente-six (36) mois à compter de la Date de désignation. 
En cas de dépassement de ce délai, la durée de contrat mentionnée au 7.1 est réduite de la durée de dépassement. 
Sous  réserve  que  la  demande  complète  de  raccordement  de  l’Installation  ait  été  déposée  dans  les conditions  prévues  par  le  6.1  et  sous  réserve  que  le  Producteur  ait  mis  en  œuvre  toutes  les démarches  dans  le  respect  des  exigences  du  gestionnaire  de  réseau  pour  que  les  travaux  de raccordement soient réalisés dans les délais, les délais de transmission de l’attestation mentionnés ci-dessus sont prolongés lorsque la  mise  en service de l’Installation est  retardée du fait des délais nécessaires  à  la  réalisation  des  travaux  de  raccordement.  Dans  ce  cas,  le  Producteur  transmet l’attestation de conformité dans un délai de 2 mois à compter de la fin des travaux de raccordement notifiée   par   tout   document   transmis   par   le   gestionnaire   du   réseau   compétent.   En   cas   de dépassement de ce délai, la durée de contrat mentionnée au 7.1  est amputée d’un raccourcissement égal à la durée de dépassement.
Pour la première période de candidature uniquement, les délais de transmission de l’attestation de conformité sont également prolongés lorsque des recours contentieux dirigés contre les autorisations administratives nécessaires à la réalisation de l'Installation ont eu pour effet de retarder son achèvement. La durée prise en compte pour calculer la prorogation des délais débute à la date d'enregistrement de chaque première requête de première instance et s'achève à la date à laquelle la dernière décision juridictionnelle relative à cette requête est devenue définitive.
Des délais supplémentaires, laissés à l’appréciation du ministre chargé de l’énergie, peuvent être accordés en cas d’événement imprévisible à la Date de désignation et extérieur au Producteur, dûment justifié.
Dans tous les cas, l’attribution des délais est soumis à la prolongation de la garantie financière mentionnée au 6.2 d’une durée équivalente à celle desdits délais, aucun délai ne pourra être accordé sans preuve de la prolongation de la garantie. Il appartient au Producteur d’informer EDF dans le cas d’obtention de délais, et ce dans les deux (2) semaines suivant la réception de la décision du ministre.
`,
        },
      },
    },
    {
      id: '3',
      title: 'troisième',
      type: 'legacy',
      cahierDesCharges: {
        référence: '2017/S 083-161855',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/cahier-des-charges_3eperioTelecharger-le-cahier-des-charges-en-vigueur-dans-sa-version-modifiee-le-04-mars-2019',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
      garantieFinanciereEnMoisSansAutorisationEnvironnementale: 57,
      donnéesCourriersRéponse: {
        texteDélaisDAchèvement: {
          référenceParagraphe: '6.4',
          dispositions: `
          Le  Candidat  dont  l’offre  a  été  retenue  s’engage  à  transmettre  à  EDF  l’attestation  de  conformité mentionnée au 6.5 dans un délai de trente-six (36) mois à compter de la Date de désignation. 
En cas de dépassement de ce délai, la durée de contrat mentionnée au 7.1 est réduite de la durée de dépassement. 
Sous  réserve  que  la  demande  complète  de  raccordement  de  l’Installation  ait  été  déposée  dans  les conditions  prévues  par  le  6.1  et  sous  réserve  que  le  Producteur  ait  mis  en  œuvre  toutes  les démarches  dans  le  respect  des  exigences  du  gestionnaire  de  réseau  pour  que  les  travaux  de raccordement soient réalisés dans les délais, les délais de transmission de l’attestation mentionnés ci-dessus sont prolongés lorsque la  mise  en service de l’Installation est  retardée du fait des délais nécessaires  à  la  réalisation  des  travaux  de  raccordement.  Dans  ce  cas,  le  Producteur  transmet l’attestation de conformité dans un délai de 2 mois à compter de la fin des travaux de raccordement notifiée   par   tout   document   transmis   par   le   gestionnaire   du   réseau   compétent.   En   cas   de dépassement de ce délai, la durée de contrat mentionnée au 7.1  est amputée d’un raccourcissement égal à la durée de dépassement.
Pour les première, troisième et quatrième périodes de candidature uniquement, les délais de transmission de l’attestation de conformité sont également prolongés lorsque des recours contentieux dirigés contre les autorisations administratives nécessaires à la réalisation de l'Installation ont eu pour effet de retarder son achèvement. La durée prise en compte pour calculer la prorogation des délais débute à la date d'enregistrement de chaque première requête de première instance et s'achève à la date à laquelle la dernière décision juridictionnelle relative à cette requête est devenue définitive.
Des délais supplémentaires, laissés à l’appréciation du ministre chargé de l’énergie, peuvent être accordés en cas d’événement imprévisible à la Date de désignation et extérieur au Producteur, dûment justifié. Il appartient au Producteur d’informer EDF dans le cas d’obtention de délais, et ce dans les deux (2) semaines suivant la réception de la décision du ministre.
Dans tous les cas, l’attribution des délais supplémentaires est conditionnée à la prolongation de la garantie financière mentionnée au 6.2 d’une durée équivalente à celle desdits délais. Le producteur transmet à la DREAL de la région d’implantation (cf. coordonnées en Annexe 5) un document conforme au modèle de l’Annexe 2 attestant de la prolongation de la garantie, la charge de la preuve de l’envoi reposant sur le lauréat en cas de litige. Pour attribution des délais, le Producteur fait parvenir à EDF, ou au ministre chargé de l’énergie le cas échéant, la preuve de cette transmission.
`,
        },
      },
    },
    {
      id: '4',
      title: 'quatrième',
      type: 'legacy',
      cahierDesCharges: {
        référence: '2017/S 083-161855',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/Eolien-Telecharger-le-cahier-des-charges-en-vigueur-dans-sa-version-modifiee-le-18-juin-2019',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
      donnéesCourriersRéponse: {
        texteDélaisDAchèvement: {
          référenceParagraphe: '6.4',
          dispositions: `
          Le  Candidat  dont  l’offre  a  été  retenue  s’engage  à  transmettre  à  EDF  l’attestation  de  conformité mentionnée au 6.5 dans un délai de trente-six (36) mois à compter de la Date de désignation. 
En cas de dépassement de ce délai, la durée de contrat mentionnée au 7.1 est réduite de la durée de dépassement. 
Sous  réserve  que  la  demande  complète  de  raccordement  de  l’Installation  ait  été  déposée  dans  les conditions  prévues  par  le  6.1  et  sous  réserve  que  le  Producteur  ait  mis  en  œuvre  toutes  les démarches  dans  le  respect  des  exigences  du  gestionnaire  de  réseau  pour  que  les  travaux  de raccordement soient réalisés dans les délais, les délais de transmission de l’attestation mentionnés ci-dessus sont prolongés lorsque la  mise  en service de l’Installation est  retardée du fait des délais nécessaires  à  la  réalisation  des  travaux  de  raccordement.  Dans  ce  cas,  le  Producteur  transmet l’attestation de conformité dans un délai de 2 mois à compter de la fin des travaux de raccordement notifiée   par   tout   document   transmis   par   le   gestionnaire   du   réseau   compétent.   En   cas   de dépassement de ce délai, la durée de contrat mentionnée au 7.1  est amputée d’un raccourcissement égal à la durée de dépassement.
          Pour les première, troisième et quatrième périodes de candidature uniquement, les délais de transmission de l’attestation de conformité sont également prolongés lorsque des recours contentieux dirigés contre les autorisations administratives nécessaires à la réalisation de l'Installation ont eu pour effet de retarder son achèvement. La durée prise en compte pour calculer la prorogation des délais débute à la date d'enregistrement de chaque première requête de première instance et s'achève à la date à laquelle la dernière décision juridictionnelle relative à cette requête est devenue définitive.
Des délais supplémentaires, laissés à l’appréciation du ministre chargé de l’énergie, peuvent être accordés en cas d’événement imprévisible à la Date de désignation et extérieur au Producteur, dûment justifié. Il appartient au Producteur d’informer EDF dans le cas d’obtention de délais, et ce dans les deux (2) semaines suivant la réception de la décision du ministre.
Dans tous les cas, l’attribution des délais supplémentaires est conditionnée à la prolongation de la garantie financière mentionnée au 6.2 d’une durée équivalente à celle desdits délais. Le producteur transmet à la DREAL de la région d’implantation (cf. coordonnées en Annexe 5) un document conforme au modèle de l’Annexe 2 attestant de la prolongation de la garantie, la charge de la preuve de l’envoi reposant sur le lauréat en cas de litige. Pour attribution des délais, le Producteur fait parvenir à EDF, ou au ministre chargé de l’énergie le cas échéant, la preuve de cette transmission.
`,
        },
      },
    },
    {
      id: '5',
      title: 'cinquième',
      type: 'legacy',
      cahierDesCharges: {
        référence: '2017/S 083-161855',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/telecharger-le-cahier-des-charges-en-vigueur-dans-sa-version-modifiee-le-23-octobre-2019',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
      donnéesCourriersRéponse: {
        texteDélaisDAchèvement: {
          référenceParagraphe: '6.4',
          dispositions: `
          Le Candidat dont l’offre a été retenue s’engage à transmettre à EDF l’attestation de conformité mentionnée au 6.5  dans un délai de trente-six (36) mois à compter de la Date de désignation.
En cas de dépassement de ce délai, la durée de contrat mentionnée au 7.1  est réduite de la durée de dépassement.
Sous réserve que la demande complète de raccordement de l’Installation ait été déposée dans les conditions  prévues  par  le  6.1  et  sous  réserve  que  le  Producteur  ait  mis  en  œuvre  toutes  les démarches  dans  le  respect  des  exigences  du  gestionnaire  de  réseau  pour  que  les  travaux  de raccordement soient réalisés dans les délais, les délais de transmission de l’attestation mentionnés ci -dessus sont prolongés lorsque la mise en service de l’Installation est retardée du fait des délais nécessaires  à  la  réalisation  des  travaux  de  raccordement.  Dans  ce  cas,  le  Producteur  transmet l’attestation de conformité dans un délai de 2 mois à compter de la fin des travaux de raccordement notifiée  par  tout  document  transmis  par  le  gestionnaire  du  réseau  compétent.  En  cas  de dépassement de ce délai, la durée de contrat mentionnée au 7.1    est amputée d’un raccourcissement égal à la durée de dépassement.
          Excepté pour la seconde période, les délais de transmission de l’attestation mentionnés ci-dessus sont également prolongés lorsque des recours contentieux dirigés contre les autorisations administratives nécessaires à la réalisation de l'Installation ont eu pour effet de retarder son achèvement. La durée prise en compte pour calculer la prorogation des délais débute à la date d'enregistrement de chaque première requête de première instance et s'achève à la date à laquelle la dernière décision juridictionnelle relative à cette requête est devenue définitive.
Des délais supplémentaires, laissés à l’appréciation du ministre chargé de l’énergie, peuvent être accordés en cas d’événement imprévisible à la Date de désignation et extérieur au Producteur, dûment justifié. Il appartient au Producteur d’informer EDF dans le cas d’obtention de délais, et ce dans les deux (2) semaines suivant la réception de la décision du ministre.
Dans tous les cas, l’attribution des délais supplémentaires est conditionnée à la prolongation de la garantie financière mentionnée au 6.2 d’une durée équivalente à celle desdits délais. Le producteur transmet à la DREAL de la région d’implantation (cf. coordonnées en Annexe 5) un document conforme au modèle de l’Annexe 2 attestant de la prolongation de la garantie, la charge de la preuve de l’envoi reposant sur le lauréat en cas de litige. Pour attribution des délais, le Producteur fait parvenir à EDF, ou au ministre chargé de l’énergie le cas échéant, la preuve de cette transmission.
`,
        },
      },
    },
    {
      id: '6',
      title: 'sixième',
      certificateTemplate: 'cre4.v1',
      noteThreshold: 10.19,
      cahierDesCharges: {
        référence: '2017/S 083-161855',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/eolien-terrestre-telecharger-le-cahier-des-charges-en-vigueur-dans-sa-version-modifiee-le-4-mai-2020',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
      donnéesCourriersRéponse: {
        texteDélaisDAchèvement: {
          référenceParagraphe: '6.4',
          dispositions: `
          Le  Candidat  dont  l’offre  a  été  retenue  s’engage  à  transmettre  à  EDF  l’attestation  de  conformité mentionnée au 6.5 dans un délai de trente-six (36) mois à compter de la Date de désignation. 
En cas de dépassement de ce délai, la durée de contrat mentionnée au 7.1 est réduite de la durée de dépassement. 
Sous  réserve  que  la  demande  complète  de  raccordement  de  l’Installation  ait  été  déposée  dans  les conditions prévues par le 6.1 et sous réserve que le Producteur ait mis en œuvre toutes les démarches dans le respect des exigences du gestionnaire de réseau pour que les travaux de raccordement soient réalisés  dans  les  délais,  les  délais  de  transmission  de  l’attestation  mentionnés  ci-dessus  sont prolongés lorsque la mise en service de l’Installation est retardée du fait des délais nécessaires à la réalisation  des  travaux  de  raccordement.  Dans  ce  cas,  le  Producteur  transmet  l’attestation  de conformité dans un délai de 2 mois à compter de la fin des travaux de raccordement notifiée par tout document transmis par le gestionnaire du réseau compétent. En cas de dépassement de ce délai, la durée  de  contrat  mentionnée  au  7.1    est  amputée  d’un  raccourcissement  égal  à  la  durée  de dépassement. 
          Excepté pour la seconde période, les délais de transmission de l’attestation mentionnés ci-dessus sont également prolongés lorsque des recours contentieux dirigés contre les autorisations administratives nécessaires à la réalisation de l'Installation ont eu pour effet de retarder son achèvement. La durée prise en compte pour calculer la prorogation des délais débute à la date d'enregistrement de chaque première requête de première instance et s'achève à la date à laquelle la dernière décision juridictionnelle relative à cette requête est devenue définitive.
Des délais supplémentaires, laissés à l’appréciation du ministre chargé de l’énergie, peuvent être accordés en cas d’événement imprévisible à la Date de désignation et extérieur au Producteur, dûment justifié. Il appartient au Producteur d’informer EDF dans le cas d’obtention de délais, et ce dans les deux (2) semaines suivant la réception de la décision du ministre.
Dans tous les cas, l’attribution des délais supplémentaires est conditionnée à la prolongation de la garantie financière mentionnée au 6.2 d’une durée équivalente à celle desdits délais. Le producteur transmet à la DREAL de la région d’implantation (cf. coordonnées en Annexe 5) un document conforme au modèle de l’Annexe 2 attestant de la prolongation de la garantie, la charge de la preuve de l’envoi reposant sur le lauréat en cas de litige. Pour attribution des délais, le Producteur fait parvenir à EDF, ou au ministre chargé de l’énergie le cas échéant, la preuve de cette transmission.
`,
        },
      },
    },
    {
      id: '7',
      title: 'septième',
      certificateTemplate: 'cre4.v1',
      noteThreshold: 13,
      cahierDesCharges: {
        référence: '2017/S 083-161855',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/eolien-terrestre-telecharger-le-cahier-des-charges-en-vigueur-dans-sa-version-modifiee-le-4-mai-2020',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
      donnéesCourriersRéponse: {
        texteDélaisDAchèvement: {
          référenceParagraphe: '6.4',
          dispositions: `
          Le  Candidat  dont  l’offre  a  été  retenue  s’engage  à  transmettre  à  EDF  l’attestation  de  conformité mentionnée au 6.5 dans un délai de trente-six (36) mois à compter de la Date de désignation. 
En cas de dépassement de ce délai, la durée de contrat mentionnée au 7.1 est réduite de la durée de dépassement. 
Sous  réserve  que  la  demande  complète  de  raccordement  de  l’Installation  ait  été  déposée  dans  les conditions prévues par le 6.1 et sous réserve que le Producteur ait mis en œuvre toutes les démarches dans le respect des exigences du gestionnaire de réseau pour que les travaux de raccordement soient réalisés  dans  les  délais,  les  délais  de  transmission  de  l’attestation  mentionnés  ci-dessus  sont prolongés lorsque la mise en service de l’Installation est retardée du fait des délais nécessaires à la réalisation  des  travaux  de  raccordement.  Dans  ce  cas,  le  Producteur  transmet  l’attestation  de conformité dans un délai de 2 mois à compter de la fin des travaux de raccordement notifiée par tout document transmis par le gestionnaire du réseau compétent. En cas de dépassement de ce délai, la durée  de  contrat  mentionnée  au  7.1    est  amputée  d’un  raccourcissement  égal  à  la  durée  de dépassement. 
          Excepté pour la seconde période, les délais de transmission de l’attestation mentionnés ci-dessus sont également prolongés lorsque des recours contentieux dirigés contre les autorisations administratives nécessaires à la réalisation de l'Installation ont eu pour effet de retarder son achèvement. La durée prise en compte pour calculer la prorogation des délais débute à la date d'enregistrement de chaque première requête de première instance et s'achève à la date à laquelle la dernière décision juridictionnelle relative à cette requête est devenue définitive.
Des délais supplémentaires, laissés à l’appréciation du ministre chargé de l’énergie, peuvent être accordés en cas d’événement imprévisible à la Date de désignation et extérieur au Producteur, dûment justifié. Il appartient au Producteur d’informer EDF dans le cas d’obtention de délais, et ce dans les deux (2) semaines suivant la réception de la décision du ministre.
Dans tous les cas, l’attribution des délais supplémentaires est conditionnée à la prolongation de la garantie financière mentionnée au 6.2 d’une durée équivalente à celle desdits délais. Le producteur transmet à la DREAL de la région d’implantation (cf. coordonnées en Annexe 5) un document conforme au modèle de l’Annexe 2 attestant de la prolongation de la garantie, la charge de la preuve de l’envoi reposant sur le lauréat en cas de litige. Pour attribution des délais, le Producteur fait parvenir à EDF, ou au ministre chargé de l’énergie le cas échéant, la preuve de cette transmission.
`,
        },
      },
    },
    {
      id: '8',
      title: 'huitième',
      certificateTemplate: 'cre4.v1',
      noteThreshold: 9.8,
      cahierDesCharges: {
        référence: '2017/S 083-161855',
        url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/ao-terrestre-telecharger-le-cahier-des-charges-en-vigueur-dans-sa-version-modifiee-le-19-fevrier-2021',
      },
      delaiDcrEnMois: { valeur: 2, texte: 'deux' },
      donnéesCourriersRéponse: {
        texteDélaisDAchèvement: {
          référenceParagraphe: '6.4',
          dispositions: `
          Le  Candidat  dont  l’offre  a  été  retenue  s’engage  à  transmettre  à  EDF  l’attestation  de  conformité mentionnée au 6.5 dans un délai de trente-six (36) mois à compter de la Date de désignation. 
En cas de dépassement de ce délai, la durée de contrat mentionnée au 7.1 est réduite de la durée de dépassement. 
Sous  réserve  que  la  demande  complète  de  raccordement  de  l’Installation  ait  été  déposée  dans  les conditions prévues par le 6.1 et sous réserve que le Producteur ait mis en œuvre toutes les démarches dans le respect des exigences du gestionnaire de réseau pour que les travaux de raccordement soient réalisés  dans  les  délais,  les  délais  de  transmission  de  l’attestation  mentionnés  ci-dessus  sont prolongés lorsque la mise en service de l’Installation est retardée du fait des délais nécessaires à la réalisation  des  travaux  de  raccordement.  Dans  ce  cas,  le  Producteur  transmet  l’attestation  de conformité dans un délai de deux (2) mois à compter de la fin des travaux de raccordement notifiée par tout document transmis par le gestionnaire du réseau compétent. En cas de dépassement de ce délai, la durée de contrat mentionnée au 7.1  est amputée d’un raccourcissement égal à la durée de dépassement.
          Excepté pour la seconde période, les délais de transmission de l’attestation mentionnés ci-dessus sont également prolongés lorsque des recours contentieux dirigés contre les autorisations administratives nécessaires à la réalisation de l'Installation ont eu pour effet de retarder son achèvement. La durée prise en compte pour calculer la prorogation des délais débute à la date d'enregistrement de chaque première requête de première instance et s'achève à la date à laquelle la dernière décision juridictionnelle relative à cette requête est devenue définitive.
Des délais supplémentaires, laissés à l’appréciation du ministre chargé de l’énergie, peuvent être accordés en cas d’événement imprévisible à la Date de désignation et extérieur au Producteur, dûment justifié. Il appartient au Producteur d’informer EDF dans le cas d’obtention de délais, et ce dans les deux (2) semaines suivant la réception de la décision du ministre.
Dans tous les cas, l’attribution des délais supplémentaires est conditionnée à la prolongation de la garantie financière mentionnée au 6.2 d’une durée équivalente à celle desdits délais. Le producteur transmet à la DREAL de la région d’implantation (cf. coordonnées en Annexe 5) un document conforme au modèle de l’Annexe 2 attestant de la prolongation de la garantie, la charge de la preuve de l’envoi reposant sur le lauréat en cas de litige. Pour attribution des délais, le Producteur fait parvenir à EDF, ou au ministre chargé de l’énergie le cas échéant, la preuve de cette transmission.
        `,
        },
      },
    },
  ],
  familles: [],
  cahiersDesChargesModifiésDisponibles: [
    {
      type: 'modifié',
      paruLe: '30/08/2022',
      numéroGestionnaireRequis: true,
      url: 'https://www.cre.fr/media/Fichiers/publications/appelsoffres/cre-4-eolien-telecharger-l-avis-modificatif-publie-le-30-aout-2022',
      donnéesCourriersRéponse: {
        texteChangementDePuissance: {
          référenceParagraphe: `5.4.5`,
          dispositions: `
          Les modifications de la Puissance installée avant l’Achèvement sont autorisées, sous réserve que la Puissance de l’Installation modifiée soit comprise entre quatre-vingt-dix pourcents (90 %) et cent-dix pourcents (110 %) de la Puissance indiquée dans l’offre. Elles doivent faire l’objet d’une information au Préfet.
    Pour  les  projets  dont  soit  l'achèvement,  soit  la  mise  en  service  est  antérieur  au  31  décembre  2024,  cette  augmentation  de  puissance  peut  être  portée  à  140%  de  la  Puissance  formulée  dans  l’offre,  à condition qu’elle soit permise par l’autorisation environnementale de l’Installation, y compris si celle-ci a été modifiée.
    Les modifications de la Puissance installée hors de cette fourchette ou les modifications à la hausse de la Puissance installée après l’Achèvement ne sont pas autorisées.
    Par dérogation, les modifications à la baisse de la Puissance installée qui seraient imposées soit par une décision de l’Etat dans le cadre de la procédure d’autorisation mentionnée au 3.3.3 pour la première période de candidature, ou par une décision de justice concernant l’autorisation mentionnée au 3.3.3 pour l’ensemble des périodes de candidature, sont acceptées. Elles doivent faire l’objet d’une information au Préfet.`,
        },
        texteDélaisDAchèvement: {
          référenceParagraphe: '6.4',
          dispositions: `
          Le  Candidat  dont  l’offre  a  été  retenue  s’engage  à  transmettre  à  EDF  l’attestation  de  conformité mentionnée au 6.5 dans un délai de trente-six (36) mois à compter de la Date de désignation. En cas de dépassement de ce délai, la durée de contrat mentionnée au 7.1 est réduite de la durée de dépassement.
Sous  réserve  que  la  demande  complète  de  raccordement  de  l’Installation  ait  été  déposée  dans  les conditions  prévues  par  le  6.1  et  sous  réserve  que  le  Producteur  ait  mis  en  œuvre  toutes  les démarches  dans  le  respect  des  exigences  du  gestionnaire  de  réseau  pour  que  les  travaux  de raccordement soient réalisés dans les délais, les délais de transmission de l’attestation mentionnés ci-dessus sont prolongés lorsque la  mise  en service de l’Installation est  retardée du fait des délais nécessaires  à  la  réalisation  des  travaux  de  raccordement.  Dans  ce  cas,  le  Producteur  transmet l’attestation de conformité dans un délai de 2 mois à compter de la fin des travaux de raccordement notifiée   par   tout   document   transmis   par   le   gestionnaire   du   réseau   compétent.   
En   cas   de dépassement de ce délai, la durée de contrat mentionnée au 7.1  est amputée d’un raccourcissement égal à la durée de dépassement.

          !!!!!OPTION : PERIODES 1 A 2 !!!!! Pour la première période de candidature uniquement, les délais de transmission de l’attestation de conformité sont également prolongés lorsque des recours contentieux dirigés contre les autorisations administratives nécessaires à la réalisation de l'Installation ont eu pour effet de retarder son achèvement. La durée prise en compte pour calculer la prorogation des délais débute à la date d'enregistrement de chaque première requête de première instance et s'achève à la date à laquelle la dernière décision juridictionnelle relative à cette requête est devenue définitive.
Pour les installations dont la mise en service a lieu entre le 1er septembre 2022 et le 31 décembre 2024 inclus,  la limite d’Achèvement est repoussée de dix-huit (18) mois supplémentaires.
Des délais supplémentaires pour l’Achèvement ou, pour ce qui concerne l’échéance du 31 décembre 2024 mentionnée au présent 6.4 et au 7.1, pour la mise en service, laissés à l’appréciation du ministre chargé de l’énergie, peuvent être accordés en cas d’événement imprévisible à la Date de désignation et extérieur au Producteur, dûment justifié.
Dans tous les cas, l’attribution des délais est soumis à la prolongation de la garantie financière mentionnée au 6.2 d’une durée équivalente à celle desdits délais, aucun délai ne pourra être accordé sans preuve de la prolongation de la garantie. Il appartient au Producteur d’informer EDF dans le cas d’obtention de délais, et ce dans les deux (2) semaines suivant la réception de la décision du ministre.

          !!!!!OPTION : PERIODES 3 A 4 !!!!! Pour les première, troisième et quatrième périodes de candidature uniquement, les délais de transmission de l’attestation de conformité sont également prolongés lorsque des recours contentieux dirigés contre les autorisations administratives nécessaires à la réalisation de l'Installation ont eu pour effet de retarder son achèvement. La durée prise en compte pour calculer la prorogation des délais débute à la date d'enregistrement de chaque première requête de première instance et s'achève à la date à laquelle la dernière décision juridictionnelle relative à cette requête est devenue définitive.
Pour les installations dont la mise en service a lieu entre le 1er septembre 2022 et le 31 décembre 2024 inclus, la limite d’Achèvement est repoussée de dix-huit (18) mois supplémentaires.Des délais supplémentaires pour l’Achèvement ou, pour ce qui concerne l’échéance du 31 décembre 2024 mentionnée au présent 6.4 et au 7.1, pour la mise en service, laissés à l’appréciation du ministre chargé de l’énergie, peuvent être accordés en cas d’événement imprévisible à la Date de désignation et extérieur au Producteur, dûment justifié.
Dans tous les cas, l’attribution des délais supplémentaires est conditionnée à la prolongation de la garantie financière mentionnée au 6.2 d’une durée équivalente à celle desdits délais. Le producteur transmet à la DREAL de la région d’implantation (cf. coordonnées en Annexe 5) un document conforme au modèle de l’Annexe 2 attestant de la prolongation de la garantie, la charge de la preuve de l’envoi reposant sur le lauréat en cas de litige. Pour attribution des délais, le Producteur fait parvenir à EDF, ou au ministre chargé de l’énergie le cas échéant, la preuve de cette transmission.

          !!!!!OPTION : PERIODES 5 A 8 !!!!! Excepté pour la seconde période, les délais de transmission de l’attestation mentionnés ci-dessus sont également prolongés lorsque des recours contentieux dirigés contre les autorisations administratives nécessaires à la réalisation de l'Installation ont eu pour effet de retarder son achèvement. La durée prise en compte pour calculer la prorogation des délais débute à la date d'enregistrement de chaque première requête de première instance et s'achève à la date à laquelle la dernière décision juridictionnelle relative à cette requête est devenue définitive.
Pour les installations dont la mise en service a lieu entre le 1er septembre 2022 et le 31 décembre 2024 inclus, la limite d’Achèvement est repoussée de dix-huit (18) mois supplémentaires.Des délais supplémentaires pour l’Achèvement ou, pour ce qui concerne l’échéance du 31 décembre 2024 mentionnée au présent 6.4 et au 7.1, pour la mise en service, laissés à l’appréciation du ministre chargé de l’énergie, peuvent être accordés en cas d’événement imprévisible à la Date de désignation et extérieur au Producteur, dûment justifié.
Dans tous les cas, l’attribution des délais supplémentaires est conditionnée à la prolongation de la garantie financière mentionnée au 6.2 d’une durée équivalente à celle desdits délais. Le producteur transmet à la DREAL de la région d’implantation (cf. coordonnées en Annexe 5) un document conforme au modèle de l’Annexe 2 attestant de la prolongation de la garantie, la charge de la preuve de l’envoi reposant sur le lauréat en cas de litige. Pour attribution des délais, le Producteur fait parvenir à EDF, ou au ministre chargé de l’énergie le cas échéant, la preuve de cette transmission.
          `,
        },
      },
      délaiApplicable: {
        délaiEnMois: 18,
        intervaleDateMiseEnService: { min: new Date('2022-06-01'), max: new Date('2024-09-30') },
      },
    },
  ],
};

export { eolien };
