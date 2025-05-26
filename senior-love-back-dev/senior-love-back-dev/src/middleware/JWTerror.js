export class jwtError extends Error {
    constructor(message) {
      super(message);
      this.name = "jwtError";
    }
  }