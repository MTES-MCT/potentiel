import { Label, Input } from '../../../components';
import { formatDateForInput } from '../../../helpers';
import React from 'react';

export const RecoursForm = () => (
  <div className="form__group mt-4 mb-4">
    <Label htmlFor="newNotificationDate">Nouvelle date de désignation</Label>
    <Input
      type="date"
      name="newNotificationDate"
      id="newNotificationDate"
      defaultValue={formatDateForInput(new Date().toISOString())}
      required
      aria-required="true"
    />
  </div>
);
