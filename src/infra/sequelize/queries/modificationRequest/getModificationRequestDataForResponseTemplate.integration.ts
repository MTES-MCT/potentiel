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

describe('Sequelize getModificationRequestDataForResponseTemplate', () => {
  const { Project, ModificationRequest, User, File, Periode, UserDreal } = models

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

  const periodeData = {
    appelOffreId,
    periodeId,
    data: {
      'Référence du paragraphe dédié au changement d’actionnariat':
        'referenceParagrapheActionnaire',
      'Dispositions liées au changement d’actionnariat': 'contenuParagrapheActionnaire',
      'Référence du paragraphe dédié à l’engagement de réalisation ou aux modalités d’abandon':
        'referenceParagrapheAbandon',
      'Dispositions liées à l’engagement de réalisation ou aux modalités d’abandon':
        'contenuParagrapheAbandon',
      "Référence du paragraphe dédié à l'identité du producteur":
        'referenceParagrapheIdentiteProducteur',
      'Dispositions liées à l’identité du producteur': 'contenuParagrapheIdentiteProducteur',
      'Référence du paragraphe dédié au changement de producteur':
        'referenceParagrapheChangementProducteur',
      'Dispositions liées au changement de producteur': 'contenuParagrapheChangementProducteur',
    },
  }

  describe('in general', () => {
    beforeAll(async () => {
      // Create the tables and remove all data
      await resetDatabase()

      await Project.create(project)

      await File.create(makeFakeFile({ id: fileId, filename: 'filename' }))

      await User.create(makeFakeUser({ id: userId, fullName: 'John Doe', role: 'admin' }))

      await Periode.create(periodeData)

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

    it('should return generic modification request info fields', async () => {
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

  describe('when user is dreal', () => {
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

      await Periode.create(periodeData)

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

    it('should return the user dreal', async () => {
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

  describe('Etant donné une demande de type délai faite en mois', () => {
    describe(`Lorsque la demande de délai est la première de ce type délai`, () => {
      beforeAll(async () => {
        // Create the tables and remove all data
        await resetDatabase()

        await Project.create(project)

        await File.create(makeFakeFile({ id: fileId, filename: 'filename' }))

        await User.create(makeFakeUser({ id: userId, fullName: 'John Doe' }))

        await Periode.create(periodeData)

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

      it(`getModificationRequestDateForResponseTemplate doit retourner une liste spécifique de données
        et notamment calculer la nouvelle date d'achèvement demandée à partir du délai en mois`, async () => {
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
- 24 mois à compter de la Date de désignation.
- deux mois à compter de la fin des travaux de raccordement, sous réserve que le Producteur puisse justifier qu’il a déposé sa demande de raccordement dans les deux (2) mois suivant la Date de désignation et mis en œuvre toutes les démarches dans le respect des exigences du gestionnaire de réseau pour que les travaux de raccordement soient réalisés dans les délais. Dans ce cas, l’attestation de conformité doit intervenir dans un délai de 2 mois à compter de la fin des travaux de raccordement matérialisée par la date d’envoi par le gestionnaire de réseau compétent de la facture de solde à acquitter par le producteur pour sa contribution au coût du raccordement.
En cas de dépassement de ce délai, la durée de contrat mentionnée au 7.1.1 est réduite de la durée de dépassement.`,
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

    describe(`Lorsqu'une  autre demande de type délai - en mois - a déjà été acceptée pour ce projet`, () => {
      beforeAll(async () => {
        // Create the tables and remove all data
        await resetDatabase()

        await Project.create(project)

        await File.create(makeFakeFile({ id: fileId, filename: 'filename' }))

        await User.create(makeFakeUser({ id: userId, fullName: 'John Doe' }))

        await Periode.create(periodeData)

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

      it(`On doit retourner les informations de la demande de délai précédente`, async () => {
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
          dureeDelaiDemandePrecedenteEnMois: '4',
          dateReponseDemandePrecedente: formatDate(897),
          autreDelaiDemandePrecedenteAccorde: 'yes', // asked for 4, given 3
          delaiDemandePrecedenteAccordeEnMois: '3',
        })
      })
    })

    describe(`Lorsqu'une autre demande de délai acceptée a été importée dans Potentiel`, () => {
      beforeAll(async () => {
        // Create the tables and remove all data
        await resetDatabase()

        await Project.create(project)

        await File.create(makeFakeFile({ id: fileId, filename: 'filename' }))

        await User.create(makeFakeUser({ id: userId, fullName: 'John Doe' }))

        await Periode.create(periodeData)

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

      it(`On doit retourner les informations de cette précédente demande de délai`, async () => {
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
  })

  describe(`Etant donnné une demande de type de délai avec une nouvelle date d'achèvement`, () => {
    describe(`Lorsqu'il s'agit de la première demande de délai pour ce projet`, () => {
      beforeAll(async () => {
        // Create the tables and remove all data
        await resetDatabase()

        await Project.create(project)

        await File.create(makeFakeFile({ id: fileId, filename: 'filename' }))

        await User.create(makeFakeUser({ id: userId, fullName: 'John Doe' }))

        await Periode.create(periodeData)

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

      it(`on doit retourner une liste spécifique de données`, async () => {
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
- 24 mois à compter de la Date de désignation.
- deux mois à compter de la fin des travaux de raccordement, sous réserve que le Producteur puisse justifier qu’il a déposé sa demande de raccordement dans les deux (2) mois suivant la Date de désignation et mis en œuvre toutes les démarches dans le respect des exigences du gestionnaire de réseau pour que les travaux de raccordement soient réalisés dans les délais. Dans ce cas, l’attestation de conformité doit intervenir dans un délai de 2 mois à compter de la fin des travaux de raccordement matérialisée par la date d’envoi par le gestionnaire de réseau compétent de la facture de solde à acquitter par le producteur pour sa contribution au coût du raccordement.
En cas de dépassement de ce délai, la durée de contrat mentionnée au 7.1.1 est réduite de la durée de dépassement.`,
          dateLimiteAchevementInitiale: formatDate(
            Number(moment(321).add(24, 'months').subtract(1, 'day'))
          ),
          dateLimiteAchevementActuelle: formatDate(dateLimiteAchevementActuelle),
          dateAchèvementDemandée: formatDate(new Date('2022-01-01').getTime()),
          dateNotification: formatDate(321),
        })
      })
    })
    describe(`Lorsqu'une  autre demande de type délai - en date - a déjà été acceptée pour ce projet`, () => {
      beforeAll(async () => {
        // Create the tables and remove all data
        await resetDatabase()

        await Project.create(project)

        await File.create(makeFakeFile({ id: fileId, filename: 'filename' }))

        await User.create(makeFakeUser({ id: userId, fullName: 'John Doe' }))

        await Periode.create(periodeData)

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

      it(`On doit retourner les informations de la demande de délai précédente`, async () => {
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
          dateDemandePrecedenteDemandée: formatDate(new Date('2021-10-01').getTime()),
          dateReponseDemandePrecedente: formatDate(897),
          autreDelaiDemandePrecedenteAccorde: 'yes',
          dateDemandePrecedenteAccordée: formatDate(new Date('2021-01-01').getTime()),
        })
      })
    })
  })

  describe('when type is recours', () => {
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

      await Periode.create(periodeData)

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

    it('should return recours specific modification request info fields', async () => {
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

  describe('when type is actionnaire', () => {
    beforeAll(async () => {
      // Create the tables and remove all data
      await resetDatabase()

      await Project.create(project)

      await File.create(makeFakeFile({ id: fileId, filename: 'filename' }))

      await User.create(makeFakeUser({ id: userId, fullName: 'John Doe' }))
      await Periode.create(periodeData)

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

    it('should return actionnaire specific modification request info fields', async () => {
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
        referenceParagrapheActionnaire: 'referenceParagrapheActionnaire',
        contenuParagrapheActionnaire: 'contenuParagrapheActionnaire',
      })
    })
  })

  describe('when type is abandon', () => {
    describe('when abandon is granted without confirmation', () => {
      beforeAll(async () => {
        // Create the tables and remove all data
        await resetDatabase()

        await Project.create(project)
        await File.create(makeFakeFile({ id: fileId, filename: 'filename' }))
        await User.create(makeFakeUser({ id: userId, fullName: 'John Doe' }))
        await Periode.create(periodeData)

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

      it('should return abandon specific modification request info fields', async () => {
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
          referenceParagrapheAbandon: 'referenceParagrapheAbandon',
          contenuParagrapheAbandon: 'contenuParagrapheAbandon',
        })
      })
    })

    describe('when abandon is granted after confirmation', () => {
      beforeAll(async () => {
        // Create the tables and remove all data
        await resetDatabase()

        await Project.create(project)
        await File.create(makeFakeFile({ id: fileId, filename: 'filename' }))
        await User.create(makeFakeUser({ id: userId, fullName: 'John Doe' }))
        await Periode.create(periodeData)
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

      it('should include dateDemandeConfirmation and dateConfirmation', async () => {
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

  describe('when type is producteur', () => {
    beforeAll(async () => {
      // Create the tables and remove all data
      await resetDatabase()

      await Project.create(project)

      await File.create(makeFakeFile({ id: fileId, filename: 'filename' }))

      await User.create(makeFakeUser({ id: userId, fullName: 'John Doe' }))
      await Periode.create(periodeData)

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

    it('should return producteur specific modification request info fields', async () => {
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
        referenceParagrapheIdentiteProducteur: 'referenceParagrapheIdentiteProducteur',
        contenuParagrapheIdentiteProducteur: 'contenuParagrapheIdentiteProducteur',
        referenceParagrapheChangementProducteur: 'referenceParagrapheChangementProducteur',
        contenuParagrapheChangementProducteur: 'contenuParagrapheChangementProducteur',
      })
    })
  })

  describe('when the project has no details', () => {
    beforeAll(async () => {
      // Create the tables and remove all data
      await resetDatabase()

      await Project.create({ ...project, details: undefined })
      await File.create(makeFakeFile({ id: fileId, filename: 'filename' }))
      await User.create(makeFakeUser({ id: userId, fullName: 'John Doe' }))
      await Periode.create(periodeData)

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

    it('should return an empty adresseCandidat', async () => {
      const modificationRequestResult = await getModificationRequestDataForResponseTemplate(
        modificationRequestId.toString(),
        fakeAdminUser,
        dgecEmail
      )

      expect(modificationRequestResult._unsafeUnwrap().adresseCandidat).toEqual('')
    })
  })
})
