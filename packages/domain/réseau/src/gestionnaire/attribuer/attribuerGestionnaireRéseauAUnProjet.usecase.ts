import { Message, MessageHandler, mediator } from 'mediateur';
import { IdentifiantGestionnaireRéseau } from '..';
import { IdentifiantProjet } from '@potentiel-domain/common';

export type AttribuerGestionnaireRéseauAUnProjetUseCase = Message<
  'Réseau.Gestionnaire.UseCase.AttribuerGestionnaireRéseauAUnProjet',
  {
    identifiantGestionnaireRéseauValue: string;
    projet: {
      identifiantProjetValue: string;
      nomProjetValue: string;
      appelOffreValue: string;
      périodeValue: string;
      familleValue: string;
      numéroCREValue: string;
    };
    isValidatedByPorteurValue: boolean;
  }
>;

export const registerAttribuerGestionnaireRéseauAUnProjetUseCase = () => {
  const handler: MessageHandler<AttribuerGestionnaireRéseauAUnProjetUseCase> = async ({
    identifiantGestionnaireRéseauValue,
    projet,
    isValidatedByPorteurValue,
  }) => {
    const identifiantGestionnaireRéseau = IdentifiantGestionnaireRéseau.convertirEnValueType(
      identifiantGestionnaireRéseauValue,
    );
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(projet.identifiantProjetValue);
    const nomProjet = projet.nomProjetValue;
    const appelOffre = projet.appelOffreValue;
    const période = projet.périodeValue;
    const famille = projet.familleValue;
    const numéroCRE = projet.numéroCREValue;
    const isValidatedByPorteur = isValidatedByPorteurValue;

    // appeler la commande
  };

  mediator.register('Réseau.Gestionnaire.UseCase.AttribuerGestionnaireRéseau', handler);
};
