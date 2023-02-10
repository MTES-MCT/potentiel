/*
données attendues au retour pour affichage sur la page : 
- liste des AOs qui ont des projets non notifiés => ListeAOsAvecProjetsÀNotifier
- AO sélectionné : celui de la requête ou le premier de la liste => AOAvecProjetsÀNotifierSéléctionné
- liste des périodes avec projets non notifiés de l'AO sélectioné => ListePériodesAvecProjetsÀNotifier
- Période sélectionnée : celle de la requête ou la première de la liste => PériodeAvecProjetsÀNotifierSéléctionnée
- Projets de la période sélectionnée PaginatedListe<Project>

- Filtres et recherche par nom projet à prendre en compte
 */

import { resetDatabase } from '@infra/sequelize/helpers'
import makeFakeProject from '../../../../../__tests__/fixtures/project'
import models from '../../../models'
import { newListerProjetsÀNotifier } from './newListerProjetsÀNotifier'

const ProjectModel = models.Project

describe(`listerProjetsÀNotifier`, () => {
  const pagination = {
    page: 0,
    pageSize: 10,
  }
  describe(`Etant donné une base de projets contenant des projets à notifier sur plusieurs AOs :
    - AO Eolien
    - AO PV`, () => {
    const projetÀNotifierAOEolienPériode1 = makeFakeProject({
      appelOffreId: 'Eolien',
      periodeId: '1',
      notifiedOn: 0,
    })

    const projetNotifiéAOEolienPeriode1 = makeFakeProject({
      appelOffreId: 'Eolien',
      periodeId: '1',
      notifiedOn: new Date('2020-01-01').getTime(),
    })

    const projetÀNotifierAOEolienPériode2 = makeFakeProject({
      appelOffreId: 'Eolien',
      periodeId: '2',
      notifiedOn: 0,
    })

    const projetNotifiéAOEolienPeriode3 = makeFakeProject({
      appelOffreId: 'Eolien',
      periodeId: '3',
      notifiedOn: new Date('2020-01-01').getTime(),
    })

    const projetÀNotifierAOPVPériode1 = makeFakeProject({
      appelOffreId: 'PV',
      periodeId: '1',
      notifiedOn: 0,
    })

    const projetNotifiéAOHydroPeriode1 = makeFakeProject({
      appelOffreId: 'Hydro',
      periodeId: '1',
      notifiedOn: new Date('2020-01-01').getTime(),
    })

    beforeEach(async () => {
      await resetDatabase()
      await ProjectModel.bulkCreate([
        projetÀNotifierAOEolienPériode1,
        projetNotifiéAOEolienPeriode1,
        projetÀNotifierAOEolienPériode2,
        projetNotifiéAOEolienPeriode3,
        projetÀNotifierAOPVPériode1,
        projetNotifiéAOHydroPeriode1,
      ])
    })
    describe(`Affichage de la page sans filtres sur un AO et période spécifiques`, () => {
      it(`Lorsqu'un utilisateur affiche la page des "projets à notifier",
         sans avoir choisi d'appel d'offre ou de période, 
         alors devraient être retournés : 
          - la liste des AOs qui ont des projets non notifiés (sera affichée dans le filtres dans un menu déroulant), 
          - le premier AO de cette liste comme AO sélectionné par défaut à l'affichage de la page,
          - la liste des périodes de cet AO ayant des projets non notifiés (sera affichée dans le filtres dans un menu déroulant)
          - la première période de cette liste comme période sélectionnée par défaut à l'affichage de la page,
          - la liste paginée des projets de cette période`, async () => {
        const résultat = await newListerProjetsÀNotifier({ pagination })
        expect(résultat.listeAOs).toEqual(['Eolien', 'PV'])
        expect(résultat.AOSélectionné).toEqual('Eolien')
        expect(résultat.listePériodes).toEqual(['1', '2'])
        expect(résultat.périodeSélectionnée).toEqual('1')
        expect(résultat.projetsPériodeSélectionnée.items).toHaveLength(1)
        expect(résultat.projetsPériodeSélectionnée.items[0].id).toEqual(
          projetÀNotifierAOEolienPériode1.id
        )
      })
    })
  })
})
