import FoodModel from '../../models/food'
import RestaurantModel from '../../models/restaurant'
import MenuModel from '../../models/menu'
import BaseComponent from '../../prototype/baseComponent'
import formidable from 'formidable'
class Food extends BaseComponent {
    constructor() {
        super();
        this.addFood = this.addFood.bind(this);

    }

    // 获取食品数量，（可按店铺分）
    async getFoodsCount(req, res, next) {
        const restaurant_id = req.query.restaurant_id;
        let filter = {};
        if (restaurant_id && Number(restaurant_id)) {
            filter = {
                restaurant_id
            }
        }
        try {
            const count = await FoodModel.find(filter).count();
            res.send({
                status: 1,
                success: '获取食品数量成功',
                count
            })
        } catch (err) {
            console.log('获取食品数量失败', err);
            res.send({
                status: 0,
                type: 'ERROR_TO_GET_COUNT',
                message: '获取食品数量失败'
            })
        }
    }

    // 删除食品
    async deleteFood(req, res, next) {
        const food_id = req.params.food_id;
        if (!Number(food_id)) {
            console.log('food_id参数错误');
            res.send({
                status: 0,
                type: 'ERROR_PARAMS',
                message: 'food_id参数错误',
            })
            return
        }
        try {
            await FoodModel.remove({
                item_id: food_id
            });
            res.send({
                status: 1,
                success: '删除食品成功'
            });
        } catch (err) {
            console.log('删除食品失败', err);
            res.send({
                status: 0,
                type: 'DELETE_RESTURANT_FAILED',
                message: '删除食品失败',
            })
        }
    }

    // 更新食品信息
    async updateFood(req, res, next) {
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.log('获取食品信息form出错', err);
                res.send({
                    status: 0,
                    type: 'ERROR_FORM',
                    message: '表单信息错误',
                })
                return
            }
            const {
                name,
                food_id,
                image_path,
                new_menu_id
            } = fields;
            try {
                if (!name) {
                    throw new Error('食品名称不能为空');
                } else if (!image_path) {
                    throw new Error('食品图片不能为空');
                } else if (!Number(food_id)) {
                    throw new Error('食品ID错误');
                } else if (!new_menu_id || !Number(new_menu_id)) {
                    throw new Error('新食品类型ID不能为空');
                }
            } catch (err) {
                console.log('前台参数错误', err.message);
                res.send({
                    status: 0,
                    type: 'ERROR_PARAMS',
                    message: err.message
                })
                return
            }
            try {
                await MenuModel.findOne({
                    id: menu_id
                });
            } catch (err) {
                console.log('获取新食品类型信息失败')
                res.send({
                    status: 0,
                    type: 'ERROR_DATA',
                    message: '获取新食品类型信息失败'
                })
                return
            }

            const newData = {
                name,
                image_path,
                description: fields.description,
                attr_id: fields.attr_id,
                restaurant_id: fields.restaurant_id,
                menu_id: fields.menu_id,
                satisfy_rate: fields.satisfy_rate,
                satisfy_count: fields.satisfy_count,

                rating: fields.rating,
                rating_count: fields.rating_count,
                month_sales: fields.month_sales,
                specs: fields.specs,
            }
            try {
                const food = await FoodModel.findOneAndUpdate({
                    id: food_id
                }, {
                    $set: {
                        newData
                    }
                });
                await food.save();
                res.send({
                    status: 1,
                    success: '更新食品信息成功'
                });
            } catch (err) {
                console.log('更新食品信息失败', err);
                res.send({
                    status: 0,
                    type: 'UPDATE_FOOD_FAILED',
                    message: '更新食品信息失败'
                })
            }
        })
    }

    // 获取foods
    async getFoods(req, res, next) {
        try {
            const foods = await FoodModel.find();
            res.send(foods);
        } catch (err) {
            console.log('获取foods失败');
            res.send({
                status: 0,
                type: 'ERROR_DATA',
                message: '获取foods失败'
            })
            return
        }
    }

    // 添加食品
    async addFood(req, res, next) {
        let food_id;
        try {
            food_id = await this.getId('food_id');
        } catch (err) {
            console.log('获取food_id失败');
            res.send({
                status: 0,
                type: 'ERROR_DATA',
                message: '添加食品失败'
            })
            return
        }

        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            try {
                if (!fields.name) {
                    throw new Error('食品名称不能为空');
                } else if (!fields.image_path) {
                    throw new Error('食品图片不能为空');
                } else if (!fields.specs.length) {
                    throw new Error('至少填写一种规格');
                } else if (!fields.restaurant_id) {
                    throw new Error('店铺ID不能为空');
                } else if (!fields.menu_id) {
                    throw new Error('食品类型ID不能为空');
                }
            } catch (err) {
                console.log('前台参数错误', err.message);
                res.send({
                    status: 0,
                    type: 'ERROR_PARAMS',
                    message: err.message
                })
                return
            }

            let menuCategory;
            let restaurant;
            try {
                menuCategory = await MenuModel.findOne({
                    id: fields.menu_id
                });

                restaurant = await RestaurantModel.findOne({
                    id: restaurant_id
                });
            } catch (err) {
                console.log('获取食品类型和餐馆信息失败')
                res.send({
                    status: 0,
                    type: 'ERROR_DATA',
                    message: '添加食品失败'
                })
                return
            }

            const newFood = {
                name: fields.name,
                desc: fields.desc,
                image_path: fields.image_path,
                restaurant_id,
                menu_id: fields.menu_id,
                id: food_id,
                attr_id: fields.attr_id,
                specs: fields.specs,
                is_essential: fields.is_essential,
                rating_count: Math.ceil(Math.random() * 1000),
                month_sales: Math.ceil(Math.random() * 1000),
                satisfy_rate: Math.ceil(Math.random() * 100),
                satisfy_count: Math.ceil(Math.random() * 1000),
                rating: (4 + Math.random()).toFixed(1)
            }

            try {
                await FoodModel.create(newFood);
                res.send({
                    status: 1,
                    success: '添加食品成功',
                });
            } catch (err) {
                console.log('保存食品到数据库失败', err);
                res.send({
                    status: 0,
                    type: 'ERROR_DATA',
                    message: '添加食品失败'
                })
            }
        })
    }

    // 获取食品规格？
    async getSpecfoods(fields, item_id) {
        let specfoods = [],
            specifications = [];
        let food_id, sku_id;
        if (fields.specs.length < 2) {
            try {
                sku_id = await this.getId('sku_id');
                food_id = await this.getId('food_id');
            } catch (err) {
                throw new Error('获取sku_id、food_id失败')
            }

            specfoods.push({
                packing_fee: fields.specs[0].packing_fee,
                price: fields.specs[0].price,
                specs: [],
                specs_name: fields.specs[0].specs,
                name: fields.name,
                item_id,
                sku_id,
                food_id,
                restaurant_id: fields.restaurant_id,
                recent_rating: (Math.random() * 5).toFixed(1),
                recent_popularity: Math.ceil(Math.random() * 1000),
            })
        } else {
            specifications.push({
                values: [],
                name: "规格"
            })
            for (let i = 0; i < fields.specs.length; i++) {
                try {
                    sku_id = await this.getId('sku_id');
                    food_id = await this.getId('food_id');
                } catch (err) {
                    throw new Error('获取sku_id、food_id失败')
                }
                specfoods.push({
                    packing_fee: fields.specs[i].packing_fee,
                    price: fields.specs[i].price,
                    specs: [{
                        name: "规格",
                        value: fields.specs[i].specs
                    }],
                    specs_name: fields.specs[i].specs,
                    name: fields.name,
                    item_id,
                    sku_id,
                    food_id,
                    restaurant_id: fields.restaurant_id,
                    recent_rating: (Math.random() * 5).toFixed(1),
                    recent_popularity: Math.ceil(Math.random() * 1000),
                })
                specifications[0].values.push(fields.specs[i].specs);
            }
        }
        return [specfoods, specifications]
    }
}

export default new Food()