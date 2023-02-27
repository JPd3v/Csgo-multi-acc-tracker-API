import express from 'express';
import * as steamAccountsController from '../controllers/steamAccount';

const router = express.Router();

router.get('/', steamAccountsController.userAccounts);
router.post('/', steamAccountsController.newAccount);
router.put('/:accountId', steamAccountsController.editAccount);
router.delete('/:accountId', steamAccountsController.deleteAccount);

export default router;
