const request = require("supertest");
const { app } = require("../server");
const mockingoose = require("mockingoose");
const mongoose = require("mongoose");
const Article = require("../api/articles/articles.schema");
const jwt = require("jsonwebtoken");
const config = require("../config");
const User = require("../api/users/users.model");
const ObjectId = mongoose.Types.ObjectId;

describe("tester Méthodes Articles", () => {
  const USER_ID = new ObjectId();
  const USER_MOCK_DATA = {
    _id: USER_ID,
    name: "admintest",
    email: "adminbdtest@gmail.com",
    password: "123456789test",
    role: "admin",
  };
  const ARTICLE_MOCK_DATA = {
    title: "Fromage",
    content: "Le fromage est trop bon",
    user: USER_ID,
    status: "draft",
    _id: new ObjectId("65df85cd62ecddec5105a39c"),
  };

  const updatedArticle = {
    title: "J'aime le fromage",
    content: "Le fromage c'est super",
  };

  beforeAll(async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/myapp", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    token = jwt.sign({ userId: USER_ID }, config.secretJwtToken);
  });

  beforeEach(() => {
    mockingoose(User).toReturn(USER_MOCK_DATA, "findOne");
    mockingoose(Article).toReturn(ARTICLE_MOCK_DATA, "save");
    mockingoose(Article).toReturn(ARTICLE_MOCK_DATA, "findOne");
    mockingoose(Article).toReturn(updatedArticle, "findOneAndUpdate");
    mockingoose(Article).toReturn(ARTICLE_MOCK_DATA, "findOneAndDelete");
  });

  test("[Articles] Get All Articles", async () => {
    const res = await request(app).get(`/api/articles/${USER_ID}/articles`).set("x-access-token", token);
    expect(res.status).toBe(200);
  });

  test("[Articles] Create Article", async () => {
    const res = await request(app).post("/api/articles").send(ARTICLE_MOCK_DATA).set("x-access-token", token);
    expect(res.status).toBe(201);
    expect(res.body.title).toBe(ARTICLE_MOCK_DATA.title);
  });
  test("[Articles] Update Article", async () => {
    const res = await request(app).put(`/api/articles/${ARTICLE_MOCK_DATA._id}`).send(updatedArticle).set("x-access-token", token);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe(updatedArticle.title);
  });
  test("[Articles] Delete Article", async () => {
    const res = await request(app).delete(`/api/articles/${ARTICLE_MOCK_DATA._id}`).set("x-access-token", token);
    expect(res.status).toBe(204);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });
});
