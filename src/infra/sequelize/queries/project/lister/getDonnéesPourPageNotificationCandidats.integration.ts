import { beforeEach, describe, expect, it } from '@jest/globals';
import { resetDatabase } from '@infra/sequelize/helpers';
import makeFakeProject from '../../../../../__tests__/fixtures/project';
import { Project } from '@infra/sequelize/projectionsNext';
import { getDonnéesPourPageNotificationCandidats } from './getDonnéesPourPageNotificationCandidats';

describe(`listerProjetsÀNotifier`, () => {
  const pagination = {
    page: 0,
    pageSize: 10,
  };

  beforeEach(async () => {
    await resetDatabase();
  });

  describe(`Etant donné une base de projets contenant des projets à notifier sur plusieurs AOs :
    - AO Eolien
    - AO CRE4 - Bâtiment`, () => {
    const projetÀNotifierAOEolienPériode1 = makeFakeProject({
      appelOffreId: 'Eolien',
      periodeId: '1',
      notifiedOn: 0,
    });

    const projetNotifiéAOEolienPeriode1 = makeFakeProject({
      appelOffreId: 'Eolien',
      periodeId: '1',
      notifiedOn: new Date('2020-01-01').getTime(),
    });

    const projetÀNotifierAOEolienPériode2 = makeFakeProject({
      appelOffreId: 'Eolien',
      periodeId: '2',
      notifiedOn: 0,
    });

    const projetNotifiéAOEolienPeriode3 = makeFakeProject({
      appelOffreId: 'Eolien',
      periodeId: '3',
      notifiedOn: new Date('2020-01-01').getTime(),
    });

    const projetÀNotifierAOPVPériode1 = makeFakeProject({
      appelOffreId: 'CRE4 - Bâtiment',
      periodeId: '1',
      notifiedOn: 0,
    });

    const projetNotifiéAOHydroPeriode1 = makeFakeProject({
      appelOffreId: 'Hydro',
      periodeId: '1',
      notifiedOn: new Date('2020-01-01').getTime(),
    });

    beforeEach(async () => {
      await Project.bulkCreate([
        projetÀNotifierAOEolienPériode1,
        projetNotifiéAOEolienPeriode1,
        projetÀNotifierAOEolienPériode2,
        projetNotifiéAOEolienPeriode3,
        projetÀNotifierAOPVPériode1,
        projetNotifiéAOHydroPeriode1,
      ]);
    });
    it(`Lorsqu'un utilisateur affiche la page des "projets à notifier",
         sans avoir choisi d'appel d'offre ou de période, 
         alors devraient être retournés : 
          - la liste des AOs qui ont des projets non notifiés (sera affichée dans le filtres dans un menu déroulant), 
          - le premier AO de cette liste comme AO sélectionné par défaut à l'affichage de la page,
          - la liste des périodes de cet AO ayant des projets non notifiés (sera affichée dans le filtres dans un menu déroulant)
          - la première période de cette liste comme période sélectionnée par défaut à l'affichage de la page,
          - la liste paginée des projets de cette période`, async () => {
      const résultat = await getDonnéesPourPageNotificationCandidats({ pagination });
      expect(résultat).not.toBeNull();
      expect(résultat?.listeAOs).toEqual(['Eolien', 'CRE4 - Bâtiment']);
      expect(résultat?.AOSélectionné).toEqual('Eolien');
      expect(résultat?.listePériodes).toEqual(['1', '2']);
      expect(résultat?.périodeSélectionnée).toEqual('1');
      expect(résultat?.projetsPériodeSélectionnée.items).toHaveLength(1);
      expect(résultat?.projetsPériodeSélectionnée.items[0].id).toEqual(
        projetÀNotifierAOEolienPériode1.id,
      );
    });

    it(`Lorsqu'un utilisateur filtre les "projets à notifier" avec un AO,
         alors devraient être retournés : 
          - la liste des AOs qui ont des projets non notifiés (sera affichée dans le filtres dans un menu déroulant), 
          - l'appel d'offre choisi par l'utilisateur comme AO sélectionné,
          - la liste des périodes de cet AO ayant des projets non notifiés (sera affichée dans le filtres dans un menu déroulant)
          - la première période de cette liste comme période sélectionnée par défaut à l'affichage de la page,
          - la liste paginée des projets de cette période`, async () => {
      const résultat = await getDonnéesPourPageNotificationCandidats({
        pagination,
        appelOffreId: 'CRE4 - Bâtiment',
      });
      expect(résultat).not.toBeNull();
      expect(résultat?.listeAOs).toEqual(['Eolien', 'CRE4 - Bâtiment']);
      expect(résultat?.AOSélectionné).toEqual('CRE4 - Bâtiment');
      expect(résultat?.listePériodes).toEqual(['1']);
      expect(résultat?.périodeSélectionnée).toEqual('1');
      expect(résultat?.projetsPériodeSélectionnée.items).toHaveLength(1);
      expect(résultat?.projetsPériodeSélectionnée.items[0].id).toEqual(
        projetÀNotifierAOPVPériode1.id,
      );
    });

    it(`Lorsqu'un utilisateur filtre les "projets à notifier" avec un AO et une période,
         alors devraient être retournés :
          - la liste des AOs qui ont des projets non notifiés (sera affichée dans le filtres dans un menu déroulant),
          - l'appel d'offre choisi par l'utilisateur comme AO sélectionné,
          - la liste des périodes de cet AO ayant des projets non notifiés (sera affichée dans le filtres dans un menu déroulant)
          - la période choisie par l'utilisateur comme période sélectionnée,
          - la liste paginée des projets de cette période`, async () => {
      const résultat = await getDonnéesPourPageNotificationCandidats({
        pagination,
        appelOffreId: 'Eolien',
        periodeId: '2',
      });
      expect(résultat).not.toBeNull();
      expect(résultat?.listeAOs).toEqual(['Eolien', 'CRE4 - Bâtiment']);
      expect(résultat?.AOSélectionné).toEqual('Eolien');
      expect(résultat?.listePériodes).toEqual(['1', '2']);
      expect(résultat?.périodeSélectionnée).toEqual('2');
      expect(résultat?.projetsPériodeSélectionnée.items).toHaveLength(1);
      expect(résultat?.projetsPériodeSélectionnée.items[0].id).toEqual(
        projetÀNotifierAOEolienPériode2.id,
      );
    });
  });

  describe(`Etant donné une base ne contenant pas de projet à notifier`, () => {
    it(`Lorsqu'un utilisateur affiche la page des projets à notifier,
      alors le retour devrait être null`, async () => {
      await Project.create(makeFakeProject({ notifiedOn: new Date('2021-01-02').getTime() }));
      const résultat = await getDonnéesPourPageNotificationCandidats({ pagination });
      expect(résultat).toEqual(null);
    });
  });
});
