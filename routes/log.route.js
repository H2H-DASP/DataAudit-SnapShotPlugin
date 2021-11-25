require("dotenv").config();
const express = require("express");
const router = express.Router();
const CDC = require("../model/cdc.model");

// GET : /getlog
router.get("/getlog", async (req, res) => {
  try {
    const all_log = await CDC.find({});
    res.status(200).json(all_log);
  } catch (err) {
    res.status(500).json({
      message: err.message,
      path: "/api/getlog",
    });
  }
});
// GET : /getlog/:data_id
router.get("/getlog/:data_id", async (req, res) => {
  try {
    const data_id = req.params.data_id;
    const log = await CDC.find({ data_id: data_id });

    res.status(200).json(log);
  } catch (err) {
    res.status(500).json({
      message: err.message,
      path: `/api/getlog/${data_id}`,
    });
  }
});

// POST : /updatelog

router.post("/createlog", async (req, res) => {
  const new_id = req.body.id;
  const newcontent = req.body.content;
  // check
  const datalog = await CDC.findOne({ data_id: new_id });
  if (datalog) {
    const changeLog = {
      version: new_id + (datalog.change_log.length + 1),
      content: datalog.content,
    };
    datalog.change_log.push(changeLog);
    datalog.content = newcontent;
    datalog
      .save()
      .then((result) => {
        res.status(200).json({
          message: "[*]Data History Captured",
          result: "success",
        });
      })
      .catch((err) => {
        res.status(500).json({
          message: "Something went wrong",
          result: "error",
        });
      });
  } else {
    const newLog = new CDC({
      data_id: new_id,
      timestamp: Date.now(),
      content: newcontent,
    });
    newLog
      .save()
      .then((result) => {
        res.status(200).json({
          message: "Log created successfully",
          result: "success",
        });
      })
      .catch((err) => {
        res.status(500).json({
          message: "Something went wrong",
          result: "error",
        });
      });
  }
});

module.exports = router;
