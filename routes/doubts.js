const express = require("express");
const DoubtController = require("../controllers/DoubtController");
const { authentication, isTeacher, isStudent } = require("../middleware/authentication");

const router = express.Router();

router.post("/createDoubt", DoubtController.createDoubt);

router.put("/doubts", authentication, DoubtController.updateDoubt);
router.put("/id/:_id", authentication, isTeacher, DoubtController.updateDoubtById);
router.put("/update/:topic", authentication, isTeacher, DoubtController.updateDoubtByTopic);
router.put("/resolved/:queryId", authentication, isStudent, DoubtController.markDoubtAsResolved);
router.put("/unresolved/:queryId", authentication, isStudent, DoubtController.markDoubtAsUnresolved);

router.get("/page/doubts", authentication, isTeacher, DoubtController.getAllDoubtsPagination);
router.get("/all/all", DoubtController.getEverything);

router.delete("/doubts/:queryId", authentication, DoubtController.deleteDoubt);

module.exports = router;
