const { users } = require("../../data/index.js");

const express = require("express");
const router = express.Router();

let userCounter = 3;

function findUserByID(req, res) {
    const userID = Number(req.params.id);
    const foundUser = users.find((user) => user.id === userID);

    if (!foundUser)
        return res
            .status(404)
            .json({ error: `A user with the provided ID does not exist` });
    return foundUser;
}

function emailMatch(user) {
    const foundEmail = users.find((email) => email.email === user.email);
    if (foundEmail) return true;
    return false;
}

router.get("/", (req, res) => {
    return res.status(200).json({ users: users });
});

router.post("/", (req, res) => {
    let newUser = req.body;

    if (!newUser.email) {
        return res
            .status(400)
            .json({ error: "Missing fields in request body" });
    }

    if (emailMatch(newUser)) {
        return res
            .status(409)
            .json({ error: "A user with the provided email already exists" });
    }

    newUser = { id: ++userCounter, ...newUser };
    users.push(newUser);

    return res.status(201).json({ user: newUser });
});

router.get("/:id", (req, res) => {
    const foundUser = findUserByID(req, res);

    return res.status(200).json({ user: foundUser });
});

router.delete("/:id", (req, res) => {
    const foundUser = findUserByID(req, res);
    const foundUserindex = users.indexOf(foundUser);

    users.splice(foundUserindex, 1);

    return res.status(200).json({ user: foundUser });
});

router.put("/:id", (req, res) => {
    const foundUser = findUserByID(req, res);
    const updateInfo = req.body;

    if (!updateInfo || !updateInfo.email) {
        return res
            .status(400)
            .json({ error: "Missing fields in request body" });
    }

    if (emailMatch(updateInfo)) {
        return res
            .status(409)
            .json({ error: "A user with the provided email already exists" });
    }

    foundUser.email = updateInfo.email;

    return res.status(200).json({ user: foundUser });
});

module.exports = router;
