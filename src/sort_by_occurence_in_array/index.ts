function sortBy(array, key) {
  let output = [...array];
  output.sort((a, b) => {
    a = a[key];
    b = b[key];
    if (a < b) return 1;
    if (a > b) return -1;
    return 0;
  });
  return output
}

function getOccurences(inputArray){

  if(inputArray.length === 0 ) return null;

  let a = inputArray.reduce((acc, curr) => {
    ( !(curr in acc)) && (acc[curr] = 0);
    acc[curr]++;
    return acc;
  }, {});

  return sortBy(
    Object.keys(a).map(  key => ({ key, occur: a[key]})),
    "occur"
  );

}

function sortByOccurence(inputArray){
  let occurences = getOccurences(inputArray);
  return occurences ? occurences.map( item => item.key ) : null;
}

function getMostOccuringValue(inputArray){
  let occurences = getOccurences(inputArray);
  return occurences ? getOccurences(inputArray)[0].key : null;
}

export {sortByOccurence, getOccurences, getMostOccuringValue};
