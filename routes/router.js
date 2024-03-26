const router = require("express").Router();
const userModel = include("models/web_user");
const petModel = include("models/pet");
const bcrypt = require("bcrypt");

router.get("/", async (req, res) => {
  console.log("page hit");
  try {
    const users = await userModel.findAll({
      attributes: ["web_user_id", "first_name", "last_name", "email"],
    });
    if (users === null) {
      res.render("error", { message: "Error connecting to MySql" });
      console.log("Error connecting to userModel");
    } else {
      console.log(users);
      res.render("index", { allUsers: users });
    }
  } catch (ex) {
    res.render("error", { message: "Error connecting to MySql" });
    console.log("Error connecting to MySQL");
    console.log(ex);
  }
});

router.get("/deleteUser", async (req, res) => {
  try {
    console.log("delete user");

    let userId = req.query.id;
    if (userId) {
      console.log("userId: " + userId);
      let deleteUser = await userModel.findByPk(userId);
      console.log("deleteUser: ");
      console.log(deleteUser);
      if (deleteUser) {
        await deleteUser.destroy();
      }
    }
    res.redirect("/");
  } catch (ex) {
    res.render("error", { message: "Error connecting to MySQL" });
    console.log("Error connecting to MySQL");
    console.log(ex);
  }
});

router.post("/addUser", async (req, res) => {
  try {
    console.log("form submit");
    const password_hash = await bcrypt.hash(req.body.password, 12);
    let newUser = userModel.build({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password_hash: password_hash,
    });
    await newUser.save();
    res.redirect("/");
  } catch (ex) {
    res.render("error", {
      message: "Error connecting to MySQL",
    });
    console.log("Error connecting to MySQL");
    console.log(ex);
  }
});

router.get("/pets", async (req, res) => {
  console.log("pets page hit");
  try {
    const pets = await petModel.findAll({
      attributes: ["name"],
    });
    if (pets === null) {
      res.render("error", { message: "Error connecting to MySql" });
      console.log("Error connecting to petModel");
    } else {
      console.log(pets);
      res.render("pets", { allPets: pets });
    }
  } catch (ex) {
    res.render("error", { message: "Error connecting to MySql" });
    console.log("Error connecting to MySQL");
    console.log(ex);
  }
});

router.get("/showPets", async (req, res) => {
  console.log("showPets page hit");
  try {
    let userId = req.query.id;
    const user = await userModel.findByPk(userId);
    if (user === null) {
      res.render("error", { message: "Error connecting to MySql" });
      console.log("Error connecting to userModel");
    } else {
      let pets = await user.getPets();
      console.log(pets);
      let owner = await pets[0].getOwner();
      console.log(owner);
      res.render("pets", { allPets: pets });
    }
  } catch (ex) {
    res.render("error", { message: "Error connecting to MySql" });
    console.log("Error connecting to MySQL");
    console.log(ex);
  }
});

module.exports = router;
