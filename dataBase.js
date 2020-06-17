module.exports = function () {
  let userId = 2;

  let users = [
    {
      id: 1,
      name: "Juan Carlos Batman",
      email: "juan.carlos@batman.com",
      address: "Bat St. 345, Gotham City",
      phoneNumber: 78963014,
    },
  ];
  return { userId: userId, users: users };
};
