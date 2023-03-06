export function arrayDivergence<TItem extends { id: string }>(
  items1: TItem[],
  items2: TItem[]
) {
  const ids1 = items1.map((item) => item.id);
  const ids2 = items2.map((item) => item.id);

  const ids1NotInIds2 = ids1.filter((id1) => !ids2.includes(id1));

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return ids1NotInIds2.map((id1) => items1.find((item1) => item1.id === id1)!);
}

export function arrOfObjsIncludesValue<
  TItem extends { [key: string]: TItemKey },
  TItemKey extends string
>(items: TItem[], key: string, value: string) {
  return Boolean(items.find((item) => item[key] === value));
}
