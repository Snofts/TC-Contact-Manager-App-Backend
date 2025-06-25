import express from 'express';
import { body } from 'express-validator';
import {
  createContact,
  getContacts,
  getContact,
  updateContact,
  deleteContact,
  shareContact
} from '../controllers/contact.controller.js';
import { auth } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(auth);

router.get('/', getContacts);
router.get('/:id', getContact);
router.post(
  '/',
  body('name').notEmpty(),
  createContact
);
router.put('/:id', updateContact);
router.delete('/:id', deleteContact);
router.post('/:id/share', shareContact);

export default router;
