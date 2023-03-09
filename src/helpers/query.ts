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
