import Fuse from "fuse.js";

export function fuzzySearch<TEntity extends { id: string }>({
  entities,
  keys,
  pattern,
}: {
  entities: TEntity[];
  keys: string[];
  pattern: string;
}) {
  if (!pattern.length) {
    return entities;
  }

  const fuse = new Fuse(entities, {
    includeScore: true,
    keys: keys,
    minMatchCharLength: pattern.length < 2 ? 1 : pattern.length < 6 ? 2 : 4,
  });

  const searchResult = fuse.search(pattern);

  return searchResult.map((item) => item.item);
}

export function findEntityById<TEntity extends { id: string }>(
  entities: TEntity[],
  findById: string,
) {
  const match = entities.find((entity) => entity.id === findById);
  return match;
}

/** returns items of arr1 not in arr2 */
export function arrayDivergence<TItem extends { id: string }>(
  items1: TItem[],
  items2: TItem[],
) {
  const ids1 = items1.map((item) => item.id);
  const ids2 = items2.map((item) => item.id);

  const ids1NotInIds2 = ids1.filter((id1) => !ids2.includes(id1));

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return ids1NotInIds2.map((id1) => items1.find((item1) => item1.id === id1)!);
}

export function arrOfObjsIncludesValue<
  TItem extends { [key: string]: TItemKey },
  TItemKey extends string,
>(items: TItem[], key: string, value: string) {
  return Boolean(items.find((item) => item[key] === value));
}
