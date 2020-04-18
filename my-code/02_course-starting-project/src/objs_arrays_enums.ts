enum Role {
  ADMIN = 100,
  READ_ONLY,
  AUTHOR
}

const person: { name: string; age: number; hobbies: string[]; role: [number, string], role2: Role} = {
  name: 'Mark',
  age: 100,
  hobbies: ['sports', 'cooking'],
  role: [1, 'Author'],
  role2: Role.READ_ONLY
};

person.role[1] = '44';



console.log(typeof person.hobbies);