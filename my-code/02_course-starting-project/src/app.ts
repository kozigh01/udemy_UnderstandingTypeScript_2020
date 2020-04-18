function add(n1: number, n2: number ) {
    return n1.toString() + n2;
}

type AddFunc = (a: number, b: number) => string;

const add2: AddFunc = add;


function GenerateError(message: string, code: number): never {
    throw { message: message, errorCode: code };
}

const x = GenerateError('an error', 500);