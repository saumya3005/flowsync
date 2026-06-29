const express = require('express');
const router = express.Router();
const { getInvitations, acceptInvitation, declineInvitation } = require('../controllers/invitationController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getInvitations);

router.route('/:id/accept')
  .post(acceptInvitation);

router.route('/:id/decline')
  .post(declineInvitation);

module.exports = router;
