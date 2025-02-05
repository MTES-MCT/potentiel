import { promisify } from 'util';

import { isTypeAliasDeclaration, TypeFlags } from 'typescript';
import { createProgram, Type, TypeChecker } from 'typescript';
import glob from 'glob';

import { flatten } from '@potentiel-libraries/flat';

const globAsync = promisify(glob);

function generateSqlViews(entityFiles: string[]) {
  const program = createProgram({
    rootNames: entityFiles,
    options: { noEmit: true },
  });
  const checker: TypeChecker = program.getTypeChecker();

  return entityFiles
    .map((fileName) => {
      const sourceFile = program.getSourceFile(fileName);
      if (!sourceFile) return [];
      const typeDefsInFile = sourceFile.forEachChild((node) => {
        if (isTypeAliasDeclaration(node)) {
          const type = checker.getTypeAtLocation(node);
          const entityPayloads = getEntityPayload(type);
          const { entityName, record } = entityPayloads.reduce(
            (prev, curr) => {
              const { record, entityName } = getTypeRecord(curr, checker);
              if (!prev.entityName) {
                prev.entityName = entityName;
              }
              prev.record = {
                ...prev.record,
                ...record,
              };

              return prev;
            },
            { record: {}, entityName: '' },
          );
          if (entityName) {
            return getViewDefinition(entityName, record);
          }
        }
      });

      return typeDefsInFile;
    })
    .flat();
}

// for Entity<'key',T>, returns T
// for Entity<'key',T&(U|V)> returns T&U&V
const getEntityPayload = (type: Type): Type[] => {
  if (type.aliasTypeArguments && type.aliasTypeArguments[0]) {
    return [type.aliasTypeArguments[0]];
  }
  if (type.isUnionOrIntersection()) {
    return type.types.map(getEntityPayload).flat();
  }
  return [];
};

// For a type Entity<key, {a:string, b:{c:number}}, returns a record {a: "text", b:{c:"numeric"}}
const getTypeRecord = (type: Type, checker: TypeChecker) => {
  const record: Record<string, unknown> = {};
  let entityName = '';

  for (const prop of type.getProperties()) {
    const propType = checker.getTypeOfSymbolAtLocation(prop, prop.valueDeclaration!);

    // ignore arrays as they cannot be simply represented in a relational table
    if (propType.symbol && ['Array', 'ReadonlyArray'].includes(propType.symbol.name)) {
      continue;
    }

    switch (propType.flags) {
      case TypeFlags.Object:
        record[prop.name] = getTypeRecord(propType, checker).record;
        break;

      // NB for TemplateLiteral matching a date, we could convert to timestamp
      case TypeFlags.TemplateLiteral:
      case TypeFlags.Union:
      case TypeFlags.String:
        record[prop.name] = 'text';
        break;
      case TypeFlags.Number:
        record[prop.name] = 'numeric';
        break;
      case TypeFlags.Boolean:
      case TypeFlags.BooleanLiteral:
        record[prop.name] = 'boolean';
        break;
      case TypeFlags.StringLiteral:
        // for the "type" of the entity, we want the actual value because it will be used as view name
        // for any other field, we will use sql "text"
        if (prop.name === 'type') {
          // get the entity type, without quotes
          entityName = checker.typeToString(propType).slice(1, -1);
        } else {
          record[prop.name] = 'text';
        }
        break;
      default:
        if (checker.typeToString(propType) === 'boolean') {
          record[prop.name] = 'boolean';
          break;
        }
      // console.warn('Type not supported', {
      //   name: prop.name,
      //   type: TypeFlags[propType.flags],
      //   stringValue: checker.typeToString(propType),
      // });
    }
  }

  return { entityName, record };
};

// For a record {a: "text", b:{c:"numeric"}}, returns the view named `_entityName_` with columns `"a" text, "b.c" numeric`
const getViewDefinition = (entityName: string, record: Record<string, string>) => {
  const fields = flatten<Record<string, unknown>, Record<string, string>>(record);
  return `
CREATE OR REPLACE VIEW stats."${entityName}" AS
select d.*
from domain_views.projection ac
    cross join lateral jsonb_to_record(ac.value) as d(
       ${Object.entries(fields)
         .map((f) => `"${f[0]}" ${f[1]}`)
         .join(',\n       ')}
    )
where ac.key like '${entityName}|%';
`;
};

async function main() {
  const entityFiles = await globAsync('./packages/domain/**/*.entity.ts');
  console.log(generateSqlViews(entityFiles).join('\n---\n'));
}

void main();
