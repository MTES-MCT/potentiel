import { UniqueEntityID } from '@core/domain'
import { makeUser } from '@entities'
import moment from 'moment'
import { formatDate } from '../../../../helpers/formatDate'
import makeFakeFile from '../../../../__tests__/fixtures/file'
import makeFakeProject from '../../../../__tests__/fixtures/project'
import makeFakeUser from '../../../../__tests__/fixtures/user'
import { resetDatabase } from '../../helpers'
import models from '../../models'
import { getModificationRequestDataForResponseTemplate } from './getModificationRequestDataForResponseTemplate'

const dgecEmail = 'dgec@test.test'
const appelOffreId = 'Fessenheim'
const periodeId = '1'

describe('Requête sequelize getModificationRequestDataForResponseTemplate', () => {
  const { Project, ModificationRequest, User, File, UserDreal } = models

  const projectId = new UniqueEntityID().toString()
  const fileId = new UniqueEntityID().toString()
  const modificationRequestId = new UniqueEntityID().toString()
  const userId = new UniqueEntityID().toString()
  const userId2 = new UniqueEntityID().toString()

  const fakeAdminUser = makeUser(makeFakeUser({ role: 'admin', fullName: 'John Doe' })).unwrap()

  const versionDate = new Date(123)

  const projectInfo = {
    id: projectId,
    numeroCRE: 'numeroCRE',
    nomProjet: 'nomProjet',
    nomCandidat: 'nomCandidat',
    communeProjet: 'communeProjet',
    codePostalProjet: 'codePostalProjet',
    departementProjet: 'departementProjet',
    email: 'email',
    regionProjet: 'Corse',
    puissance: 123,
    notifiedOn: 321,
    appelOffreId,
    periodeId,
    familleId: '1',
    nomRepresentantLegal: 'nomRepresentantLegal',
    prixReference: 456,
    evaluationCarbone: 345,
    details: {
      'Adresse postale du contact': 'adresse postale',
    },
    completionDueOn: 8910,
    motifElimination: 'Non instruit: blabla',
  }

  const project = makeFakeProject(projectInfo)

  describe('Cas général : retourner les info génériques du projet et de la demande de modification', () => {
    beforeAll(async () => {
      // Create the tables and remove all data
      await resetDatabase()

      await Project.create(project)

      await File.create(makeFakeFile({ id: fileId, filename: 'filename' }))

      await User.create(makeFakeUser({ id: userId, fullName: 'John Doe', role: 'admin' }))

      await ModificationRequest.create({
        id: modificationRequestId,
        projectId,
        userId,
        fileId,
        type: 'recours',
        requestedOn: 123,
        respondedOn: 321,
        respondedBy: userId2,
        status: 'envoyée',
        justification: 'justification',
        authority: 'dreal',
        versionDate,
      })
    })

    it(`Les champs génériques de la demande de modifications devraient être retournés`, async () => {
      const modificationRequestResult = await getModificationRequestDataForResponseTemplate(
        modificationRequestId.toString(),
        fakeAdminUser,
        dgecEmail
      )

      expect(modificationRequestResult.isOk()).toBe(true)
      if (modificationRequestResult.isErr()) return

      const modificationRequestDTO = modificationRequestResult.value

      expect(modificationRequestDTO).toMatchObject({
        suiviPar: 'John Doe',
        suiviParEmail: dgecEmail,
        refPotentiel: project.potentielIdentifier,

        status: 'envoyée',

        nomRepresentantLegal: 'nomRepresentantLegal',
        nomCandidat: 'nomCandidat',
        adresseCandidat: 'adresse postale',
        email: 'email',

        titrePeriode: 'première',
        titreAppelOffre:
          '2019/S 019-040037 portant sur la réalisation et l’exploitation d’Installations de production d’électricité à partir de l’énergie solaire « transition énergétique du territoire de Fessenheim »',
        familles: 'yes',
        titreFamille: '1',

        nomProjet: 'nomProjet',
        puissance: '123',
        codePostalProjet: 'codePostalProjet',
        communeProjet: 'communeProjet',
        unitePuissance: 'MWc',

        dateDemande: '01/01/1970',
        justificationDemande: 'justification',
      })
    })
  })

  describe(`Cas d'un utilisateur Dreal : inclure ses informations dans le DTO retourné`, () => {
    const drealUserId = new UniqueEntityID().toString()
    const fakeDrealUser = makeUser(
      makeFakeUser({
        id: drealUserId,
        role: 'dreal',
        email: 'dreal@test.test',
        fullName: 'John Doe',
      })
    ).unwrap()

    beforeAll(async () => {
      // Create the tables and remove all data
      await resetDatabase()

      await Project.create(project)

      await File.create(makeFakeFile({ id: fileId, filename: 'filename' }))

      await User.create(makeFakeUser({ id: userId }))
      await User.create(makeFakeUser(fakeDrealUser))

      await UserDreal.create({
        userId: drealUserId,
        dreal: 'Bretagne',
      })
      await UserDreal.create({
        userId: drealUserId,
        dreal: 'Corse',
      })

      await ModificationRequest.create({
        id: modificationRequestId,
        projectId,
        userId,
        fileId,
        type: 'recours',
        requestedOn: 123,
        respondedOn: 321,
        respondedBy: userId2,
        status: 'envoyée',
        justification: 'justification',
        versionDate,
      })
    })

    it(`Etant donné un utilisateur Dreal téléchargeant un modèle de réponse, 
    Alors ses nom, email et région devraient être retournées dans le DTO`, async () => {
      const modificationRequestResult = await getModificationRequestDataForResponseTemplate(
        modificationRequestId.toString(),
        fakeDrealUser,
        dgecEmail
      )

      expect(modificationRequestResult.isOk()).toBe(true)
      if (modificationRequestResult.isErr()) return

      const modificationRequestDTO = modificationRequestResult.value

      expect(modificationRequestDTO).toMatchObject({
        suiviPar: 'John Doe',
        suiviParEmail: 'dreal@test.test',
        dreal: 'Corse',
      })
    })
  })

  describe(`Cas d'une demande de délai faite en mois`, () => {
    describe(`Etant donné une demande précédente importée dans Potentiel`, () => {
      beforeAll(async () => {
        // Create the tables and remove all data
        await resetDatabase()

        await Project.create(project)

        await File.create(makeFakeFile({ id: fileId, filename: 'filename' }))

        await User.create(makeFakeUser({ id: userId, fullName: 'John Doe' }))

        await ModificationRequest.create({
          id: modificationRequestId,
          projectId,
          userId,
          fileId,
          type: 'delai',
          requestedOn: 123,
          respondedOn: 321,
          respondedBy: userId2,
          status: 'envoyée',
          justification: 'justification',
          versionDate,
          delayInMonths: 2,
        })

        // Add a previous request that is accepted
        await ModificationRequest.create({
          id: new UniqueEntityID().toString(),
          projectId,
          userId,
          fileId,
          type: 'delai',
          requestedOn: 789,
          respondedOn: 897,
          respondedBy: userId2,
          status: 'acceptée',
          justification: 'justification',
          versionDate,
          delayInMonths: null,
          isLegacy: true,
          acceptanceParams: {
            ancienneDateLimiteAchevement: new Date('2020-01-01').getTime(),
            nouvelleDateLimiteAchevement: new Date('2020-04-01').getTime(),
          },
        })
      })

      it(`Alors les informations de cette demande importée devraient être retournées dans le DTO`, async () => {
        const modificationRequestResult = await getModificationRequestDataForResponseTemplate(
          modificationRequestId.toString(),
          fakeAdminUser,
          dgecEmail
        )

        expect(modificationRequestResult.isOk()).toBe(true)
        if (modificationRequestResult.isErr()) return

        const modificationRequestDTO = modificationRequestResult.value

        expect(modificationRequestDTO).toMatchObject({
          demandePrecedente: 'yes',
          dateDepotDemandePrecedente: formatDate(789),
          dureeDelaiDemandePrecedenteEnMois: '3',
          dateReponseDemandePrecedente: formatDate(897),
          autreDelaiDemandePrecedenteAccorde: '',
          delaiDemandePrecedenteAccordeEnMois: '3',
        })
      })
    })

    describe(`S'il s'agit de la première demande de délai pour le projet`, () => {
      beforeAll(async () => {
        // Create the tables and remove all data
        await resetDatabase()

        await Project.create(project)

        await File.create(makeFakeFile({ id: fileId, filename: 'filename' }))

        await User.create(makeFakeUser({ id: userId, fullName: 'John Doe' }))

        await ModificationRequest.create({
          id: modificationRequestId,
          projectId,
          userId,
          fileId,
          type: 'delai',
          requestedOn: 123,
          respondedOn: 321,
          respondedBy: userId2,
          status: 'envoyée',
          justification: 'justification',
          versionDate,
          delayInMonths: 2,
        })
      })

      it(`Alors une liste spécifique de données doit être retournée, 
      notamment une nouvelle date d'achèvement calculée à partir du délai demandé en mois`, async () => {
        const modificationRequestResult = await getModificationRequestDataForResponseTemplate(
          modificationRequestId.toString(),
          fakeAdminUser,
          dgecEmail
        )

        expect(modificationRequestResult.isOk()).toBe(true)
        if (modificationRequestResult.isErr()) return

        const modificationRequestDTO = modificationRequestResult.value
        const dateLimiteAchevementActuelle = 8910

        expect(modificationRequestDTO).toMatchObject({
          type: 'delai',
          // Les deux données ci-dessous sont stockées en mémoire dans l'AO Fessenheim
          referenceParagrapheAchevement: '6.4',
          contenuParagrapheAchevement: `Le Candidat dont l’offre a été retenue s’engage à ce que l’Achèvement de son Installation intervienne avant une limite définie par la date la plus tardive des deux dates suivantes :
- vingt-quatre (24) mois à compter de la Date de désignation.
- deux mois à compter de la fin des travaux de raccordement, sous réserve que le Producteur ait mis en oeuvre toutes les démarches dans le respect des exigences du gestionnaire de réseau pour que les travaux de raccordement soient réalisés dans les délais. Dans ce cas, l’attestation de conformité doit être transmise au Cocontractant dans un délai de 2 mois à compter de la fin des travaux de raccordement (date déclarée par le gestionnaire de réseau).
En cas de dépassement de ce délai la durée de contrat mentionnée au 7.1 est réduite de la durée de dépassement.
Des dérogations au délai d’Achèvement sont toutefois possibles dans le cas où des contentieux administratifs effectués à l’encontre de toute autorisation administrative nécessaire à la réalisation du projet ont pour effet de retarder l’achèvement de l’installation. Dans ce cas, un délai supplémentaire égal à la durée entre la date du recours initial et la date de la décision définitive attestée par la décision ayant autorité de la chose jugée est alors accordé dans le cadre de contentieux.
Ces retards sont réputés autorisés sous réserve de pouvoir les justifier auprès de l’acheteur obligé.
Des délais supplémentaires, laissés à l’appréciation du Préfet, peuvent être accordés en cas d’événement imprévisible à la Date de désignation et extérieur au Producteur, dûment justifié.
`,
          dateLimiteAchevementInitiale: formatDate(
            Number(moment(321).add(24, 'months').subtract(1, 'day'))
          ),
          dateLimiteAchevementActuelle: formatDate(dateLimiteAchevementActuelle),
          dateAchèvementDemandée: formatDate(
            Number(moment(dateLimiteAchevementActuelle).add(2, 'months'))
          ),
          dateNotification: formatDate(321),
        })
      })
    })

    describe(`Etant donné une demande précédente en mois faite dans Potentiel`, () => {
      beforeAll(async () => {
        // Create the tables and remove all data
        await resetDatabase()

        await Project.create(project)

        await File.create(makeFakeFile({ id: fileId, filename: 'filename' }))

        await User.create(makeFakeUser({ id: userId, fullName: 'John Doe' }))

        await ModificationRequest.create({
          id: modificationRequestId,
          projectId,
          userId,
          fileId,
          type: 'delai',
          requestedOn: 123,
          respondedOn: 321,
          respondedBy: userId2,
          status: 'envoyée',
          justification: 'justification',
          versionDate,
          delayInMonths: 2,
        })

        // Add a previous request that is accepted
        await ModificationRequest.create({
          id: new UniqueEntityID().toString(),
          projectId,
          userId,
          fileId,
          type: 'delai',
          requestedOn: 789,
          respondedOn: 897,
          respondedBy: userId2,
          status: 'acceptée',
          justification: 'justification',
          versionDate,
          delayInMonths: 4,
          acceptanceParams: {
            delayInMonths: 3,
          },
        })
      })

      it(`Alors les informations de la première demande devraient être retournées dans le DTO`, async () => {
        const modificationRequestResult = await getModificationRequestDataForResponseTemplate(
          modificationRequestId.toString(),
          fakeAdminUser,
          dgecEmail
        )

        expect(modificationRequestResult.isOk()).toBe(true)
        if (modificationRequestResult.isErr()) return

        const modificationRequestDTO = modificationRequestResult.value

        expect(modificationRequestDTO).toMatchObject({
          demandePrecedente: 'yes',
          demandeEnMois: 'yes',
          dateDepotDemandePrecedente: formatDate(789),
          dureeDelaiDemandePrecedenteEnMois: '4',
          dateReponseDemandePrecedente: formatDate(897),
          autreDelaiDemandePrecedenteAccorde: 'yes', // asked for 4, given 3
          delaiDemandePrecedenteAccordeEnMois: '3',
        })
      })
    })
  })

  describe(`Cas d'une demande de délai avec nouvelle date d'achèvement`, () => {
    describe(`S'il s'agit de la première demande de délai pour ce projet`, () => {
      beforeAll(async () => {
        // Create the tables and remove all data
        await resetDatabase()

        await Project.create(project)

        await File.create(makeFakeFile({ id: fileId, filename: 'filename' }))

        await User.create(makeFakeUser({ id: userId, fullName: 'John Doe' }))

        await ModificationRequest.create({
          id: modificationRequestId,
          projectId,
          userId,
          fileId,
          type: 'delai',
          requestedOn: 123,
          respondedOn: 321,
          respondedBy: userId2,
          status: 'envoyée',
          justification: 'justification',
          versionDate,
          dateAchèvementDemandée: new Date('2022-01-01').getTime(),
        })
      })

      it(`Alors une liste spécifique de données devrait être retournée`, async () => {
        const modificationRequestResult = await getModificationRequestDataForResponseTemplate(
          modificationRequestId.toString(),
          fakeAdminUser,
          dgecEmail
        )

        expect(modificationRequestResult.isOk()).toBe(true)
        if (modificationRequestResult.isErr()) return

        const modificationRequestDTO = modificationRequestResult.value
        const dateLimiteAchevementActuelle = 8910

        expect(modificationRequestDTO).toMatchObject({
          type: 'delai',
          referenceParagrapheAchevement: '6.4',
          contenuParagrapheAchevement: `Le Candidat dont l’offre a été retenue s’engage à ce que l’Achèvement de son Installation intervienne avant une limite définie par la date la plus tardive des deux dates suivantes :
- vingt-quatre (24) mois à compter de la Date de désignation.
- deux mois à compter de la fin des travaux de raccordement, sous réserve que le Producteur ait mis en oeuvre toutes les démarches dans le respect des exigences du gestionnaire de réseau pour que les travaux de raccordement soient réalisés dans les délais. Dans ce cas, l’attestation de conformité doit être transmise au Cocontractant dans un délai de 2 mois à compter de la fin des travaux de raccordement (date déclarée par le gestionnaire de réseau).
En cas de dépassement de ce délai la durée de contrat mentionnée au 7.1 est réduite de la durée de dépassement.
Des dérogations au délai d’Achèvement sont toutefois possibles dans le cas où des contentieux administratifs effectués à l’encontre de toute autorisation administrative nécessaire à la réalisation du projet ont pour effet de retarder l’achèvement de l’installation. Dans ce cas, un délai supplémentaire égal à la durée entre la date du recours initial et la date de la décision définitive attestée par la décision ayant autorité de la chose jugée est alors accordé dans le cadre de contentieux.
Ces retards sont réputés autorisés sous réserve de pouvoir les justifier auprès de l’acheteur obligé.
Des délais supplémentaires, laissés à l’appréciation du Préfet, peuvent être accordés en cas d’événement imprévisible à la Date de désignation et extérieur au Producteur, dûment justifié.
`,
          dateLimiteAchevementInitiale: formatDate(
            Number(moment(321).add(24, 'months').subtract(1, 'day'))
          ),
          dateLimiteAchevementActuelle: formatDate(dateLimiteAchevementActuelle),
          dateAchèvementDemandée: formatDate(new Date('2022-01-01').getTime()),
          dateNotification: formatDate(321),
        })
      })
    })
    describe(`Etant donné une demande précédente en date déjà acceptée dans Potentiel`, () => {
      beforeAll(async () => {
        // Create the tables and remove all data
        await resetDatabase()

        await Project.create(project)

        await File.create(makeFakeFile({ id: fileId, filename: 'filename' }))

        await User.create(makeFakeUser({ id: userId, fullName: 'John Doe' }))

        await ModificationRequest.create({
          id: modificationRequestId,
          projectId,
          userId,
          fileId,
          type: 'delai',
          requestedOn: 123,
          respondedOn: 321,
          respondedBy: userId2,
          status: 'envoyée',
          justification: 'justification',
          versionDate,
          dateAchèvementDemandée: new Date('2022-01-01').getTime(),
        })

        // Add a previous request that is accepted
        await ModificationRequest.create({
          id: new UniqueEntityID().toString(),
          projectId,
          userId,
          fileId,
          type: 'delai',
          requestedOn: 789,
          respondedOn: 897,
          respondedBy: userId2,
          status: 'acceptée',
          justification: 'justification',
          versionDate,
          dateAchèvementDemandée: new Date('2021-10-01').getTime(),
          acceptanceParams: {
            dateAchèvementAccordée: new Date('2021-01-01').getTime(),
          },
        })
      })

      it(`Alors les informations de cette demande précédente devraient être retournées dans le DTO`, async () => {
        const modificationRequestResult = await getModificationRequestDataForResponseTemplate(
          modificationRequestId.toString(),
          fakeAdminUser,
          dgecEmail
        )

        expect(modificationRequestResult.isOk()).toBe(true)
        if (modificationRequestResult.isErr()) return

        const modificationRequestDTO = modificationRequestResult.value

        expect(modificationRequestDTO).toMatchObject({
          demandePrecedente: 'yes',
          demandeEnDate: 'yes',
          dateDepotDemandePrecedente: formatDate(789),
          dateDemandePrecedenteDemandée: formatDate(new Date('2021-10-01').getTime()),
          dateReponseDemandePrecedente: formatDate(897),
          autreDelaiDemandePrecedenteAccorde: 'yes',
          dateDemandePrecedenteAccordée: formatDate(new Date('2021-01-01').getTime()),
        })
      })
    })
  })

  describe(`Cas d'une demande de recours`, () => {
    beforeAll(async () => {
      // Create the tables and remove all data
      await resetDatabase()

      await Project.create({
        ...project,
        isFinancementParticipatif: true,
        isInvestissementParticipatif: false,
        engagementFournitureDePuissanceAlaPointe: true,
        motifsElimination: 'Non instruit: blabla',
      })

      await File.create(makeFakeFile({ id: fileId, filename: 'filename' }))

      await User.create(makeFakeUser({ id: userId, fullName: 'John Doe' }))

      await ModificationRequest.create({
        id: modificationRequestId,
        projectId,
        userId,
        fileId,
        type: 'recours',
        requestedOn: 123,
        respondedOn: 321,
        respondedBy: userId2,
        status: 'envoyée',
        justification: 'justification',
        versionDate,
      })
    })

    it('Une liste spécifique de champs devrait être retournée', async () => {
      const modificationRequestResult = await getModificationRequestDataForResponseTemplate(
        modificationRequestId.toString(),
        fakeAdminUser,
        dgecEmail
      )

      expect(modificationRequestResult.isOk()).toBe(true)
      if (modificationRequestResult.isErr()) return

      const modificationRequestDTO = modificationRequestResult.value

      expect(modificationRequestDTO).toMatchObject({
        type: 'recours',
        isFinancementParticipatif: 'yes',
        isInvestissementParticipatif: '',
        isEngagementParticipatif: 'yes',
        evaluationCarbone: '345',
        engagementFournitureDePuissanceAlaPointe: 'yes',
        prixReference: '456',

        nonInstruit: 'yes',
        motifsElimination: 'Non instruit: blabla',

        // related to Fessenheim AO
        tarifOuPrimeRetenue: "le prix de référence T de l'électricité retenu",
        tarifOuPrimeRetenueAlt: 'ce prix de référence',
        paragraphePrixReference: '7',
        affichageParagrapheECS: 'yes',

        eolien: '',
        AOInnovation: '',

        soumisGF: 'yes',
        renvoiSoumisAuxGarantiesFinancieres: 'doit être au minimum de 42 mois',
        renvoiDemandeCompleteRaccordement: '6.1',
        renvoiRetraitDesignationGarantieFinancieres: '5.3 et 6.2',
        paragrapheDelaiDerogatoire: '6.4',
        paragrapheAttestationConformite: '6.6',
        paragrapheEngagementIPFPGPFC: '3.2.6',
        renvoiModification: '5.4',
        delaiRealisationTexte: 'vingt-quatre (24) mois',
      })
    })
  })

  describe(`Cas d'un changement d'actionnaire`, () => {
    beforeAll(async () => {
      // Create the tables and remove all data
      await resetDatabase()

      await Project.create(project)

      await File.create(makeFakeFile({ id: fileId, filename: 'filename' }))

      await User.create(makeFakeUser({ id: userId, fullName: 'John Doe' }))

      await ModificationRequest.create({
        id: modificationRequestId,
        projectId,
        userId,
        fileId,
        type: 'actionnaire',
        actionnaire: 'new actionnaire',
        requestedOn: 123,
        respondedOn: 321,
        respondedBy: userId2,
        status: 'envoyée',
        justification: 'justification',
        versionDate,
      })
    })

    it('Une liste spécifique de champs devrait être retournée', async () => {
      const modificationRequestResult = await getModificationRequestDataForResponseTemplate(
        modificationRequestId.toString(),
        fakeAdminUser,
        dgecEmail
      )

      expect(modificationRequestResult.isOk()).toBe(true)
      if (modificationRequestResult.isErr()) return

      const modificationRequestDTO = modificationRequestResult.value

      expect(modificationRequestDTO).toMatchObject({
        type: 'actionnaire',
        nouvelActionnaire: 'new actionnaire',
        // les deux données ci-dessous sont issues de l'appel d'offre Fessenheim stocké en mémoire
        referenceParagrapheActionnaire: '5.4.2',
        contenuParagrapheActionnaire: `Les modifications de la structure du capital du Candidat avant constitution des garanties financières prévues au 6.2 ne sont pas autorisées. 
Les modifications de la structure du capital du Candidat après constitution des garanties financières prévues au 6.2 sont réputées autorisées. Elles doivent faire l’objet d’une information au Préfet dans un délai d’un (1) mois. A cette fin, le producteur transmet à la DREAL les copies des statuts de la société et le(s) justificatif(s) relatif à la composition de l’actionnariat. 
Si le candidat a joint à son offre la lettre d’engagement du 3.2.6, il est de sa responsabilité de s’assurer du respect de son engagement.`,
      })
    })
  })

  describe(`Cas d'une demande d'abandon`, () => {
    describe(`Etant donné une demande d'abandon acceptée sans confirmation préalable du porteurs`, () => {
      beforeAll(async () => {
        // Create the tables and remove all data
        await resetDatabase()

        await Project.create(project)
        await File.create(makeFakeFile({ id: fileId, filename: 'filename' }))
        await User.create(makeFakeUser({ id: userId, fullName: 'John Doe' }))

        await ModificationRequest.create({
          id: modificationRequestId,
          projectId,
          userId,
          fileId,
          type: 'abandon',
          requestedOn: 123,
          respondedOn: 321,
          respondedBy: userId2,
          status: 'envoyée',
          justification: 'justification',
          versionDate,
          delayInMonths: 2,
        })
      })

      it('Alors une liste spécifique de champs devrait être retournée', async () => {
        const modificationRequestResult = await getModificationRequestDataForResponseTemplate(
          modificationRequestId.toString(),
          fakeAdminUser,
          dgecEmail
        )

        expect(modificationRequestResult.isOk()).toBe(true)
        if (modificationRequestResult.isErr()) return

        const modificationRequestDTO = modificationRequestResult.value

        expect(modificationRequestDTO).toMatchObject({
          type: 'abandon',
          dateNotification: formatDate(321),
          // les deux données ci-dessous sont issues de l'appel d'offre Fessenheim stocké en mémoire
          referenceParagrapheAbandon: '6.3',
          contenuParagrapheAbandon: `Le Candidat dont l’offre a été retenue met en service l’Installation dans les conditions du présent cahier des charges, et réalise l’Installation conformément aux éléments du dossier de candidature (les possibilités et modalités de modification sont indiquées au 5.4). 
Par exception, le Candidat est délié de cette obligation : 
- en cas de retrait de l’autorisation d’urbanisme par l’autorité compétente ou d’annulation de cette autorisation à la suite d’un contentieux. Les retraits gracieux sur demande du candidat ne sont pas concernés. 
-  en  cas  de  non  obtention  ou  de  retrait  de  toute  autre  autorisation  administrative  ou  dérogation nécessaire à la réalisation du projet. 
Il en informe dans ce cas le Préfet en joignant les pièces justificatives. La garantie financière est alors levée. 
Le Candidat peut également être délié de cette obligation selon appréciation du ministre chargé de l’énergie  suite  à  une  demande  dûment  justifiée.  Le  Ministre  peut  accompagner  son accord  de conditions. L’accord du Ministre et les conditions imposées le cas échéant, ne limitent pas la possibilité de recours de l’Etat aux sanctions du 8.2.`,
        })
      })
    })

    describe(`Etant donné une demande d'abandon acceptée après confirmation du porteur`, () => {
      beforeAll(async () => {
        // Create the tables and remove all data
        await resetDatabase()

        await Project.create(project)
        await File.create(makeFakeFile({ id: fileId, filename: 'filename' }))
        await User.create(makeFakeUser({ id: userId, fullName: 'John Doe' }))
        await ModificationRequest.create({
          id: modificationRequestId,
          projectId,
          userId,
          fileId,
          type: 'abandon',
          requestedOn: 123,
          respondedOn: 321,
          respondedBy: userId2,
          status: 'demande confirmée',
          justification: 'justification',
          confirmationRequestedOn: 6780000000,
          confirmedOn: 7890000000,
          versionDate,
          delayInMonths: 2,
        })
      })

      it(`Alors le DTO retourné devrait inclure la date de la demande de confirmation et la date de confirmation`, async () => {
        const modificationRequestResult = await getModificationRequestDataForResponseTemplate(
          modificationRequestId.toString(),
          fakeAdminUser,
          dgecEmail
        )

        expect(modificationRequestResult.isOk()).toBe(true)
        if (modificationRequestResult.isErr()) return

        const modificationRequestDTO = modificationRequestResult.value

        expect(modificationRequestDTO).toMatchObject({
          dateDemandeConfirmation: formatDate(6780000000),
          dateConfirmation: formatDate(7890000000),
        })
      })
    })
  })

  describe(`Cas d'un changement de producteur`, () => {
    beforeAll(async () => {
      // Create the tables and remove all data
      await resetDatabase()

      await Project.create(project)

      await File.create(makeFakeFile({ id: fileId, filename: 'filename' }))

      await User.create(makeFakeUser({ id: userId, fullName: 'John Doe' }))

      await ModificationRequest.create({
        id: modificationRequestId,
        projectId,
        userId,
        fileId,
        type: 'producteur',
        producteur: 'new producteur',
        requestedOn: 123,
        respondedOn: 321,
        respondedBy: userId2,
        status: 'envoyée',
        justification: 'justification',
        versionDate,
      })
    })

    it(`Alors une liste spécifique de champs devrait être retournée`, async () => {
      const modificationRequestResult = await getModificationRequestDataForResponseTemplate(
        modificationRequestId.toString(),
        fakeAdminUser,
        dgecEmail
      )

      expect(modificationRequestResult.isOk()).toBe(true)
      if (modificationRequestResult.isErr()) return

      const modificationRequestDTO = modificationRequestResult.value

      expect(modificationRequestDTO).toMatchObject({
        type: 'producteur',
        nouveauProducteur: 'new producteur',
        // les 4 données ci-dessous sont issues de l'appel d'offre Fessenheim stocké en mémoire

        referenceParagrapheIdentiteProducteur: '2.5',
        contenuParagrapheIdentiteProducteur: `Le Candidat doit être le Producteur de l’Installation de production. Il ne peut pas indiquer dans son offre qu’une autre société sera le Producteur de l’Installation de production au cas où le projet serait retenu.`,
        referenceParagrapheChangementProducteur: '5.4.1',
        contenuParagrapheChangementProducteur: `Les changements de Producteur avant constitution des garanties financières prévues au 6.2 ne sont pas autorisés. 
Les changements de Producteur après constitution des garanties financières prévues au 6.2 sont réputés autorisés.
Ils doivent faire l’objet d’une information au Préfet dans un délai d’un mois. A cette fin, le producteur transmet à la DREAL de la région concernée par le projet, les statuts de la nouvelle société ainsi que les nouvelles garanties financières prévues au 6.2.`,
      })
    })
  })

  describe(`Cas d'un projet sans "details"`, () => {
    beforeAll(async () => {
      // Create the tables and remove all data
      await resetDatabase()

      await Project.create({ ...project, details: undefined })
      await File.create(makeFakeFile({ id: fileId, filename: 'filename' }))
      await User.create(makeFakeUser({ id: userId, fullName: 'John Doe' }))

      await ModificationRequest.create({
        id: modificationRequestId,
        projectId,
        userId,
        fileId,
        type: 'abandon',
        requestedOn: 123,
        respondedOn: 321,
        respondedBy: userId2,
        status: 'envoyée',
        justification: 'justification',
        versionDate,
      })
    })

    it(`Alors un DTO devrait être retourné avec une adresse de candidat vide`, async () => {
      const modificationRequestResult = await getModificationRequestDataForResponseTemplate(
        modificationRequestId.toString(),
        fakeAdminUser,
        dgecEmail
      )

      expect(modificationRequestResult._unsafeUnwrap().adresseCandidat).toEqual('')
    })
  })

  describe(`Cas d'un projet dont les références de CDC sont dans la portée de la période`, () => {
    describe(`Etant un donné un appel d'offres dont le traitement des demandes de délai varie selon la période`, () => {
      const project = makeFakeProject({
        ...projectInfo,
        appelOffreId: 'CRE4 - Bâtiment',
        periodeId: '1',
        familleId: '1',
      })
      beforeAll(async () => {
        // Create the tables and remove all data
        await resetDatabase()

        await Project.create(project)

        await File.create(makeFakeFile({ id: fileId, filename: 'filename' }))

        await User.create(makeFakeUser({ id: userId, fullName: 'John Doe', role: 'admin' }))

        await ModificationRequest.create({
          id: modificationRequestId,
          projectId,
          userId,
          fileId,
          type: 'delai',
          requestedOn: 123,
          respondedOn: 321,
          respondedBy: userId2,
          status: 'envoyée',
          justification: 'justification',
          authority: 'dreal',
          delayInMonths: 4,
          versionDate,
        })
      })
      it(`Alors les réferences de CDC propres à la période devraient être retournées dans le DTO`, async () => {
        const modificationRequestResult = await getModificationRequestDataForResponseTemplate(
          modificationRequestId.toString(),
          fakeAdminUser,
          dgecEmail
        )

        expect(modificationRequestResult.isOk()).toBe(true)
        if (modificationRequestResult.isErr()) return

        const modificationRequestDTO = modificationRequestResult.value
        expect(modificationRequestDTO).toMatchObject({
          referenceParagrapheAchevement: '6.4',
          contenuParagrapheAchevement: `Le Candidat dont l’offre a été retenue s’engage à ce que l’Achèvement de son Installation intervienne avant une limite définie par la date la plus tardive des deux dates suivantes :
    -  vingt (20) mois à compter de la Date de désignation.
    -  deux mois à compter de la fin des travaux de raccordement, sous réserve que le Producteur ait mis en œuvre toutes les démarches dans le respect des exigences du gestionnaire de réseau pour que les travaux de raccordement soient réalisés dans les délais. Dans ce cas, l’attestation de conformité doit être  transmise  au  Cocontractant  dans  un  délai  de  2  mois  à  compter  de  la  fin  des  travaux  de  raccordement (date déclarée par le gestionnaire de réseau).
    Pour les installations dont la mise en service a lieu entre le 1er septembre 2022 et le 31 décembre 2024 inclus, cette date limite est repoussée de dix-huit (18) mois supplémentaires.
    !!!!!OPTION : SI PERIODE 1 à 4!!!!!En  cas  de  dépassement  de  ce  délai,  la  durée  de  contrat  de  rémunération  mentionnée  au  6.4  est  amputée d’un raccourcissement R égal à   la durée T de dépassement: R= T.
    !!!!!OPTION : SI PERIODE 5 à 13!!!!!En cas de dépassement de ce délai, le prix de référence T0 proposé   au C. du formulaire de candidature est diminué́ de 0.25 €/MWh par mois de retard pendant les 6 premiers mois, puis de 0.50 €/MWh par mois de retard à partir du 7ème mois. 
    Des dérogations au délai d’Achèvement sont toutefois possibles dans le cas où des contentieux administratifs effectués à l’encontre de toute autorisation administrative nécessaire à la réalisation du projet ont pour effet de retarder l’achèvement de l’installation. Dans ce cas, un délai supplémentaire égal à la durée entre la date du recours initial et la date de la décision définitive attestée par la décision ayant autorité de la chose jugée est alors accordé dans le cadre de contentieux.
    Ces retards sont réputés autorisés sous réserve de pouvoir les justifier auprès de l’acheteur obligé. Des délais supplémentaires, laissés à l’appréciation du Préfet, peuvent être accordés en cas d’événement imprévisible à la Date de désignation et extérieur au Producteur, dûment justifié.
      `,
        })
      })
    })
  })

  describe(`Cas d'un projet dont les références de CDC sont dans la portée du CDC modifié`, () => {
    describe(`Etant un donné un appel d'offres dont le traitement des changements de puissance varie selon le CDC modifié`, () => {
      const project = makeFakeProject({
        ...projectInfo,
        appelOffreId: 'CRE4 - Sol',
        periodeId: '1',
        familleId: '1',
        cahierDesChargesActuel: '30/08/2022',
      })
      beforeAll(async () => {
        // Create the tables and remove all data
        await resetDatabase()

        await Project.create(project)

        await File.create(makeFakeFile({ id: fileId, filename: 'filename' }))

        await User.create(makeFakeUser({ id: userId, fullName: 'John Doe', role: 'admin' }))

        await ModificationRequest.create({
          id: modificationRequestId,
          projectId,
          userId,
          fileId,
          type: 'puissance',
          requestedOn: 123,
          respondedOn: 321,
          respondedBy: userId2,
          status: 'envoyée',
          justification: 'justification',
          authority: 'dreal',
          versionDate,
        })
      })
      it(`Alors les réferences de texte propres au CDC devraient être retournées dans le DTO`, async () => {
        const modificationRequestResult = await getModificationRequestDataForResponseTemplate(
          modificationRequestId.toString(),
          fakeAdminUser,
          dgecEmail
        )

        expect(modificationRequestResult.isOk()).toBe(true)
        if (modificationRequestResult.isErr()) return

        const modificationRequestDTO = modificationRequestResult.value

        expect(modificationRequestDTO).toMatchObject({
          referenceParagraphePuissance: '5.4.4',
          contenuParagraphePuissance: `Avant l'achèvement, les modifications de la Puissance installée sont autorisées, sous réserve que la Puissance de l’Installation modifiée soit comprise entre quatre-vingt-dix pourcents (90%) et cent dix pourcents (110%) de la Puissance formulée dans l’offre. Elles doivent faire l’objet d’une information au Préfet.
    Pour  les  projets  dont  soit  l'achèvement,  soit  la  mise  en  service  est  antérieur  au  31 décembre 2024, cette  augmentation  de  puissance  peut  être  portée  à  140%  de  la  Puissance  formulée  dans  l’offre,  à condition qu’elle soit permise par l’autorisation d’urbanisme de l’Installation ( y compris si celle-ci a été modifiée)  et que la Puissance modifiée soit :
    - Inférieure au plafond de puissance de la famille dans laquelle entre l’offre, le cas échéant ;
    - Inférieure à la limite de puissance de 17 MWc pour les périodes 1 à 3 ou de 30 MWc pour les périodes ultérieures, si celle-ci est applicable.
    Les modifications à la baisse, en-dessous de 90% de la Puissance formulée dans l'offre et imposées par une  décision  de  l’Etat  à  l’égard  de  toute  autorisation  administrative  nécessaire  à  la  réalisation  du  projet, sont autorisées. Elles doivent faire l’objet d’une information au Préfet.Des modifications à la baisse, en-dessous de 90% de la Puissance formulée dans l'offre et imposée par un  événement  extérieur  au  candidat,  peuvent  également  être  autorisées  par  le  Préfet  de  manière  exceptionnelle, sur demande dûment motivée.`,
        })
      })
    })
  })
})
