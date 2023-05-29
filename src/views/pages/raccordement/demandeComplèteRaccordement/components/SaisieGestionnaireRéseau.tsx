import { Input, Label } from '@components';
import { GestionnaireRéseauReadModel } from '@potentiel/domain';
import React from 'react';
import { GestionnaireRéseauSelect } from '../../components/GestionnaireRéseauSelect';

type SaisieGestionnaireRéseauProps =
  | {
      gestionnaireRéseauActuel?: undefined;
      gestionnairesRéseau: ReadonlyArray<GestionnaireRéseauReadModel>;
      onGestionnaireRéseauSelected?: (aideSaisieRéférenceDossierRaccordement: {
        format: string;
        légende: string;
      }) => void;
    }
  | {
      gestionnaireRéseauActuel: GestionnaireRéseauReadModel;
    };

export const SaisieGestionnaireRéseau = (props: SaisieGestionnaireRéseauProps) => (
  <div>
    {props.gestionnaireRéseauActuel ? (
      <>
        <Label htmlFor="codeEIC">Gestionnaire de réseau</Label>
        <GestionnaireRéseauLectureSeule gestionnaireRéseau={props.gestionnaireRéseauActuel} />
      </>
    ) : (
      <GestionnaireRéseauSelect
        gestionnairesRéseau={props.gestionnairesRéseau}
        onGestionnaireRéseauSelected={props.onGestionnaireRéseauSelected}
      />
    )}
  </div>
);

const GestionnaireRéseauLectureSeule = ({
  gestionnaireRéseau: { codeEIC, raisonSociale },
}: {
  gestionnaireRéseau: GestionnaireRéseauReadModel;
}) => (
  <>
    <Input type="hidden" id="codeEIC" name="codeEIC" value={codeEIC} />
    <Input type="text" value={raisonSociale} disabled />
  </>
);
