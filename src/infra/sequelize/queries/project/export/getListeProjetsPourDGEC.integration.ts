import { resetDatabase } from '@infra/sequelize/helpers'
import makeFakeProject from '../../../../../__tests__/fixtures/project'
import { getProjetsListePourDGEC } from './getListeProjetsPourDGEC'
import models from '../../../models'
import { UniqueEntityID } from '@core/domain'
import { GarantiesFinancières } from '../../../projectionsNext/garantiesFinancières/garantiesFinancières.model'
import { literal } from 'sequelize'
import { Colonne } from './donnéesProjetParCatégorie'

describe(`Requête getProjectsListeCsvPourDGEC`, () => {
  const { Project } = models

  beforeEach(async () => {
    await resetDatabase()
  })

  describe(`Données ayant une colonne dans la table Project`, () => {
    it(`Etant donné un utilisateur admin ayant la permission pour afficher les données suivantes
    pour tous les projets (2 projets):
    'numeroCRE', 'appelOffreId', 'periodeId',
    alors ces données devraient être retournées pour tous les projets
    avec l'intitulé de colonne associé`, async () => {
      const projet1 = makeFakeProject({
        appelOffreId: 'Innovation',
        periodeId: '1',
        numeroCRE: '200',
        familleId: '1',
      })

      const projet2 = makeFakeProject({
        appelOffreId: 'CRE4 - Bâtiment',
        periodeId: '1',
        numeroCRE: '201',
        familleId: '2',
      })

      await Project.bulkCreate([projet1, projet2])

      const listeColonnes = [
        { champ: 'numeroCRE', intitulé: 'N°CRE' },
        { champ: 'appelOffreId', intitulé: "Appel d'offres" },
        { champ: 'periodeId', intitulé: 'Période' },
      ]

      const résultat = await getProjetsListePourDGEC({ listeColonnes })

      expect(résultat._unsafeUnwrap()).toHaveLength(2)

      expect(résultat._unsafeUnwrap()).toEqual(
        expect.arrayContaining([
          { 'N°CRE': '200', "Appel d'offres": 'Innovation', Période: '1' },
          {
            'N°CRE': '201',
            "Appel d'offres": 'CRE4 - Bâtiment',
            Période: '1',
          },
        ])
      )
    })
  })

  describe(`Données accessibles dans la colonne "details" de la table Project`, () => {
    it(`Etant donné un utilisateur admin ayant la permission pour accéder à la donnée
    'Typologie de projet' imbriquée dans "details"
    de tous les projets,
    alors cette donnée devrait être retournée au même niveau que les autres données`, async () => {
      const projet = makeFakeProject({
        appelOffreId: 'Innovation',
        periodeId: '1',
        numeroCRE: '200',
        familleId: '1',
        details: { 'Typologie de projet': 'ombrière' },
      })

      await Project.create(projet)

      const listeColonnes: Array<Colonne> = [
        { champ: 'numeroCRE', intitulé: 'N°CRE' },
        { champ: 'Typologie de projet', details: true },
      ]

      const résultat = await getProjetsListePourDGEC({ listeColonnes })

      expect(résultat._unsafeUnwrap()).toEqual([
        {
          'Typologie de projet': 'ombrière',
          'N°CRE': '200',
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
      })

      const projet2 = makeFakeProject({
        appelOffreId: 'CRE4 - Bâtiment',
        periodeId: '1',
        numeroCRE: '201',
        familleId: '2',
      })

      await Project.bulkCreate([projet1, projet2])

      const listeColonnes = [
        { champ: 'numeroCRE', intitulé: 'N°CRE' },
        { champ: 'appelOffreId', intitulé: "Appel d'offres" },
        { champ: 'periodeId', intitulé: 'Période' },
      ]

      const filtres = { appelOffre: { appelOffreId: 'Innovation' } }

      const résultat = await getProjetsListePourDGEC({ listeColonnes, filtres })

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

      const résultat = await getProjetsListePourDGEC({ listeColonnes })

      expect(résultat._unsafeUnwrap()).toEqual([
        {
          'Date de soumission sur Potentiel des garanties financières': '01/01/2023',
          'Date déclarée par le porteur de dépôt des garanties financi': '01/12/2023',
        },
      ])
    })
  })
})
