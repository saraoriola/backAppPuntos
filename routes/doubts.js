const express = require("express");
const DoubtController = require("../controllers/DoubtController");
const { authentication, isTeacher, isStudent, isAuthor } = require("../middleware/authentication");

const router = express.Router();

router.post("/createDoubt", authentication, DoubtController.createDoubt); // POSTMAN CHECK


router.get("/allDoubts", DoubtController.getAllDoubts); 
router.get("/id/:_id", DoubtController.getById); // POSTMAN CHECK

router.get("/page/doubts", authentication, isTeacher, DoubtController.getDoubtsWithPagination);
router.get("/all/all", DoubtController.getAllDoubtsWithDetails);
router.get('/search/:title', DoubtController.getDoubtsByName);
router.put("/doubts/:_id", authentication, DoubtController.updateDoubtById);
router.put("/update/:topic", authentication, isTeacher, DoubtController.updateDoubtByTopic);
router.put("/resolved/:doubtId", authentication, isStudent, DoubtController.markDoubtAsResolved);
router.put("/unresolved/:doubtId", authentication, isStudent, DoubtController.markDoubtAsUnresolved);
router.delete("/doubts/:doubtId", authentication, DoubtController.deleteDoubt);

module.exports = router;
