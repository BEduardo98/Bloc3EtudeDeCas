const request = require("supertest");
const { app } = require("../server");
const jwt = require("jsonwebtoken");
const config = require("../config");
const mockingoose = require("mockingoose");
const mongoose = require("mongoose");
const User = require("../api/users/users.model");
const usersService = require("../api/users/users.service");

describe("tester API users", () => {
  let token;
  const USER_ID = "65ca1be1b37618eaab74be46";
  const MOCK_DATA_CREATED = {
    name: "test",
    email: "test@test.net",
    password: "azertyuiop",
  };
  const userSchema = {
    _id: "65ca1be1b37618eaab74be46",
    name: "eduardo",
    email: "eduardo@gmail.com",
    password: "123456789",
  };

  beforeEach(() => {
    token = jwt.sign({ userId: USER_ID }, config.secretJwtToken);
    // Configurer mockingoose pour retourner des données basées sur le schéma général
    mockingoose(User).toReturn(userSchema, "findOne");
    mockingoose(User).toReturn([userSchema], "find");
    mockingoose(User).toReturn(MOCK_DATA_CREATED, "save");
    mockingoose(User).toReturn(userSchema, "findOneAndUpdate");
    mockingoose(User).toReturn(userSchema, "findByIdAndDelete");
  });

  test("Doit trouver l'utilisateur par son ID", async () => {
    try {
      const user = await User.findById(USER_ID);
      if (!user) {
        console.log("Utilisateur non trouvé");
      }
      expect(user).toBeDefined();
    } catch (error) {
      console.error("Erreur lors de la recherche de l'utilisateur :", error);
    }
  });

  test("[Users] Get All", async () => {
    const res = await request(app).get("/api/users").set("x-access-token", token);
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("[Users] Create User", async () => {
    const res = await request(app).post("/api/users").send(MOCK_DATA_CREATED).set("x-access-token", token);
    expect(res.status).toBe(201);
    expect(res.body.name).toBe(MOCK_DATA_CREATED.name);
  });

  test("Est-ce userService.getAll", async () => {
    const spy = jest.spyOn(usersService, "getAll").mockImplementation(() => "test");
    await request(app).get("/api/users").set("x-access-token", token);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveReturnedWith("test");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });
});
