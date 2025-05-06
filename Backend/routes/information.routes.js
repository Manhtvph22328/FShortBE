const express = require('express');
const {authMiddleware} = require("../middlewares/authMiddleware");
const {createInformation, getAllInformationByUser, updateInformation, deleteInformation, setCheckedInformation} = require("../controllers/informationController");

const router = express.Router();

router.post('/addInfor',authMiddleware,createInformation );
router.get('/getInforByUser',authMiddleware, getAllInformationByUser);
router.put('/updateInfor/:id',authMiddleware, updateInformation );
router.delete('/deleteInfor/:id',authMiddleware, deleteInformation );
router.put('/setChecked/:id',authMiddleware, setCheckedInformation );


module.exports = router;
