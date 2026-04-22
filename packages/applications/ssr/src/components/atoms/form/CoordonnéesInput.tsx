'use client';
import Input, { InputProps } from '@codegouvfr/react-dsfr/Input';
import Select from '@codegouvfr/react-dsfr/SelectNext';
import InputLabel from '@mui/material/InputLabel';
import React, { useMemo } from 'react';
import { useState } from 'react';
import Tooltip from '@codegouvfr/react-dsfr/Tooltip';

import { Candidature } from '@potentiel-domain/projet';

import { Icon } from '../Icon';

export type CoordonnéesInputProps = InputProps & {
  latitude: number | undefined;
  longitude: number | undefined;
  state?: 'error' | 'default';
};

export const CoordonnéesInput = (props: CoordonnéesInputProps) => {
  const coordonnéesInitiales = useMemo(
    () =>
      props.latitude && props.longitude
        ? Candidature.Coordonnées.bind({
            latitude: props.latitude,
            longitude: props.longitude,
          })
        : undefined,
    [props],
  );

  const [latitude, setLatitude] = useState(coordonnéesInitiales?.toDMS()[0]);
  const [longitude, setLongitude] = useState(coordonnéesInitiales?.toDMS()[1]);

  const latitudeDecimal = useMemo(
    () => latitude && Candidature.Coordonnées.toDecimal(latitude),
    [latitude],
  );
  const longitudeDecimal = useMemo(
    () => longitude && Candidature.Coordonnées.toDecimal(longitude),
    [longitude],
  );

  const onChange =
    (
      setter: typeof setLatitude,
      name: keyof Exclude<typeof latitude, undefined>,
      convert: (val: string) => unknown = Number,
    ) =>
    (event: React.ChangeEvent<{ value: string }>) => {
      setter((latOrLong) => {
        return {
          degrees: 0,
          minutes: 0,
          seconds: 0,
          direction: 'N',
          ...latOrLong,
          [name]: convert(event.target.value),
        };
      });
    };

  const onPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData('text').trim().replaceAll(`′`, "'").replaceAll(`″`, '"');

    try {
      const coords = Candidature.Coordonnées.convertirEnValueType(text);
      const [lat, lon] = coords.toDMS();
      setLatitude(lat);
      setLongitude(lon);
      e.preventDefault();
      return;
    } catch (e) {
      console.log('Failed to parse pasted text as coordinates', e);
    }

    const decimalMatch = text.match(/^(-?\d+(?:[.,]\d+)?)\s*[,;]\s*(-?\d+(?:[.,]\d+)?)$/);
    if (decimalMatch) {
      const lat = parseFloat(decimalMatch[1].replace(',', '.'));
      const lon = parseFloat(decimalMatch[2].replace(',', '.'));
      try {
        const coords = Candidature.Coordonnées.bind({ latitude: lat, longitude: lon });
        const [latDMS, lonDMS] = coords.toDMS();
        setLatitude(latDMS);
        setLongitude(lonDMS);
        e.preventDefault();
      } catch {}
    }
  };

  return (
    <>
      <InputLabel>
        {props.label}
        <Tooltip
          title={`Vous pouvez coller des coordonnées au format décimal (ex: 48.8584, 2.2945) ou au format DMS (ex: 48°51'30"N 2°17'40"E) dans le premier champ`}
        >
          <Icon className="ml-2" size="sm" id="fr-icon-question-line" />
        </Tooltip>
      </InputLabel>
      <div className="flex flex-row gap-1">
        <Input
          state={props.state}
          stateRelatedMessage={props.stateRelatedMessage}
          label=""
          nativeInputProps={{
            value: latitude?.degrees,
            type: 'number',
            pattern: '[0-9]',
            min: 0,
            max: 90,
            onChange: onChange(setLatitude, 'degrees'),
            onPaste,
            'aria-label': `Degré d'angle de la latitude. Vous pouvez également coller des coordonnées au format décimal ou au format Degré Minute Seconde dans ce champ`,
          }}
          className="flex-1"
        />
        <span>°</span>
        <Input
          state={props.state}
          stateRelatedMessage={props.stateRelatedMessage}
          label=""
          nativeInputProps={{
            value: latitude?.minutes,
            type: 'number',
            pattern: '[0-9]',
            min: 0,
            max: 59,
            onChange: onChange(setLatitude, 'minutes'),
            'aria-label': "Minutes d'angle de la latitude",
          }}
          className="flex-1"
        />
        <span>'</span>
        <Input
          state={props.state}
          stateRelatedMessage={props.stateRelatedMessage}
          label=""
          nativeInputProps={{
            value: latitude?.seconds,
            type: 'number',
            pattern: '[0-9]+([.][0-9]+)?',
            inputMode: 'decimal',
            step: 'any',
            min: 0,
            max: 59.999,
            onChange: onChange(setLatitude, 'seconds'),
            'aria-label': "Secondes d'angle de la latitude",
          }}
          className="flex-1"
        />
        <span>"</span>
        <Select
          options={[
            { value: 'N', label: 'N' },
            { value: 'S', label: 'S' },
          ]}
          label=""
          nativeSelectProps={{
            value: latitude?.direction,
            onChange: onChange(setLatitude, 'direction', (str) => str),
            'aria-label': 'Direction de la latitude',
          }}
          className="flex-1"
          state={props.state}
          stateRelatedMessage={props.stateRelatedMessage}
        />
      </div>

      <div className="flex flex-row gap-1">
        <Input
          state={props.state}
          stateRelatedMessage={props.stateRelatedMessage}
          label=""
          nativeInputProps={{
            value: longitude?.degrees,
            type: 'number',
            pattern: '[0-9]',
            min: 0,
            max: 179,
            onChange: onChange(setLongitude, 'degrees'),
            'aria-label': "Degré d'angle de la longitude",
          }}
          className="flex-1"
        />
        <span>°</span>
        <Input
          state={props.state}
          stateRelatedMessage={props.stateRelatedMessage}
          label=""
          nativeInputProps={{
            value: longitude?.minutes,
            type: 'number',
            pattern: '[0-9]',
            min: 0,
            max: 59,
            onChange: onChange(setLongitude, 'minutes'),
            'aria-label': "Minutes d'angle de la longitude",
          }}
          className="flex-1"
        />
        <span>'</span>
        <Input
          state={props.state}
          stateRelatedMessage={props.stateRelatedMessage}
          label=""
          nativeInputProps={{
            value: longitude?.seconds,
            type: 'number',
            pattern: '[0-9]+([.][0-9]+)?',
            inputMode: 'decimal',
            step: 'any',
            min: 0,
            max: 59.999,
            onChange: onChange(setLongitude, 'seconds'),
            'aria-label': "Secondes d'angle de la longitude",
          }}
          className="flex-1"
        />
        <span>"</span>
        <Select
          options={[
            { value: 'E', label: 'E' },
            { value: 'O', label: 'O' },
          ]}
          label=""
          nativeSelectProps={{
            value: longitude?.direction,
            onChange: onChange(setLongitude, 'direction', (str) => str),
            'aria-label': 'Direction de la longitude',
          }}
          className="flex-1"
          state={props.state}
          stateRelatedMessage={props.stateRelatedMessage}
        />
      </div>

      <input
        name="coordonnées.latitude"
        disabled={latitudeDecimal === undefined}
        value={latitudeDecimal}
        type="hidden"
      />
      <input
        name="coordonnées.longitude"
        disabled={longitudeDecimal === undefined}
        value={longitudeDecimal}
        type="hidden"
      />
    </>
  );
};
