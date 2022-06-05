const users = [
    { age: 32, name: 'A' },
    { age: 33, name: 'B' },
    { age: 16, name: 'C' },
    { age: 40, name: 'D' },
]

function checkAdult(user) {
  return user.age >= 18;
}

console.log(users.filter(checkAdult))