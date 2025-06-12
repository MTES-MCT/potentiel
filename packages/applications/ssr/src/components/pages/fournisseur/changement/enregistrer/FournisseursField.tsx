import { FC, useState } from 'react';
import Input from '@codegouvfr/react-dsfr/Input';
import Select from '@codegouvfr/react-dsfr/SelectNext';
import Button from '@codegouvfr/react-dsfr/Button';

import { typeFournisseurLabel } from '../typeFournisseurLabel';

import { EnregistrerChangementFournisseurFormProps } from './EnregistrerChangementFournisseur.form';

type FournisseursFieldProps = Pick<
  EnregistrerChangementFournisseurFormProps,
  'fournisseurs' | 'typesFournisseur'
>;

export const FournisseursField: FC<FournisseursFieldProps> = ({
  fournisseurs: fournisseursActuels,
  typesFournisseur,
}) => {
  const [fournisseurs, setFournisseurs] = useState<
    Array<{
      typeFournisseur: string;
      nomDuFabricant: string;
    }>
  >(() =>
    fournisseursActuels.map(({ nomDuFabricant, typeFournisseur: { typeFournisseur } }) => ({
      nomDuFabricant,
      typeFournisseur,
    })),
  );
  return (
    <>
      <label className="mb-1 fr-label">Fournisseurs</label>
      <div className="flex flex-col gap-2 ">
        {fournisseurs.map(({ typeFournisseur, nomDuFabricant }, index) => (
          <div className="flex flex-row  gap-2" key={`${typeFournisseur}-${nomDuFabricant}`}>
            <Select
              options={typesFournisseur.map((typeFournisseur) => ({
                label: typeFournisseurLabel[typeFournisseur],
                value: typeFournisseur,
              }))}
              label=""
              nativeSelectProps={{
                name: `fournisseurs.${index}.typeFournisseur`,
                defaultValue: typeFournisseur,
              }}
            />
            <Input
              label=""
              nativeInputProps={{
                placeholder: 'Nom du fabricant',
                defaultValue: nomDuFabricant,
                name: `fournisseurs.${index}.nomDuFabricant`,
              }}
            />
            <Button
              className="mt-1"
              type="button"
              size="small"
              priority="tertiary no outline"
              iconId="fr-icon-delete-bin-line"
              title="Supprimer le fournisseur"
              onClick={() =>
                setFournisseurs((fournisseurs) => fournisseurs.filter((_, i) => index !== i))
              }
            />
          </div>
        ))}
        <Button
          iconId="fr-icon-add-circle-line"
          title="Ajouter un fournisseur"
          size="small"
          type="button"
          onClick={() => {
            setFournisseurs((fournisseurs) =>
              fournisseurs.concat({ nomDuFabricant: '', typeFournisseur: typesFournisseur[0] }),
            );
            return false;
          }}
        >
          Ajouter
        </Button>
      </div>
    </>
  );
};
