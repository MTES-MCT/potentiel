import React, { FC } from 'react';
import Input from '@codegouvfr/react-dsfr/Input';

import { Routes } from '@potentiel-libraries/routes';

import { Form } from '@/components/atoms/form/Form';
import {
  FormForProjetPageTemplate,
  FormForProjetPageTemplateProps,
} from '@/components/templates/FormForProjetPageTemplate';
import { InputFile } from '@/components/atoms/form/InputFile';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { formatDateForInput } from '@/utils/formatDateForInput';

import { TitrePageRaccordement } from '../../TitrePageRaccordement';
import { GestionnaireRéseauSelect } from '../modifierGestionnaireRéseauRaccordement/GestionnaireRéseauSelect';
import { modifierDemandeComplèteRaccordementAction } from './modifierDemandeComplèteRaccordement.action';
import Link from 'next/link';

export type ModifierDemandeComplèteRaccordementPageProps = {
  projet: FormForProjetPageTemplateProps['projet'];
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
  delaiDemandeDeRaccordementEnMois: InfoBoxFormulaireDCRProps['delaiDemandeDeRaccordementEnMois'];
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
    <FormForProjetPageTemplate
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
          <InfoBoxFormulaireDCR
            delaiDemandeDeRaccordementEnMois={delaiDemandeDeRaccordementEnMois}
          />
        ),
      }}
    />
  );
};

export type InfoBoxFormulaireDCRProps = {
  delaiDemandeDeRaccordementEnMois: { texte: string; valeur: number };
};

export const InfoBoxFormulaireDCR: FC<InfoBoxFormulaireDCRProps> = ({
  delaiDemandeDeRaccordementEnMois,
}) => (
  <div className="flex flex-col gap-6">
    <p>
      <span className="font-bold">* Où trouver la référence de mon dossier ?</span>
      <br />
      Vous pouvez retrouver cette donnée sur le courriel d'accusé de réception de votre demande
      complète de raccordement (
      <a href="https://docs.potentiel.beta.gouv.fr/faq/ou-trouver-la-reference-du-dossier-de-raccordement-de-mon-projet">
        voir un exemple d'accusé de réception
      </a>
      )
    </p>
    <p>
      <span className="font-bold">** Quel document transmettre dans Potentiel ?</span>
      <br />
      Vous devez déposer une demande de raccordement dans les{' '}
      {delaiDemandeDeRaccordementEnMois.texte} ({delaiDemandeDeRaccordementEnMois.valeur}) mois
      suivant la date de désignation du projet auprès de votre gestionnaire de réseau.
      <br />
      Votre gestionnaire de réseau vous retourne un{' '}
      <span className="italic">accusé de réception</span> lorsque votre demande de raccordement est
      jugée complète.
      <br />
      Cet accusé de réception transmis sur Potentiel facilitera vos démarches administratives avec
      les différents acteurs connectés à Potentiel (DGEC, DREAL, Cocontractant, etc.), il est
      nécessaire dans le cadre de l’instruction selon les cahiers des charges modificatifs et publié
      le 30/08/2022.
    </p>
  </div>
);
