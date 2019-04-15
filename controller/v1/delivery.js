import DeliveryModel from '../../models/delivery'
import BaseComponent from '../../prototype/baseComponent'
// 获取配送方式
class Delivery extends BaseComponent {
    constructor() {
        super();
    }
    async getDeliveries(req, res, next) {
        try {
            const deliveries = await DeliveryModel.find({}, '-_id');
            res.send(deliveries);
        } catch (err) {
            console.log('获取deliveries失败')
            res.send({
                status: 0,
                type: 'ERROR_DATA',
                message: '获取deliveries失败'
            })
        }
    }
}
export default new Delivery();