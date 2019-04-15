import express from 'express'
import User from '../controller/v1/user'
import Address from '../controller/v1/address'
import Carts from '../controller/v1/carts'
import Order from '../controller/v1/order'
import Remark from '../controller/v1/remark'
const router = express.Router();

router.post('/login', User.login);
router.get('/signout', User.signout);
router.post('/changepassword', User.chanegPassword);
router.get('/list', User.getUserList);
router.get('/count', User.getUserCount);
router.get('/Infos', User.getInfo);
router.get('/Infos/:user_id', User.getInfoById);
router.get('/city/count', User.getUserCity);
router.post('/avatar/:user_id', User.updateAvatar)

router.get('/addresses', Address.getAddress);
router.post('/addresses/:user_id/add', Address.addAddress);
router.delete('/addresses/:address_id', Address.deleteAddress);

router.post('/carts/checkout', Carts.checkout);
router.get('/carts/:cart_id/remarks', Remark.getRemarks);

router.get('/orders', Order.getAllOrders)
router.get('/orders/count', Order.getOrdersCount)
router.get('/orders/:user_id', Order.getUserOrders)
router.get('/orders/:user_id/:order_id/snapshot', Order.getOrderDetail)

export default router