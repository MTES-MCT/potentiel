import { UniqueEntityID } from '@core/domain';
import { ProjectReimported } from '@modules/project';
import { GarantiesFinancières } from '@infra/sequelize/projectionsNext';
import { onProjectReimported } from './onProjectReimported';

describe(`handler onProjectReimported pour la projection garantiesFinancières`, () => {
  describe(`Cas d'un projet passant du statut 'Classé' au statut 'Eliminé`, () => {
    it(`Etant donné un projet classé ayant des garanties financières en attente,
        lorsqu'un événement ProjectReimported est émis,
        et que les données du payload contiennent un nouveau statut 'Eliminé',
        alors la ligne GF devrait être supprimée de la projection garantiesFinancières`, async () => {
      const projetId = new UniqueEntityID().toString();
      const GFId = new UniqueEntityID().toString();
      await GarantiesFinancières.create({
        id: GFId,
        statut: 'en attente',
        soumisesALaCandidature: false,
        projetId,
      });
      const évènement = new ProjectReimported({
        payload: {
          projectId: projetId,
          periodeId: 'periode',
          appelOffreId: 'ao',
          importId: 'id',
          data: { classe: 'Eliminé' },
        },
      });
      await onProjectReimported(évènement);
      const GF = await GarantiesFinancières.findOne({ where: { projetId, id: GFId } });
      expect(GF).toBeNull();
    });
  });
});
