let router = require("express").Router();
let Product = require("../model/product/product");
let response = require("../helper/response");

let auth = require("../helper/auth");

router.post("/addProduct", auth.verify, async (req, res) => {
  try {
    const data = {
      ...req.body,
      userId: req.userId,
    };
    const service = await new Product(data).save();
    response.successResponse(res, 200, "Product Added Successfully", service);
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 301, "Something went wrong");
  }
});

router.get("/getAllProduct", auth.verify, async (req, res) => {
  try {
    let { key } = req.query;
    let result;
    if (key && key != "") {
      result = await Product.find({ name: { $regex: key, $options: "i" } });
    } else {
      result = await Product.find();
    }
    if (result.length != 0) {
      res.status(200).json({
        status: "SUCCESS",
        message: "Product fetch successfully",
        data: result,
      });
    } else {
      res.status(200).json({
        status: "FAILURE",
        message: "Not Found",
      });
    }
  } catch (err) {
    res.status(301).json({
      status: "FAILURE",
      message: "Something went wrong",
    });
  }
});
router.put("/updateBy/:id", auth.verify, async (req, res) => {
  try {
    let id = req.params.id;

    let result = await Product.findByIdAndUpdate(
      { _id: id },
      { $set: req.body },
      {
        new: true,
      }
    );
    if (result) {
      result = await Product.findById({ _id: id });
      response.successResponse(
        res,
        200,
        "Product updated successfully",
        result
      );
    } else {
      response.errorMsgResponse(res, 301, "Something went wrong");
    }
  } catch (error) {
    response.errorMsgResponse(res, 301, "Something went wrong");
  }
});

router.put("/delete/:id", auth.verify, async (req, res) => {
  try {
    let id = req.params.id;

    let result = await Product.findByIdAndUpdate(
      { _id: id },
      { status: "deleted" },
      {
        new: true,
      }
    );
    response.successResponse(res, 200, "Product deleted successfully", {});
  } catch (error) {
    log.error(error);
    response.errorMsgResponse(res, 301, "Something went wrong");
  }
});

module.exports = router;
