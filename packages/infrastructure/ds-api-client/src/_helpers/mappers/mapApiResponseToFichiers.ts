import { createDossierAccessor, GetDossierQuery } from '../../graphql';

type MapApiResponseToFichiers = {
  champs: GetDossierQuery['dossier']['champs'];
};

export const mapApiResponseToFichiers = ({ champs }: MapApiResponseToFichiers) => {
  const accessor = createDossierAccessor(champs, {
    garantiesFinancières: 'Garantie financière de mise en œuvre du projet',
  });
  return {
    garantiesFinancières: accessor.getUrlPièceJustificativeValue('garantiesFinancières'),
  };
};
