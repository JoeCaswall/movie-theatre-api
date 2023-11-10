const express = require("express");
const { check, validationResult } = require("express-validator");
const { User, Show } = require("../models/index");

const userRouter = express.Router();
userRouter.use(express.json());
userRouter.use(express.urlencoded());

userRouter.get("/", async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

userRouter.get("/:id", async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

userRouter.get("/:id/shows", async (req, res, next) => {
  try {
    const usersShow = await User.findOne({
      where: { id: req.params.id },
      include: Show,
    });
    res.json(usersShow.shows);
  } catch (error) {
    next(error);
  }
});

userRouter.post("/", [check("username").isEmail()], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({ error: errors.array() });
    } else {
      const newUser = await User.create(req.body);
      res.json(newUser);
    }
  } catch (error) {
    next(error);
  }
});

userRouter.put("/:id/shows/:showId", async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.params.id },
      include: Show,
    });
    const show = await Show.findByPk(req.params.showId);
    await user.addShow(show);

    res.json(user.shows);
  } catch (error) {
    next(error);
  }
});

userRouter.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

module.exports = { userRouter };
