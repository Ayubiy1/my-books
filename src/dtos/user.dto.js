module.exports = class UserDto {
  constructor(model) {
    this.fullName = model.fullName;
    this.email = model.email;
    this.id = model._id;
    this.role = model.role;
  }

  static create(data) {
    if (Array.isArray(data)) {
      return data.map((user) => ({
        fullName: user.fullName,
        email: user.email,
        id: user._id,
        role: user.role,
      }));
    }

    return {
      fullName: data.fullName,
      email: data.email,
      id: data._id,
      role: data.role,
    };
  }
};

{
  // module.exports = class UserDto {
  //   static create(data) {
  //     const mapUser = (user) => ({
  //       email: user.email,
  //       id: user._id,
  //       role: user.role,
  //     });
  //     if (Array.isArray(data)) {
  //       return data.map(mapUser);
  //     }
  //     return mapUser(data);
  //   }
  // };
  // module.exports = class UserDto {
  //   email;
  //   id;
  //   role;
  //   constructor(model) {
  //     this.email = model.email;
  //     this.id = model._id;
  //     this.role = model.role;
  //   }
  //   toJSON() {
  //     return {
  //       email: this.email,
  //       id: this.id,
  //       role: this.role,
  //     };
  //   }
  //   static create(data) {
  //     if (Array.isArray(data)) {
  //       return data.map((user) => new UserDto(user));
  //     }
  //     return new UserDto(data);
  //   }
  // };
  // module.exports = class UserDto {
  //   email;
  //   id;
  //   role;
  //   constructor(model) {
  //     this.email = model.email;
  //     this.id = model._id;
  //     this.role = model.role;
  //   }
  // };
}
