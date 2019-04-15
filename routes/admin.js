import express from 'express'
import Admin from '../controller/v1/admin'
import check from '../middlewares/check'
const router = express.Router();
router.post('/login', Admin.login);
router.post('/register', Admin.register);
router.get('/signout', check.checkAdmin, Admin.signout);
router.get('/all', check.checkAdmin, Admin.getAllAdmin);
router.get('/count', check.checkAdmin, Admin.getAdminCount);
router.post('/update/avatar/:admin_id', check.checkAdmin, Admin.updateAvatar);

export default router