/* eslint-disable react/jsx-props-no-spreading */
'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import Input from '@codegouvfr/react-dsfr/Input';
import React, { useState } from 'react';

import { Routes } from '@potentiel-applications/routes';

import { Heading3 } from '@/components/atoms/headings';

import { Form } from '../../../atoms/form/Form';
import { SubmitButton } from '../../../atoms/form/SubmitButton';

import { modifierLauréatAction } from './modifierLauréat.action';
import { ModifierLauréatPageProps } from './ModifierLauréat.page';

const FormRow = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-row items-center gap-4 mt-4">{children}</div>
);

type FieldProps<T> = { candidature: T; lauréat: T; aÉtéModifié?: boolean };

const ActionnaireField = ({ candidature, lauréat, aÉtéModifié }: FieldProps<string>) => {
  const [linked, setLinked] = useState(candidature === lauréat);
  const [candidatureValue, setCandidatureValue] = useState(candidature);
  const [lauréatValue, setLauréatValue] = useState(lauréat);

  return (
    <div className="flex flex-row items-center gap-4 w-full">
      <div className="flex-1 font-semibold">Actionnaire(s)</div>
      <div className="flex-1 flex mb-5">
        <input
          name="societeMere"
          type="hidden"
          value={candidatureValue}
          disabled={candidatureValue === candidature}
        />
        <Input
          label="Actionnaire"
          nativeInputProps={{
            value: candidatureValue,
            onChange: (ev) => {
              setCandidatureValue(ev.target.value);
              if (linked) {
                setLauréatValue(ev.target.value);
              }
            },
          }}
        />
      </div>
      <div className="flex-1 flex flex-row gap-2 items-center">
        <input
          name="actionnaire"
          type="hidden"
          value={lauréatValue}
          disabled={lauréatValue === lauréat}
        />
        <Input
          disabled={aÉtéModifié || linked}
          label="Actionnaire"
          nativeInputProps={{
            value: lauréatValue,
            onChange: (ev) => {
              setLauréatValue(ev.target.value);
              if (linked) {
                setCandidatureValue(ev.target.value);
              }
            },
          }}
        />
        <Button
          type="button"
          iconId={linked ? 'fr-icon-lock-unlock-fill' : 'fr-icon-lock-fill'}
          title="Appliquer les changements au projet"
          size="small"
          className="mt-3"
          onClick={() => setLinked((l) => !l)}
          disabled={aÉtéModifié}
        />
      </div>
    </div>
  );
};

export type ModifierLauréatFormProps = ModifierLauréatPageProps;

// TODO: validation erreurs dans un second temps
export const ModifierLauréatForm: React.FC<ModifierLauréatFormProps> = ({
  candidature,
  lauréat,
  projet,
}) => {
  return (
    <Form
      action={modifierLauréatAction}
      heading="Modifier le lauréat"
      pendingModal={{
        id: 'form-modifier-lauréat',
        title: 'Modifier le lauréat',
        children: 'Modification du lauréat en cours...',
      }}
      actions={
        <>
          <Button
            priority="secondary"
            linkProps={{
              href: Routes.Projet.details(projet.identifiantProjet),
              prefetch: false,
            }}
            iconId="fr-icon-arrow-left-line"
          >
            Retour au projet
          </Button>
          <SubmitButton>Modifier</SubmitButton>
        </>
      }
    >
      <div className="flex flex-col gap-4 mt-4">
        <FormRow>
          <div className="flex-1">
            <Heading3>Champs à modifier</Heading3>
          </div>
          <div className="flex-1">
            <Heading3>Valeur à la candidature</Heading3>
          </div>
          <div className="flex-1">
            <Heading3>Valeur actuelle (lauréat)</Heading3>
          </div>
        </FormRow>
        <input type={'hidden'} value={projet.identifiantProjet} name="identifiantProjet" />
        <FormRow>
          <ActionnaireField
            candidature={candidature.societeMere}
            lauréat={lauréat.actionnaire.currentValue}
            aÉtéModifié={lauréat.actionnaire.AÉtéModifié}
          />
        </FormRow>
      </div>
    </Form>
  );
};
