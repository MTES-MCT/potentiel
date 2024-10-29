import { describe, test } from 'node:test';

import { expect } from 'chai';

import { Entity } from '@potentiel-domain/entity';

import { getUpdateProjectionQuery } from './updateManyProjections';

type TestEntity = Entity<
  'test',
  {
    id: string;
    foo: string;
    bar: string;
  }
>;

describe('updateManyProjections', () => {
  test('single key', () => {
    const [query, values] = getUpdateProjectionQuery<TestEntity>(
      'test',
      { id: { operator: 'equal', value: 'abcd' } },
      { foo: 'hello' },
    );
    expect(query).to.eq(
      "update domain_views.projection set value=jsonb_set(value,'{foo}',$3) where key like $1 and value->>'id' = $2",
    );
    expect(values).to.deep.eq(['test|%', 'abcd', '"hello"']);
  });

  test('multiple keys', () => {
    const [query, values] = getUpdateProjectionQuery<TestEntity>(
      'test',
      { id: { operator: 'equal', value: 'abcd' } },
      { foo: 'hello', bar: 'world' },
    );
    expect(query).to.eq(
      "update domain_views.projection set value=jsonb_set(jsonb_set(value,'{foo}',$3),'{bar}',$4) where key like $1 and value->>'id' = $2",
    );
    expect(values).to.deep.eq(['test|%', 'abcd', '"hello"', '"world"']);
  });
});
