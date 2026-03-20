import { createDossierAccessor, GetDossierQuery } from '../../graphql/index.js';

type MapApiResponseToFichiers = {
  champs: GetDossierQuery['dossier']['champs'];
};

export const mapApiResponseToFichiers = ({ champs }: MapApiResponseToFichiers) => {
  const accessor = createDossierAccessor(champs, {
    garantiesFinancières: '9.2 Garantie financière de mise en œuvre du projet',
  });

  return {
    garantiesFinancières: accessor.getUrlPièceJustificativeValue('garantiesFinancières'),
  };
};
