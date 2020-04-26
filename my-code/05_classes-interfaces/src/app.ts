class Department {
    name: string;
    private employees: string[] = [];

    constructor(n: string, private readonly size: number) {
        this.name = n;
    }

    describe(this: Department) {
        console.log(`Department: ${this.name}`);
    }

    addEmployee(employee: string) {
        this.employees.push(employee);
    }

    printEmployees() {
        console.log(this.employees.length);
        console.log(this.employees);
    }
}

class ITDepartment extends Department {
    constructor(size: number) {
        super('IT Dept', size);
    }
}

const dept = new Department('testing', 14);
dept.addEmployee('Mark');
dept.addEmployee('Mick');
// dept.printEmployees.push('dude');
dept.describe();
dept.printEmployees();

console.log(dept);

const deptCopy = { name: 'bob', describe: dept.describe };
// deptCopy.describe();