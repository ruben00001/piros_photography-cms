export function mapIds<TEntity extends { id: string }>(entities: TEntity[]) {
  return entities.map((entity) => entity.id);
}

/** return slice of arr including start and end indices */
export function sliceEntities<TArr extends { id: string }[]>(
  entities: TArr,
  start: number,
  end: number
) {
  return entities.filter((_entity, i) => i >= start && i <= end) as TArr;
}

export function getReorderedEntities<
  TEntity extends { id: string; index: number }
>({
  active,
  entities,
  over,
}: {
  entities: TEntity[];
  active: { id: string; index: number };
  over: { id: string; index: number };
}) {
  if (active.index > over.index) {
    const nonActiveEntitiesUpdated = sliceEntities(
      entities,
      over.index,
      active.index - 1
    ).map((entity) => ({ id: entity.id, index: entity.index + 1 }));

    const activeEntityUpdated = { id: active.id, index: over.index };

    return [activeEntityUpdated, ...nonActiveEntitiesUpdated];
  } else {
    const nonActiveEntitiesUpdated = sliceEntities(
      entities,
      active.index + 1,
      over.index
    ).map((entity) => ({ id: entity.id, index: entity.index - 1 }));

    const activeEntityUpdated = { id: active.id, index: over.index };

    return [...nonActiveEntitiesUpdated, activeEntityUpdated];
  }
}

export function sortByIndex<TEntity extends { index: number }>(
  a: TEntity,
  b: TEntity
) {
  return a.index - b.index;
}
