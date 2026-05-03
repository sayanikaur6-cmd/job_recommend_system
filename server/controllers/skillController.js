const Skill = require('../models/skill');

const skillController = {
  addSkill: async (req, res) => {
    try {
      const skill = new Skill(req.body);
      await skill.save();
      res.status(201).json(skill);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getAllSkills: async (req, res) => {
    try {
      const skills = await Skill.find();
      res.json(skills);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteSkill: async (req, res) => {
    try {
      const { id } = req.params;
      await Skill.findByIdAndDelete(id);
      res.json({ message: 'Skill deleted' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  editSkill: async (req, res) => {
    try {
      const { id } = req.params;
      const updatedSkill = await Skill.findByIdAndUpdate(id, req.body, { new: true });
      res.json(updatedSkill);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = skillController;