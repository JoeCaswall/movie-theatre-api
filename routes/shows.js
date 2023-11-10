const express = require("express");
const { check, validationResult } = require("express-validator");
const { Show, User } = require("../models/index");

const showRouter = express.Router();

showRouter.use(express.json());
showRouter.use(express.urlencoded());

showRouter.get("/", async (req, res, next) => {
  try {
    const shows = await Show.findAll();
    res.json(shows);
  } catch (error) {
    next(error);
  }
});

showRouter.get("/:id", async (req, res, next) => {
  try {
    const show = await Show.findByPk(req.params.id);
    res.json(show);
  } catch (error) {
    next(error);
  }
});

showRouter.get("/:id/users", async (req, res, next) => {
  try {
    const showUsers = await Show.findOne({
      where: { id: req.params.id },
      include: User,
    });
    res.json(showUsers.users);
  } catch (error) {
    next(error);
  }
});

showRouter.get("/genres/:genre", async (req, res, next) => {
  try {
    const shows = await Show.findAll({
      where: { genre: req.params.genre },
    });
    res.json(shows);
  } catch (error) {
    next(error);
  }
});

showRouter.post(
  "/",
  [check("title").isLength({ min: 2, max: 25 }).trim()],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.json({ error: errors.array() });
      } else {
        const newShow = await Show.create(req.body);
        newShow.genre = newShow.genre.toLowerCase().split(" ").join("-");
        res.json(newShow);
      }
    } catch (error) {
      next(error);
    }
  }
);

showRouter.patch(
  "/:id/submitrating",
  [check("rating").not().isEmpty().trim()],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.json({ error: errors.array() });
      } else {
        const show = await Show.findByPk(req.params.id);
        let currentRating = show.rating;
        //if it isn't rated yet, make starting rating = first users rating
        if (currentRating === null) {
          currentRating = req.body.rating;
        }
        await show.update({ rating: (currentRating + req.body.rating) / 2 });
        res.json(show);
      }
    } catch (error) {
      next(error);
    }
  }
);

showRouter.patch(
  "/:id/available",
  [check("available").not().isBoolean()], //availability should be a boolean
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.json({ error: errors.array() });
      } else {
        const show = await Show.findByPk(req.params.id);
        await show.update({ available: req.body.available });
        res.json(show);
      }
    } catch (error) {
      next(error);
    }
  }
);

showRouter.delete("/:id", async (req, res) => {
  try {
    await Show.destroy({ where: { id: req.params.id } });
    const allShows = await Show.findAll();
    res.json(allShows);
  } catch (error) {
    next(error);
  }
});

showRouter.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

module.exports = { showRouter };
