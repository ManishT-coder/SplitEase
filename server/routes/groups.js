const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const protect = require('../middleware/auth');
const validate = require('../middleware/validate');

router.use(protect);

router.get('/', groupController.getAllGroups);
router.post(
  '/',
  validate({
    name: { required: true, minLength: 2 }
  }),
  groupController.createGroup
);

router.get('/:groupId', groupController.getGroupDetails);
router.put('/:groupId', groupController.updateGroup);
router.delete('/:groupId', groupController.deleteGroup);
router.post(
  '/:groupId/members',
  validate({ email: { required: true, type: 'email' } }),
  groupController.addMember
);
router.delete('/:groupId/members/:userId', groupController.removeMember);
router.post('/:groupId/leave', groupController.leaveGroup);

module.exports = router;