let router = require("express").Router();
let jwt = require("jsonwebtoken");
let response = require("../helper/response");
let auth = require("../helper/auth");
let User = require("../model/user/user");
let secreteKey = "secreteKey";

const bcrypt = require("bcrypt");
let saltRounds = 10;
router.post("/register", async (req, res) => {
  try {
    const userData = await User.findOne({
      $or: [{ email: req.body.email }, { mobile: req.body.mobile }],
    });
    if (userData) {
      response.errorMsgResponse(res, 201, "User already registerd");
    } else {
      let data = req.body;
      bcrypt.genSalt(saltRounds, async function (err, salt) {
        bcrypt.hash(data.password, salt, async function (err, hash) {
          data["password"] = hash;
          var user = await new User(data).save();
          if (user) {
            response.successResponse(
              res,
              201,
              "User registerd successfully",
              user
            );
          } else {
            response.errorMsgResponse(res, 301, "Something went wrong");
          }
        });
      });
    }
  } catch (error) {
    console.log(error);
    response.errorMsgResponse(res, 301, "Something went wrong");
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, mobile, password } = req.body;
    let findUser = await User.findOne({
      $or: [{ email: email }, { mobile: mobile }],
    });

    if (!findUser) {
      response.errorMsgResponse(res, 400, "email or mobile number not found");
    } else {
      findUser = JSON.parse(JSON.stringify(findUser));
      let matchPasword = await bcrypt.compare(password, findUser.password);
      if (matchPasword) {
        let token = await jwt.sign(findUser, secreteKey, {
          expiresIn: "24h",
        });
        findUser["token"] = `Bearer ${token}`;
        response.successResponse(res, 200, "User login successfully", findUser);
      } else {
        response.errorMsgResponse(res, 400, "email or password is incorrect");
      }
    }
  } catch (error) {
    console.log(error);
    response.errorMsgResponse(res, 301, "Something went wrong");
  }
});

router.get("/get/profile", auth.verify, async (req, res) => {
  try {
    let userId = req.userId;
    let userData = await User.findOne({ _id: userId }).select(
      "-password -createdAt -updatedAt -__v"
    );
    response.successResponse(
      res,
      200,
      "User data fetched successfully",
      userData
    );
  } catch (error) {
    console.log(error);
    response.errorMsgResponse(res, 301, "Something went wrong");
  }
});

router.put("/update/profile", auth.verify, async (req, res) => {
  try {
    let userId = req.userId;
    let updateUser = await User.findOneAndUpdate(
      { _id: userId },
      { $set: req.body }
    );
    if (updateUser) {
      updateUser = await User.findOne({ _id: userId });
      response.successResponse(
        res,
        200,
        "User Updated successfully",
        updateUser
      );
    }
  } catch (error) {
    console.log(error);
    response.errorMsgResponse(res, 301, "Something went wrong");
  }
});

module.exports = router;
