const express = require("express");
const { check, validationResult } = require("express-validator");
const { User, Show } = require("../models/index");

const userRouter = express.Router();
userRouter.use(express.json());
userRouter.use(express.urlencoded());

userRouter.get("/", async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

userRouter.get("/:id", async (req, res) => {
  const user = await User.findByPk(req.params.id);
  res.json(user);
});

userRouter.get("/:id/shows", async (req, res) => {
  const usersShow = await User.findOne({
    where: { id: req.params.id },
    include: Show,
  });
  res.json(usersShow.shows);
});

userRouter.post("/", [check("username").isEmail()], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.json({ error: errors.array() });
  } else {
    const newUser = await User.create(req.body);
    res.json(newUser);
  }
});

userRouter.put("/:id/shows/:showId", async (req, res) => {
  const user = await User.findOne({
    where: { id: req.params.id },
    include: Show,
  });
  const show = await Show.findByPk(req.params.showId);
  await user.addShow(show);

  res.json(user.shows);
});

module.exports = { userRouter };
