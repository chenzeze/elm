import MenuModel from '../../models/menu'
import BaseComponent from '../../prototype/baseComponent'
class Menu extends BaseComponent {
    constructor() {
        super();
        this.defaultData = [{
            name: '热销榜',
            description: '大家喜欢吃，才叫真的好吃',
            icon_url: '5da3872d782f707b4c82ce4607c73d1ajpeg',
            is_selected: true,
            type: 1,
            foods: []
        }, {
            name: '优惠',
            description: '美味又实惠, 大家快来抢!',
            icon_url: "4735c4342691749b8e1a531149a46117jpeg",
            type: 1,
            foods: [],
        }]
        this.initData = this.initData.bind(this);
        this.addCategory = this.addCategory.bind(this);
    }
    // 获取餐馆的菜单食品
    async getFoods(req, res, next) {
        const restaurant_id = req.params.restaurant_id;
        const category_id = req.query.category_id;
        if (!restaurant_id || !Number(restaurant_id)) {
            console.log('获取餐馆参数ID错误');
            res.send({
                status: 0,
                type: 'ERROR_PARAMS',
                message: '餐馆ID参数错误',
            })
            return
        }
        let filter;
        if (category_id) {
            if (Number(category_id)) {
                filter = {
                    restaurant_id,
                    id: category_id
                };
            } else {
                console.log('获取Menu详情参数ID错误');
                res.send({
                    status: 0,
                    type: 'ERROR_PARAMS',
                    message: 'Menu ID参数错误',
                })
                return
            }
        } else {
            filter = {
                restaurant_id
            };
        }
        try {
            const menu = await MenuModel.find(filter, '-_id');
            res.send(menu);
        } catch (err) {
            console.log('获取店铺食品数据失败', err);
            res.send({
                status: 0,
                type: 'GET_DATA_ERROR',
                message: '获取店铺食品数据失败'
            })
        }
    }
    // 初始化食品数据，此时foods为[]
    async initData(restaurant_id) {
        for (let i = 0; i < this.defaultData.length; i++) {
            let category_id;
            try {
                category_id = await this.getId('category_id');
            } catch (err) {
                console.log('获取category_id失败');
                throw new Error(err);
            }
            const defaultData = this.defaultData[i];
            const Category = {
                ...defaultData,
                id: category_id,
                restaurant_id
            }
            const newFood = new MenuModel(Category);
            try {
                await newFood.save();
                console.log('初始化食品数据成功');
            } catch (err) {
                console.log('初始化食品数据失败');
                throw new Error(err);
            }
        }
    }

    // 添加餐厅内菜单种类
    async addCategory(req, res, next) {
        let restaurant_id = req.params.restaurant_id;
        let category_id;
        try {
            category_id = await this.getId('category_id');
        } catch (err) {
            console.log('获取category_id失败');
            res.send({
                type: 'ERROR_DATA',
                message: '获取数据失败'
            })
            return
        }
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            try {
                if (!fields.name) {
                    throw new Error('必须填写食品类型名称');
                }
            } catch (err) {
                console.log('食品类型名称错误', err);
                res.send({
                    status: 0,
                    type: 'ERROR_PARAMS',
                    message: '食品类型名称错误'
                })
                return
            }
            const categoryObj = {
                name: fields.name,
                description: fields.description,
                restaurant_id,
                id: category_id,
                foods: [],
            }
            const newMenuCategory = new MenuModel(categoryObj);
            try {
                await newMenuCategory.save();
                res.send({
                    status: 1,
                    success: '添加食品种类成功',
                })
            } catch (err) {
                console.log('保存数据失败');
                res.send({
                    status: 0,
                    type: 'ERROR_IN_SAVE_DATA',
                    message: '保存数据失败',
                })
            }
        })
    }

    // 获取餐厅内菜单种类
    async getCategories(req, res, next) {
        const restaurant_id = req.params.restaurant_id;
        if (!restaurant_id || !Number(restaurant_id)) {
            console.log('缺少restaurant_id参数');
            res.send({
                status: 0,
                type: 'ERROR_PARAMS',
                message: '缺少restaurant_id参数'
            })
        }
        try {
            const data = await MenuModel.find({
                restaurant_id
            });
            let MenuCategories = [];
            data.forEach(item => {
                MenuCategories.push(item);
            })
            res.send({
                status: 1,
                MenuCategories
            });
        } catch (err) {
            console.log('获取类型失败');
            res.send({
                status: 0,
                type: 'GET_CATEGORY_FAILED',
                message: '获取类型失败'
            })
        }
    }
}
export default new Menu()