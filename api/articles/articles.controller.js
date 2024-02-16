const articlesService = require("./articles.service");

class ArticlesController {
  async create(req, res, next) {
    try {
      const articleData = {
        ...req.body,
        user: req.user.id,
      };
      const article = await articlesService.create(articleData);
      req.io.emit("article:create", article);
      res.status(201).json(article);
    } catch (err) {
      console.error(err);
      next(err);
    }
  }
  async update(req, res, next) {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Seuls les admin peuvent modifier les articles" });
      }
      const id = req.params.id;
      const data = req.body;
      const articleModified = await articlesService.update(id, data);
      res.json(articleModified);
    } catch (err) {
      console.error(err);
      next(err);
    }
  }
  async getByUserId(req, res, next) {
    try {
      const userId = req.params.userId;
      const showArticle = await articlesService.getByUserId(userId);
      res.json(showArticle);
    } catch (err) {
      console.error(err);
      next(err);
    }
  }
  async delete(req, res, next) {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Seuls les admin peuvent effacer les articles" });
      }
      const id = req.params.id;
      await articlesService.delete(id);
      req.io.emit("article:delete", { id });
      res.status(204).send();
    } catch (err) {
      console.error(err);
      next(err);
    }
  }
}

module.exports = new ArticlesController();
