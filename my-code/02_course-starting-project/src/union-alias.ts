type Combinable = number | string
type ConversionType = 'as-number' | 'as-text';
type User = { name: string; age: number };

function combine(
  input1: Combinable, 
  input2: number | string,
  conv: ConversionType,
  u1: User
): number | string {
  let result: number | string;
  
  if (typeof input1 === 'number' && typeof input2 === "number" ) {
    result = input1 + input2;
  } else {
    result = input1.toString() + input2.toString();
  }
  if (conv === "as-text") {

  }
  return result;
}

const combineAges = combine(30, 26, 'as-number', { name: 'bob', age: 33 });
console.log(combineAges);

const combineNames = combine('Max', 'Anna', 'as-text', { name: 'bob', age: 33 });
console.log(combineNames);