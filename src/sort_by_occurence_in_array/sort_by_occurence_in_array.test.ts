import {sortByOccurence, getOccurences, getMostOccuringValue} from "./index";

describe('by occurence in array', () => {

  const input = ["a", "b", "a", "c", "d",  "a", "b"];

  it('returns null if array is empty', () => {
    expect( sortByOccurence([])).toEqual(null);
    expect( getOccurences([])).toEqual(null);
    expect( getMostOccuringValue([])).toEqual(null);
  });

  it('sort an array of primitives by occurence', () => {
    expect( sortByOccurence(input)).toEqual(["a", "b", "c", "d"]);
  });

  it('get occurences details', () => {
    expect( getOccurences(input)).toEqual([
      { key: "a",  occur: 3},
      { key: "b",  occur: 2},
      { key: "c",  occur: 1},
      { key: "d",  occur: 1}
    ]);
  });

  it('get the greatest occurence only', () => {
    expect( getMostOccuringValue(input)).toEqual("a");
  });

});
