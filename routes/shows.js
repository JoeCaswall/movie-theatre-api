const express = require("express");
const { check, validationResult } = require("express-validator");
const { Show, User } = require("../models/index");

const showRouter = express.Router();

showRouter.use(express.json());
showRouter.use(express.urlencoded());

showRouter.get("/", async (req, res) => {
  const shows = await Show.findAll();
  res.json(shows);
});

showRouter.get("/:id", async (req, res) => {
  const show = await Show.findByPk(req.params.id);
  res.json(show);
});

showRouter.get("/:id/users", async (req, res) => {
  const showUsers = await Show.findOne({
    where: { id: req.params.id },
    include: User,
  });
  res.json(showUsers.users);
});

showRouter.get("/genres/:genre", async (req, res) => {
  const shows = await Show.findAll({ where: { genre: req.params.genre } });
  res.json(shows);
});

showRouter.patch("/:id/update", async (req, res) => {
  const show = await Show.findByPk(req.params.id);
  await show.update({ rating: req.body.rating });
  res.json(show);
});

showRouter.delete("/:id", async (req, res) => {
  await Show.destroy({ where: { id: req.params.id } });
});

module.exports = { showRouter };
