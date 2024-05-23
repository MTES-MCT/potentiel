import { IdentifiantProjet } from '@potentiel-domain/common';
import { LoadAggregate } from '@potentiel-domain/core';
import { Message, MessageHandler, mediator } from 'mediateur';
import { loadGestionnaireRéseauFactory } from '../gestionnaireRéseau.aggregate';

import * as IdentifiantGestionnaireRéseau from '../identifiantGestionnaireRéseau.valueType';

export type AttribuerGestionnaireRéseauAUnProjetCommand = Message<
  'Réseau.Gestionnaire.Command.AttribuerGestionnaireRéseauAUnProjet',
  {
    identifiantGestionnaireRéseauValue: IdentifiantGestionnaireRéseau.ValueType;
    projet: {
      identifiantProjetValue: IdentifiantProjet.ValueType;
      nomProjetValue: string;
      appelOffreValue: string;
      périodeValue: string;
      familleValue: string;
      numéroCREValue: string;
    };
    isValidatedByPorteurValue: boolean;
  }
>;

export const registerAttribuerGestionnaireRéseauAUnProjetCommand = (
  loadAggregate: LoadAggregate,
) => {
  // TODO: faire un aggrégat dédié à ça
  // sans doute raccordement avec un raccordement avec dossier vide
  const load = loadGestionnaireRéseauFactory(loadAggregate);

  const handler: MessageHandler<AttribuerGestionnaireRéseauAUnProjetCommand> = async ({
    aideSaisieRéférenceDossierRaccordement,
    identifiantGestionnaireRéseau,
    raisonSociale,
    contactEmail,
  }) => {
    // récupérer le projet
    const gestionnaireRéseau = await load(identifiantGestionnaireRéseau, false);

    await gestionnaireRéseau.ajouter({
      aideSaisieRéférenceDossierRaccordement,
      identifiantGestionnaireRéseau,
      raisonSociale,
      contactEmail,
    });
  };

  mediator.register('Réseau.Gestionnaire.Command.AjouterGestionnaireRéseau', handler);
};
