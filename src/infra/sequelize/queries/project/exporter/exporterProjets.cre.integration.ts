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
  garantiesFinancières,
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

describe(`Export des projets en tant qu'utilisateur "CRE"`, () => {
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
    ...garantiesFinancières,
  ].map((c) => (c.source === 'propriété-colonne-détail' ? c.nomPropriété : c.intitulé));

  it(`Étant donné des projets notifiés et non notifiés
        Lorsqu'un utilisateur CRE exporte tous les projets
        Alors tous les projets devrait être récupérés avec la liste des intitulés des colonnes exportées`, async () => {
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

    const exportProjets = await exporterProjets({ user: { id: 'user-id', role: 'cre' } as User });
    expect(exportProjets.isOk()).toBe(true);

    expect(exportProjets._unsafeUnwrap().colonnes).toEqual(colonnesÀExporter);

    expect(exportProjets._unsafeUnwrap().données).toHaveLength(3);
    expect(exportProjets._unsafeUnwrap().données).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          'Nom projet': 'Projet Eolien',
        }),
        expect.objectContaining({
          'Nom projet': 'Projet Non notifié Photovoltaïque',
        }),
        expect.objectContaining({
          'Nom projet': 'Autre',
        }),
      ]),
    );
  });
});
