import { Label, Input } from '../../../components';
import { afficherDate } from '../../../helpers';
import React from 'react';

export const RecoursForm = () => (
  <div className="form__group mt-4 mb-4">
    <Label htmlFor="newNotificationDate">Nouvelle date de désignation (format JJ/MM/AAAA)</Label>
    <Input
      type="text"
      name="newNotificationDate"
      id="newNotificationDate"
      defaultValue={afficherDate(new Date())}
      style={{ width: 'auto' }}
    />
  </div>
);
