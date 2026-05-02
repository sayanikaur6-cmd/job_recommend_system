const express = require('express');
const router = express.Router();

const {
  addSkill,
  getAllSkills,
  editSkill,
  deleteSkill,
} = require('../controllers/skillController');

router.route('/')
  .get(getAllSkills)
  .post(addSkill);

router.route('/:id')
  .put(editSkill)
  .delete(deleteSkill);

module.exports = router;
