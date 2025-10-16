import { FC, useState } from 'react';
import Input from '@codegouvfr/react-dsfr/Input';
import Select from '@codegouvfr/react-dsfr/SelectNext';
import Button from '@codegouvfr/react-dsfr/Button';

import { Lauréat } from '@potentiel-domain/projet';

import { ValidationErrors } from '@/utils/formAction';
import { PaysPicker } from '@/components/molecules/CountryPicker';

import { typeFournisseurLabel } from '../../typeFournisseurLabel';

import { MettreÀJourFournisseurFormProps } from './MettreÀJourFournisseur.form';

type FournisseursFieldProps = Pick<
  MettreÀJourFournisseurFormProps,
  'fournisseurs' | 'technologie'
> & {
  validationErrors: ValidationErrors;
  resetValidationErrors: () => void;
};

export const FournisseursField: FC<FournisseursFieldProps> = ({
  fournisseurs: fournisseursActuels,
  technologie,
  validationErrors,
  resetValidationErrors,
}) => {
  const [fournisseurs, setFournisseurs] = useState<Array<Lauréat.Fournisseur.Fournisseur.RawType>>(
    () =>
      fournisseursActuels.map((fournisseur) =>
        Lauréat.Fournisseur.Fournisseur.bind(fournisseur).formatter(),
      ),
  );
  const typesFournisseur: ReadonlyArray<Lauréat.Fournisseur.TypeFournisseur.RawType> =
    technologie === 'eolien'
      ? Lauréat.Fournisseur.TypeFournisseur.typesFournisseurEolien
      : technologie === 'pv'
        ? Lauréat.Fournisseur.TypeFournisseur.typesFournisseurPV
        : [];

  return (
    <>
      <label className="mb-1 fr-label">Fournisseurs</label>
      <div className="flex flex-col gap-2 ">
        {fournisseurs.map(({ typeFournisseur, nomDuFabricant, lieuDeFabrication }, index) => {
          const typeFournisseurFieldKey = `fournisseurs.${index}.typeFournisseur`;
          const nomDuFabricantFieldKey = `fournisseurs.${index}.nomDuFabricant`;
          const lieuDeFabricationFieldKey = `fournisseurs.${index}.lieuDeFabrication`;
          return (
            <div className="flex flex-row  gap-2" key={`${typeFournisseur}-${nomDuFabricant}`}>
              <Select
                state={validationErrors[typeFournisseurFieldKey] ? 'error' : 'default'}
                stateRelatedMessage={validationErrors[typeFournisseurFieldKey]}
                options={typesFournisseur
                  .map((typeFournisseur) => ({
                    label: typeFournisseurLabel[typeFournisseur],
                    value: typeFournisseur,
                  }))
                  .concat(
                    typesFournisseur.includes(typeFournisseur)
                      ? []
                      : [
                          {
                            label: `${typeFournisseurLabel[typeFournisseur]} (non disponible)`,
                            value: typeFournisseur,
                          },
                        ],
                  )}
                label=""
                className="flex-1"
                nativeSelectProps={{
                  name: typeFournisseurFieldKey,
                  defaultValue: typeFournisseur,
                  required: true,
                }}
              />
              <Input
                label=""
                state={validationErrors[nomDuFabricantFieldKey] ? 'error' : 'default'}
                stateRelatedMessage={validationErrors[nomDuFabricantFieldKey]}
                className="flex-1"
                nativeInputProps={{
                  placeholder: 'Nom du fabricant',
                  defaultValue: nomDuFabricant,
                  name: nomDuFabricantFieldKey,
                  required: true,
                }}
              />
              <PaysPicker
                label=""
                defaultValue={lieuDeFabrication}
                nativeInputProps={{
                  name: lieuDeFabricationFieldKey,
                  placeholder: 'Pays de fabrication',
                  required: true,
                }}
                className="flex-1"
              />
              <Button
                className="mt-1"
                type="button"
                size="small"
                priority="tertiary no outline"
                iconId="fr-icon-delete-bin-line"
                title="Supprimer le fournisseur"
                onClick={() => {
                  setFournisseurs((fournisseurs) => fournisseurs.filter((_, i) => index !== i));
                  resetValidationErrors();
                }}
              />
            </div>
          );
        })}
        <Button
          iconId="fr-icon-add-circle-line"
          title="Ajouter un fournisseur"
          size="small"
          type="button"
          onClick={() => {
            setFournisseurs((fournisseurs) =>
              fournisseurs.concat({
                nomDuFabricant: '',
                typeFournisseur: typesFournisseur[0],
                lieuDeFabrication: '',
              }),
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
