import ActivityModel from '../../models/activity'
import BaseComponent from '../../prototype/baseComponent'
// 获取配送方式
class Activity extends BaseComponent {
    constructor() {
        super();
    }
    // 获取活动
    async getActivities(req, res, next) {
        try {
            const activities = await ActivityModel.find({}, '-_id');
            res.send(activities);
        } catch (err) {
            console.log('获取activities失败')
            res.send({
                status: 0,
                type: 'ERROR_DATA',
                message: '获取activities失败'
            })
        }
    }
}
export default new Activity();