import React, { FC } from 'react';
import Input from '@codegouvfr/react-dsfr/Input';

import { Routes } from '@potentiel-libraries/routes';

import { Form } from '@/components/atoms/form/Form';
import { InputFile } from '@/components/atoms/form/InputFile';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { formatDateForInput } from '@/utils/formatDateForInput';

import { TitrePageRaccordement } from '../../TitrePageRaccordement';
import { GestionnaireRéseauSelect } from '../modifierGestionnaireRéseauRaccordement/GestionnaireRéseauSelect';
import { modifierDemandeComplèteRaccordementAction } from './modifierDemandeComplèteRaccordement.action';
import Link from 'next/link';
import {
  InformationDemandeComplèteRaccordement,
  InformationDemandeComplèteRaccordementProps,
} from '../../InformationDemandeComplèteRaccordement';
import { ProjetBannerProps } from '@/components/molecules/projet/ProjetBanner';

export type ModifierDemandeComplèteRaccordementPageProps = {
  projet: ProjetBannerProps;
  raccordement: {
    référence: string;
    demandeComplèteRaccordement: {
      dateQualification?: string;
      accuséRéception?: string;
    };
    canEditRéférence: boolean;
  };
  gestionnaireRéseauActuel: {
    identifiantGestionnaireRéseau: string;
    codeEIC: string;
    raisonSociale: string;
    aideSaisieRéférenceDossierRaccordement: {
      format: string;
      légende: string;
      expressionReguliere: string;
    };
  };
  delaiDemandeDeRaccordementEnMois: InformationDemandeComplèteRaccordementProps['delaiDemandeDeRaccordementEnMois'];
};

export const ModifierDemandeComplèteRaccordementPage: FC<
  ModifierDemandeComplèteRaccordementPageProps
> = ({
  projet,
  raccordement: {
    référence,
    canEditRéférence,
    demandeComplèteRaccordement: { accuséRéception, dateQualification },
  },
  gestionnaireRéseauActuel,
  delaiDemandeDeRaccordementEnMois,
}) => {
  const { identifiantProjet } = projet;
  const {
    aideSaisieRéférenceDossierRaccordement: { format, légende, expressionReguliere },
  } = gestionnaireRéseauActuel;

  return (
    <PageTemplate
      type="projet"
      heading={<TitrePageRaccordement />}
      projet={projet}
      form={
        <Form
          method="POST"
          encType="multipart/form-data"
          action={modifierDemandeComplèteRaccordementAction}
          heading="Modifier une demande complète de raccordement"
        >
          <GestionnaireRéseauSelect
            id="identifiantGestionnaireRéseau"
            name="identifiantGestionnaireRéseau"
            disabled
            identifiantGestionnaireRéseauActuel={
              gestionnaireRéseauActuel.identifiantGestionnaireRéseau
            }
            gestionnairesRéseau={[gestionnaireRéseauActuel]}
          />

          <Input
            id="referenceDossierRaccordement"
            label="Référence du dossier de raccordement du projet *"
            hintText={
              <>
                {légende && <div className="m-0">Format attendu : {légende}</div>}
                {format && <div className="m-0 italic">Exemple : {format}</div>}
              </>
            }
            nativeInputProps={{
              type: 'text',
              name: 'referenceDossierRaccordement',
              placeholder: format ? `Exemple: ${format}` : `Renseigner l'identifiant`,
              required: true,
              readOnly: canEditRéférence,
              defaultValue: référence ?? '',
              pattern: expressionReguliere || undefined,
            }}
          />

          <InputFile
            id="accuséRéception"
            name="accuséRéception"
            label="Accusé de réception de la demande complète de raccordement **"
            fileUrl={accuséRéception ? Routes.Document.télécharger(accuséRéception) : undefined}
          />

          <Input
            id="dateQualification"
            label="Date de l'accusé de réception"
            nativeInputProps={{
              type: 'date',
              name: 'dateQualification',
              defaultValue: dateQualification && formatDateForInput(dateQualification),
              max: new Date().toISOString().split('T').shift(),
              required: true,
            }}
          />

          <div className="flex flex-col md:flex-row gap-4 m-auto">
            <SubmitButton>Modifier</SubmitButton>
            <Link href={Routes.Raccordement.détail(identifiantProjet)} className="m-auto">
              Retour vers le dossier de raccordement
            </Link>
          </div>
        </Form>
      }
      information={{
        description: (
          <InformationDemandeComplèteRaccordement
            delaiDemandeDeRaccordementEnMois={delaiDemandeDeRaccordementEnMois}
          />
        ),
      }}
    />
  );
};
