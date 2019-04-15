import BaseComponent from '../../prototype/baseComponent'
import RatingModel from '../../models/rating'
class Rating extends BaseComponent {
    constructor() {
        super();
        this.type = ['ratings', 'scores', 'tags'];
        this.getRatings = this.getRatings.bind(this);
        this.getScores = this.getScores.bind(this);
        this.getTags = this.getTags.bind(this);
    }
    async getScores(req, res, next) {
        const restaurant_id = req.params.restaurant_id;
        if (!Number(restaurant_id)) {
            console.log('restaurant_id参数错误')
            res.send({
                status: 0,
                type: 'ERROR_PARAMS',
                message: 'restaurant_id参数错误'
            })
            return
        }
        try {
            const scores = await RatingModel.getData(restaurant_id, this.type[1]);
            res.send(scores);
        } catch (err) {
            console.log('获取商铺评价失败')
            res.send({
                status: 0,
                type: 'ERROR_GET_DATA',
                message: '获取商铺评价失败'
            })
        }
    }
    async getTags(req, res, next) {
        const restaurant_id = req.params.restaurant_id;
        if (!Number(restaurant_id)) {
            console.log('restaurant_id参数错误')
            res.send({
                status: 0,
                type: 'ERROR_PARAMS',
                message: 'restaurant_id参数错误'
            })
            return
        }
        try {
            const tags = await RatingModel.getData(restaurant_id, this.type[2]);
            res.send(tags);
        } catch (err) {
            console.log('获取商铺评价失败')
            res.send({
                status: 0,
                type: 'ERROR_GET_DATA',
                message: '获取商铺评价失败'
            })
        }
    }

    async getRatings(req, res, next) {
        const restaurant_id = req.params.restaurant_id;
        if (!Number(restaurant_id)) {
            console.log('restaurant_id参数错误')
            res.send({
                status: 0,
                type: 'ERROR_PARAMS',
                message: 'restaurant_id参数错误'
            })
            return
        }
        try {
            const ratings = await RatingModel.getData(restaurant_id, this.type[0]);
            res.send(ratings);
        } catch (err) {
            console.log('获取商铺评价失败')
            res.send({
                status: 0,
                type: 'ERROR_GET_DATA',
                message: '获取商铺评价失败'
            })
        }
    }

    async initData(restaurant_id) {
        try {
            const status = await RatingModel.initData(restaurant_id);
            if (status) {
                console.log('初始化评论数据成功');
            }
        } catch (err) {
            console.log('初始化评论数据失败');
            throw new Error(err);
        }
    }
}

export default new Rating()