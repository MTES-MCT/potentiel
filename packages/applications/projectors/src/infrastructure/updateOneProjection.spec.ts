import { describe, test } from 'node:test';

import { expect } from 'chai';

import { Entity } from '@potentiel-domain/entity';

import { getUpdateClause } from './updateOneProjection';

type TestEntity = Entity<
  'test',
  {
    foo: string;
    bar: number;
    baz: boolean;
  }
>;

describe('updateOneProjection', () => {
  test(`single string key`, () => {
    const [query, values] = getUpdateClause<TestEntity>({ foo: 'hello' }, 1);
    expect(query).to.eq("update domain_views.projection set value=jsonb_set(value,'{foo}',$2)");
    expect(values).to.deep.eq(['"hello"']);
  });

  test(`single number key`, () => {
    const [query, values] = getUpdateClause<TestEntity>({ bar: 1 }, 1);
    expect(query).to.eq("update domain_views.projection set value=jsonb_set(value,'{bar}',$2)");
    expect(values).to.deep.eq([1]);
  });

  test(`single boolean key`, () => {
    const [query, values] = getUpdateClause<TestEntity>({ baz: true }, 1);
    expect(query).to.eq("update domain_views.projection set value=jsonb_set(value,'{baz}',$2)");
    expect(values).to.deep.eq([true]);
  });

  test(`multiple keys`, () => {
    const [query, values] = getUpdateClause<TestEntity>(
      {
        foo: '',
        bar: -1,
        baz: false,
      },
      1,
    );
    expect(query).to.eq(
      "update domain_views.projection set value=jsonb_set(jsonb_set(jsonb_set(value,'{foo}',$2),'{bar}',$3),'{baz}',$4)",
    );
    expect(values).to.deep.eq(['""', -1, false]);
  });
});
