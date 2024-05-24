import { Message, MessageHandler, mediator } from 'mediateur';

export type AttribuerGestionnaireRéseauAUnProjetUseCase = Message<
  'Réseau.Gestionnaire.UseCase.AttribuerGestionnaireRéseauAUnProjet',
  {
    identifiantGestionnaireRéseauValue: string;
    projet: {
      identifiantProjetValue: string;
      appelOffreValue: string;
      périodeValue: string;
      familleValue: string;
      numéroCREValue: string;
    };
  }
>;

export const registerAttribuerGestionnaireRéseauAUnProjetUseCase = () => {
  const handler: MessageHandler<AttribuerGestionnaireRéseauAUnProjetUseCase> = async ({
    identifiantGestionnaireRéseauValue,
    projet,
  }) => {
    console.log('🤘🏻', identifiantGestionnaireRéseauValue, projet);
    // await mediator.send<GestionnaireRéseau.Attr>()
    // const commandParams = {
    //   identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.convertirEnValueType(
    //     identifiantGestionnaireRéseauValue,
    //   ),
    //   projet: {
    //     ...projet,
    //     identifiantProjet: IdentifiantProjet.convertirEnValueType(projet.identifiantProjetValue),
    //   },
    // };
    // appeler la commande
  };

  mediator.register('Réseau.Gestionnaire.UseCase.AttribuerGestionnaireRéseauAUnProjet', handler);
};
