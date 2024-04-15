import { beforeEach, describe, expect, it } from '@jest/globals';
import { Project } from '../../../projectionsNext';
import makeFakeProject from '../../../../../__tests__/fixtures/project';
import { exporterProjets } from './exporterProjets';
import { resetDatabase } from '../../../../../dataAccess';

import {
  contenuLocal,
  coordonnéesCandidat,
  coordonnéesGéodésiques,
  coûtInvestissement,
  donnéesAutoconsommation,
  donnéesDeRaccordement,
  donnéesFournisseurs,
  financementCitoyen,
  identificationProjet,
  implantation,
  instruction,
  localisationProjet,
  modificationsAvantImport,
  noteInnovation,
  noteInnovationSensible,
  notes,
  potentielSolaire,
  prix,
  référencesCandidature,
  résultatInstructionSensible,
  évaluationCarbone,
} from './colonnesParCatégorie';
import { User } from '../../../../../entities';

describe(`Export des projets en tant qu'utilisateur "ademe"`, () => {
  beforeEach(resetDatabase);

  const colonnesÀExporter = [
    ...identificationProjet,
    ...coordonnéesCandidat,
    ...financementCitoyen,
    ...contenuLocal,
    ...localisationProjet,
    ...coordonnéesGéodésiques,
    ...coûtInvestissement,
    ...donnéesAutoconsommation,
    ...donnéesDeRaccordement,
    ...donnéesFournisseurs,
    ...évaluationCarbone,
    ...potentielSolaire,
    ...implantation,
    ...prix,
    ...référencesCandidature,
    ...instruction,
    ...résultatInstructionSensible,
    ...noteInnovation,
    ...noteInnovationSensible,
    ...notes,
    ...modificationsAvantImport,
  ].map((c) => (c.source === 'propriété-colonne-détail' ? c.nomPropriété : c.intitulé));

  it(`
    Étant donné des projets notifiés et non notifiés
    Lorsqu'un utilisateur ayant le rôle ademe exporte tous les projets
    Alors seuls les projets notifiés devrait être récupérés avec la liste des intitulés des colonnes exportées`, async () => {
    await Project.bulkCreate([
      makeFakeProject({
        notifiedOn: new Date('2021-07-31').getTime(),
        nomProjet: 'Projet Eolien',
      }),
      makeFakeProject({
        notifiedOn: 0,
        nomProjet: 'Projet Non notifié Photovoltaïque',
      }),
      makeFakeProject({
        notifiedOn: new Date('2021-07-31').getTime(),
        nomProjet: 'Autre',
      }),
    ]);

    const exportProjets = (
      await exporterProjets({ user: { id: 'id-user', role: 'ademe' } as User })
    )._unsafeUnwrap();

    expect(exportProjets.colonnes).toEqual(colonnesÀExporter);

    expect(exportProjets.données).toHaveLength(2);
    expect(exportProjets.données).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          'Nom projet': 'Projet Eolien',
        }),
        expect.objectContaining({
          'Nom projet': 'Autre',
        }),
      ]),
    );
    expect(exportProjets.données).not.toContainEqual(
      expect.objectContaining({
        'Nom projet': 'Projet Non notifié Photovoltaïque',
      }),
    );
  });
});
