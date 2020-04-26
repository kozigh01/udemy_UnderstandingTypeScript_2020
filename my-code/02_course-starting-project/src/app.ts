function add(n1: number, n2: number ) {
    return n1.toString() + n2;
}

type AddFunc = (a: number, b: number) => string;

const add2: AddFunc = add;


function GenerateError(message: string, code: number): never {
    throw { message: message, errorCode: code };
}

const x = GenerateError('an error', 500);

function merge<T extends object, U extends object>(objA: T, objB: U) {
    return Object.assign(objA, objB);
}

const objC = merge({name:'mark'}, {age:25});
objC.age;

const objD = merge({name:'mark'}, 44);
objC.age;


function countAndDescribe<T extends {length: number}>(el: T): [T, string] {
    let desc = 'Got no value.';
    if (el.length ===1) {
        desc = 'Got 1 element.';
    } else if (el.length > 1) {
        desc = 'Got '+ el.length + ' elements.';
    }
    
    return [el, desc];
}

const x1 = countAndDescribe('12345');
x1[0].toLowerCase();

const x2 = countAndDescribe([0,1,2,3]);
x2[0].length;



function extractAndConvert<T extends object, U extends keyof T>(obj: T, key: U) {
    return 'Value: ' + obj[key];
}

const test2 = { x: 1, name2: 2 };

const test3: { x: number } = JSON.parse('{ x: 1, name: 2 }');

extractAndConvert(test3, 'name');


const objE: {[key: string]: number} = {};
objE['length'] = 11;
const x3 = extractAndConvert(objE, 'length2');

interface CourseGoal { title: string, description: string, completeUntil: Date};

function createCourseGoal(title: string, description: string, date: Date): CourseGoal {
    let rtn: Partial<CourseGoal> = {};

    return rtn as CourseGoal;
}

const names: Readonly<string[]> = ['Mark', 'Stacey'];
names.push('Nathan');

const test11:{ prop1: number } = {
    prop1:  444
};

test11.prop1 = 33;