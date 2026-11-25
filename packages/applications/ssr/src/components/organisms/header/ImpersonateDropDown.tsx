'use client';

import { HeaderQuickAccessItem } from '@codegouvfr/react-dsfr/Header';
import Input from '@codegouvfr/react-dsfr/Input';
import { createModal } from '@codegouvfr/react-dsfr/Modal';
import SelectNext from '@codegouvfr/react-dsfr/SelectNext';
import Portal from '@mui/material/Portal';
import { useState } from 'react';

import type { PlainType } from '@potentiel-domain/core';

import { impersonateCookieOptions } from '@/auth/constants';
import type { PotentielUtilisateur } from '@/auth/utilisateur';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { createDropDownMenu, type DropDownMenuItem } from '@/components/molecules/DropDownMenu';

const impersonateUser = (email: string) => {
  // Forcer le domaine
  const localPart = email.split('@')[0];
  const domain = '@test.test';
  window.cookieStore.set({ ...impersonateCookieOptions, value: localPart + domain });
  window.location.reload();
};
const clearImpersonatedUser = () => {
  window.cookieStore.delete(impersonateCookieOptions);
  window.location.reload();
};

const utilisateursPrédéfinis = [
  'ademe@test.test',
  'admin@test.test',
  'ao@test.test',
  'autre-porteur@test.test',
  'caissedesdepots@test.test',
  'cocontractant@test.test',
  'cocontractant+mayotte@test.test',
  'cocontractant+zni@test.test',
  'cre@test.test',
  'dgec-validateur@test.test',
  'dgec@test.test',
  'dreal-aura@test.test',
  'dreal-naq@test.test',
  'dreal-occ@test.test',
  'dreal@test.test',
  'grd@test.test',
  'porteur@test.test',
];

const modal = createModal({
  id: 'impersonate-modal',
  isOpenedByDefault: false,
});
const dropdownMenu = createDropDownMenu({
  id: 'impersonate-dropdown',
});

export const ImpersonateDropDown = ({
  utilisateur,
}: {
  utilisateur: PlainType<PotentielUtilisateur>;
}) => {
  const [emailSélectionné, setEmailSélectionné] = useState('');

  const menuItems: (DropDownMenuItem & { condition?: boolean })[] = [
    {
      iconId: 'ri-user-line',
      label: 'Accéder à mon compte',
      onClick: () => {
        if (utilisateur.accountUrl) {
          window.location.href = utilisateur.accountUrl;
        }
      },
      condition: !!utilisateur.accountUrl && !utilisateur.isImpersonated,
    },
    {
      iconId: 'fr-icon-more-line',
      label: "Changer d'utilisateur de test",
      onClick: modal.open,
    },
    {
      iconId: 'fr-icon-arrow-left-right-line',
      label: 'Se connecter en DREAL',
      onClick: () => impersonateUser('dreal@test.test'),
      condition: utilisateur.identifiantUtilisateur.email !== 'dreal@test.test',
    },
    {
      iconId: 'fr-icon-arrow-left-right-line',
      label: 'Se connecter en DGEC',
      onClick: () => impersonateUser('dgec@test.test'),
      condition: utilisateur.identifiantUtilisateur.email !== 'dgec@test.test',
    },
    {
      iconId: 'fr-icon-arrow-left-right-line',
      label: 'Se connecter en Porteur',
      onClick: () => impersonateUser('porteur@test.test'),
      condition: utilisateur.identifiantUtilisateur.email !== 'porteur@test.test',
    },
    {
      iconId: 'fr-icon-close-line',
      label: `Arrêter l'impersonation`,
      onClick: clearImpersonatedUser,
      condition: !!utilisateur.isImpersonated,
    },
  ];

  return (
    <>
      <dropdownMenu.Component
        items={menuItems.filter((item) => item.condition === undefined || item.condition)}
      >
        <HeaderQuickAccessItem
          quickAccessItem={{
            buttonProps: dropdownMenu.getButtonProps(),
            iconId: utilisateur.isImpersonated ? 'fr-icon-user-heart-fill' : 'ri-user-line',
            text: <span className="short-label">{utilisateur.identifiantUtilisateur.email}</span>,
          }}
        />
      </dropdownMenu.Component>

      <Portal>
        <modal.Component title="Changer d'utilisateur">
          <form
            onSubmit={(ev) => {
              ev.preventDefault();
              const formData = new FormData(ev.target);
              const email = formData.get('impersonateEmail') as string;
              impersonateUser(email);
            }}
          >
            <SelectNext
              label="Compte de test"
              nativeSelectProps={{
                name: 'selectedEmail',
                onChange: (event) => setEmailSélectionné(event.currentTarget.value),
                required: true,
                value: emailSélectionné,
              }}
              options={[
                ...utilisateursPrédéfinis.map((email) => ({ value: email, label: email })),
                { value: 'custom', label: 'Autre email...' },
              ]}
            />
            {emailSélectionné === 'custom' ? (
              <Input
                label="Email"
                nativeInputProps={{
                  autoComplete: 'email',
                  name: 'impersonateEmail',
                  required: true,
                  placeholder: 'troisieme-porteur',
                }}
                hintText="Seul le domaine @test.test peut être utilisé, ajouté automatiquement"
              />
            ) : (
              <input type="hidden" value={emailSélectionné} name="impersonateEmail" />
            )}
            <SubmitButton>Se connecter</SubmitButton>
          </form>
        </modal.Component>
      </Portal>
    </>
  );
};
