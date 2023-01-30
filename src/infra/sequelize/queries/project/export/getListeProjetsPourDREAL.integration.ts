import { resetDatabase } from '@infra/sequelize/helpers'
import makeFakeProject from '../../../../../__tests__/fixtures/project'
import { getProjetsListePourDREAL } from './getListeProjetsPourDREAL'
import models from '../../../models'
import { UniqueEntityID } from '@core/domain'
import { GarantiesFinancières } from '../../../projectionsNext/garantiesFinancières/garantiesFinancières.model'
import { literal } from 'sequelize'
import { Colonne } from './donnéesProjetParCatégorie'
import { User } from '@entities'

describe(`Requête getListeProjetsPourDREAL`, () => {
  const { Project, UserDreal } = models

  const user = { id: new UniqueEntityID().toString(), role: 'dreal' } as User

  beforeEach(async () => {
    await resetDatabase()
    await UserDreal.create({ id: 1, dreal: 'Occitanie', userId: user.id })
  })

  describe(`Ne pas retourner les projets non-notifiés`, () => {
    it(`Etant donné un projet non notifié, 
      alors il ne devrait pas être retourné pour un utilisateur Dreal`, async () => {
      await Project.create(
        makeFakeProject({
          appelOffreId: 'Innovation',
          periodeId: '1',
          numeroCRE: '200',
          familleId: '1',
          notifiedOn: undefined,
          details: { 'Typologie de projet': 'ombrière' },
          regionProjet: 'Occitanie',
        })
      )

      const listeColonnes: Colonne[] = [{ champ: 'numeroCRE', intitulé: 'N°CRE' }]

      const résultat = await getProjetsListePourDREAL({ listeColonnes, user })

      expect(résultat._unsafeUnwrap()).toHaveLength(0)
    })
  })

  describe(`Ne pas retourner les projets d'une région autre que celle de la Dreal`, () => {
    it(`Etant donné un utilisateur Dreal de Mayotte,
        et deux projets, dont l'un de Mayotte et l'autre d'Occitanie,
        alors seul le projet de Mayotte devrait être retourné`, async () => {
      const drealMayotte = { id: new UniqueEntityID().toString(), role: 'dreal' } as User

      await UserDreal.create({
        id: 2,
        dreal: 'Mayotte',
        userId: drealMayotte.id,
      })

      await Project.bulkCreate([
        makeFakeProject({
          appelOffreId: 'Innovation',
          periodeId: '1',
          numeroCRE: '100',
          familleId: '1',
          notifiedOn: new Date().getTime(),
          details: { 'Typologie de projet': 'ombrière' },
          regionProjet: 'Occitanie',
        }),
        makeFakeProject({
          appelOffreId: 'Innovation',
          periodeId: '1',
          numeroCRE: '200',
          familleId: '1',
          notifiedOn: new Date().getTime(),
          details: { 'Typologie de projet': 'ombrière' },
          regionProjet: 'Mayotte',
        }),
      ])

      const listeColonnes: Colonne[] = [{ champ: 'numeroCRE', intitulé: 'N°CRE' }]

      const résultat = await getProjetsListePourDREAL({ listeColonnes, user: drealMayotte })

      expect(résultat._unsafeUnwrap()).toHaveLength(1)

      expect(résultat._unsafeUnwrap()).toEqual([
        {
          'N°CRE': '200',
        },
      ])
    })
  })

  describe(`Retourner seulement la liste des données auxquelles l'utilisateur a accès`, () => {
    it(`Etant donné un utilisateur dreal ayant la permission pour afficher les données suivantes
    pour tous les projets (2 projets):
    'numeroCRE', 'appelOffreId', 'periodeId',
    une donnée 'Typologie de projet' disponible dans la colonne 'details", 
    alors seules ces données devraient être retournées pour tous les projets
    avec l'intitulé de colonne associé`, async () => {
      const projet1 = makeFakeProject({
        appelOffreId: 'Innovation',
        periodeId: '1',
        numeroCRE: '200',
        familleId: '1',
        notifiedOn: new Date().getTime(),
        details: { 'Typologie de projet': 'ombrière' },
        regionProjet: 'Occitanie',
      })

      const projet2 = makeFakeProject({
        appelOffreId: 'CRE4 - Bâtiment',
        periodeId: '1',
        numeroCRE: '201',
        familleId: '2',
        notifiedOn: new Date().getTime(),
        details: { 'Typologie de projet': 'toiture' },
        regionProjet: 'Occitanie',
      })

      await Project.bulkCreate([projet1, projet2])

      const listeColonnes: Colonne[] = [
        { champ: 'numeroCRE', intitulé: 'N°CRE' },
        { champ: 'appelOffreId', intitulé: "Appel d'offres" },
        { champ: 'periodeId', intitulé: 'Période' },
        { champ: 'Typologie de projet', details: true },
      ]

      const résultat = await getProjetsListePourDREAL({ listeColonnes, user })

      expect(résultat._unsafeUnwrap()).toHaveLength(2)

      expect(résultat._unsafeUnwrap()).toEqual([
        {
          'N°CRE': '200',
          "Appel d'offres": 'Innovation',
          Période: '1',
          'Typologie de projet': 'ombrière',
        },
        {
          'N°CRE': '201',
          "Appel d'offres": 'CRE4 - Bâtiment',
          Période: '1',
          'Typologie de projet': 'toiture',
        },
      ])
    })
  })

  describe(`Requête avec filtres`, () => {
    it(`Etant donné une requête avec filtre sur l'appel d'offre Id,
    alors les seuls les projets correspondant à ce filtre devraient être retournés`, async () => {
      const projet1 = makeFakeProject({
        appelOffreId: 'Innovation',
        periodeId: '1',
        numeroCRE: '200',
        familleId: '1',
        notifiedOn: new Date().getTime(),
        regionProjet: 'Occitanie',
      })

      const projet2 = makeFakeProject({
        appelOffreId: 'CRE4 - Bâtiment',
        periodeId: '1',
        numeroCRE: '201',
        familleId: '2',
        notifiedOn: new Date().getTime(),
        regionProjet: 'Occitanie',
      })

      await Project.bulkCreate([projet1, projet2])

      const listeColonnes = [
        { champ: 'numeroCRE', intitulé: 'N°CRE' },
        { champ: 'appelOffreId', intitulé: "Appel d'offres" },
        { champ: 'periodeId', intitulé: 'Période' },
      ]

      const filtres = { appelOffre: { appelOffreId: 'Innovation' } }

      const résultat = await getProjetsListePourDREAL({ listeColonnes, filtres, user })

      expect(résultat._unsafeUnwrap()).toHaveLength(1)

      expect(résultat._unsafeUnwrap()).toEqual([
        { 'N°CRE': '200', "Appel d'offres": 'Innovation', Période: '1' },
      ])
    })
  })

  describe(`Affichage des données des garanties financières (GF)`, () => {
    it(`Etant donné un projet avec des GF envoyées,
    alors la date d'envoi de la date de constitution des GF devraient être retournées`, async () => {
      const projetId = new UniqueEntityID().toString()

      await Project.create(
        makeFakeProject({
          id: projetId,
          appelOffreId: 'CRE4 - Bâtiment',
          periodeId: '1',
          numeroCRE: '201',
          familleId: '2',
          notifiedOn: new Date().getTime(),
          regionProjet: 'Occitanie',
        })
      )

      const dateEnvoi = new Date('2023-01-01')
      const dateConstitution = new Date('2023-12-01')

      await GarantiesFinancières.create({
        id: new UniqueEntityID().toString(),
        projetId,
        statut: 'à traiter',
        soumisesALaCandidature: false,
        dateLimiteEnvoi: new Date(),
        fichierId: new UniqueEntityID().toString(),
        dateEnvoi,
        envoyéesPar: new UniqueEntityID().toString(),
        dateConstitution,
        dateEchéance: new Date(),
        validéesPar: null,
        validéesLe: null,
      })

      const listeColonnes = [
        {
          champ: literal(`TO_CHAR("garantiesFinancières"."dateEnvoi", 'DD/MM/YYYY')`),
          intitulé: `Date de soumission sur Potentiel des garanties financières`,
        },
        {
          champ: literal(`TO_CHAR("garantiesFinancières"."dateConstitution", 'DD/MM/YYYY')`),
          intitulé: `Date déclarée par le porteur de dépôt des garanties financières`,
        },
      ]

      const résultat = await getProjetsListePourDREAL({ listeColonnes, user })

      expect(résultat._unsafeUnwrap()).toEqual([
        {
          'Date de soumission sur Potentiel des garanties financières': '01/01/2023',
          'Date déclarée par le porteur de dépôt des garanties financi': '01/12/2023',
        },
      ])
    })
  })
})
