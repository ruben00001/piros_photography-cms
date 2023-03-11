import { getReorderedEntities, sliceEntities } from "~/helpers/process-data";

describe("sliceEntities", () => {
  it("returns slice of array from index 0 up to and including index 2", () => {
    expect(
      sliceEntities([{ id: "a" }, { id: "b" }, { id: "c" }, { id: "d" }], 0, 2)
    ).toEqual([{ id: "a" }, { id: "b" }, { id: "c" }]);
  });
});

describe("getReorderedEntities", () => {
  it("active entity with index 3, over index 1, to return correct array", () => {
    expect(
      getReorderedEntities({
        active: { id: "d", index: 3 },
        over: { id: "b", index: 1 },
        entities: [
          { id: "a", index: 0 },
          { id: "b", index: 1 },
          { id: "c", index: 2 },
          { id: "d", index: 3 },
        ],
      })
    ).toEqual([
      { id: "d", index: 1 },
      { id: "b", index: 2 },
      { id: "c", index: 3 },
    ]);
  });
  it("active entity with index 1, over index 3, to return correct array", () => {
    expect(
      getReorderedEntities({
        active: { id: "b", index: 1 },
        over: { id: "d", index: 3 },
        entities: [
          { id: "a", index: 0 },
          { id: "b", index: 1 },
          { id: "c", index: 2 },
          { id: "d", index: 3 },
        ],
      })
    ).toEqual([
      { id: "c", index: 1 },
      { id: "d", index: 2 },
      { id: "b", index: 3 },
    ]);
  });
});
