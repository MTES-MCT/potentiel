import { describe, test } from 'node:test';

import { expect } from 'chai';

import { Entity } from '@potentiel-domain/entity';

import { prepareUpdateProjectionQuery } from './updateOneProjection';

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
    const [query, values] = prepareUpdateProjectionQuery<TestEntity>({ foo: 'hello' });
    expect(query).to.eq(
      "update domain_views.projection set value=jsonb_set(value,'{foo}',$2) where key = $1",
    );
    expect(values).to.deep.eq(['"hello"']);
  });

  test(`single number key`, () => {
    const [query, values] = prepareUpdateProjectionQuery<TestEntity>({ bar: 1 });
    expect(query).to.eq(
      "update domain_views.projection set value=jsonb_set(value,'{bar}',$2) where key = $1",
    );
    expect(values).to.deep.eq([1]);
  });

  test(`single boolean key`, () => {
    const [query, values] = prepareUpdateProjectionQuery<TestEntity>({ baz: true });
    expect(query).to.eq(
      "update domain_views.projection set value=jsonb_set(value,'{baz}',$2) where key = $1",
    );
    expect(values).to.deep.eq([true]);
  });

  test(`multiple keys`, () => {
    const [query, values] = prepareUpdateProjectionQuery<TestEntity>({
      foo: '',
      bar: -1,
      baz: false,
    });
    expect(query).to.eq(
      "update domain_views.projection set value=jsonb_set(jsonb_set(jsonb_set(value,'{foo}',$2),'{bar}',$3),'{baz}',$4) where key = $1",
    );
    expect(values).to.deep.eq(['""', -1, false]);
  });
});
