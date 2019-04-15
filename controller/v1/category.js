import CategoryModel from '../../models/category'
import BaseComponent from '../../prototype/baseComponent'
import formidable from 'formidable'


class Category extends BaseComponent {
    constructor() {
        super();

        this.getCategoryNameById = this.getCategoryNameById.bind(this);
    }


    // 增加category数量
    async addCategoryCount(type) {
        try {
            await CategoryModel.addCategoryCount(type)
        } catch (err) {
            console.log('增加category数量失败');
        }
    }

    // 获取category
    async getCategories(req, res, next) {
        try {
            const categories = await CategoryModel.find({}, '-_id');
            res.send(categories);
        } catch (err) {
            console.log('获取categories失败');
            res.send({
                status: 0,
                type: 'ERROR_DATA',
                message: '获取categories失败'
            })
        }
    }

    async getCategoryNameById(req, res, next) {
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
            const name = await this.getNameById(restaurant_id);
            res.send({
                status: 1,
                name
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

    // 根据id得到种类名称 大类/小类
    async getNameById(id) {
        try {
            const entity = await CategoryModel.findOne({
                'sub_categories.id': id
            });
            let categoryName = entity.name;
            entity.sub_categories.forEach(item => {
                if (item.id == id) {
                    categoryName += '/' + item.name;
                }
            })
            return categoryName;
        } catch (err) {
            console.log('通过category id获取数据失败')
            throw new Error(err);
        }


    }


}

export default new Category()