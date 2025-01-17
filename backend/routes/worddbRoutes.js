const express = require('express');
const router = express.Router();
const worddbControllers = require('../controllers/worddbControllers');


//GET api/worddb , get all wordpairs from database
router.get('/', worddbControllers.getAllWords);

//POST api/worddb , add new wordpair to database
router.post('/', worddbControllers.addNewwordpair);

//DELETE api/worddb/myId , delete chosen wordpair with chosen id
router.delete('/:myId', worddbControllers.deleteWordpair);

//PUT api/worddb/myId , update wordpair with chosen id
router.put('/:myId', worddbControllers.updateWordpair);


module.exports = router;