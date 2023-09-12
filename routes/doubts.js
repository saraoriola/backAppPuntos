const express = require("express");
const DoubtController = require("../controllers/DoubtController");
const { authentication, isTeacher, isStudent, isAuthor } = require("../middleware/authentication");

const router = express.Router();

router.post("/createDoubt", authentication, DoubtController.createDoubt);


router.get("/allDoubts", DoubtController.getAllDoubts);
router.get("/id/:_id", DoubtController.getById);

<<<<<<< HEAD
router.get("/id/:_id", authentication, DoubtController.getDoubtById);
=======
router.get("/id/:_id", DoubtController.getById);

>>>>>>> 8fcc5d2371f21cae16c047fe05aee3174ae3b9b9
router.get("/page/doubts", authentication, isTeacher, DoubtController.getDoubtsWithPagination);
router.get("/all/all", DoubtController.getAllDoubtsWithDetails);
router.get("/title/:title", DoubtController.getDoubtsByName);

router.put("/doubts/:_id", authentication, DoubtController.updateDoubtById);
router.put("/update/:topic", authentication, isTeacher, DoubtController.updateDoubtByTopic);
router.put("/resolved/:doubtId", authentication, isStudent, DoubtController.markDoubtAsResolved);
router.put("/unresolved/:doubtId", authentication, isStudent, DoubtController.markDoubtAsUnresolved);
router.delete("/doubts/:doubtId", authentication, DoubtController.deleteDoubt);

module.exports = router;
