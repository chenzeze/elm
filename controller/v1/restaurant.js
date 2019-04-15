import RestaurantModel from '../../models/restaurant'
import Category from './category'
import Menu from './menu'
import Rating from './rating'
import AddressComponent from '../../prototype/addressComponent'
import formidable from 'formidable'
class Restaurant extends AddressComponent {
    constructor() {
        super();
        this.getRestaurants = this.getRestaurants.bind(this);
        this.addRestaurant = this.addRestaurant.bind(this);
    }
    //添加餐馆
    async addRestaurant(req, res, next) {
        //先获取商店的id
        let restaurant_id;
        try {
            restaurant_id = await this.getId('restaurant_id');
        } catch (err) {
            console.log('获取商店id失败');
            res.send({
                type: 'ERROR_DATA',
                message: '获取数据失败'
            })
            return
        }
        //获取前台参数
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            try {
                if (!fields.name || fields.name.length < 1 || fields.name.length > 10) {
                    throw new Error('餐馆名称错误');
                } else if (!fields.address) {
                    throw new Error('餐馆地址不能为空');
                } else if (!fields.phone) {
                    throw new Error('餐馆联系电话不能为空');
                }
                // else if (!fields.latitude || !fields.longitude) {
                //     throw new Error('餐馆位置信息不能为空');
                // }
                else if (!fields.category) {
                    throw new Error('餐馆所属食品分类不能为空');
                } else if (!fields.image_path) {
                    throw new Error('餐馆店铺图片地址不能为空');
                }
            } catch (err) {
                console.log('前台参数出错', err.message);
                res.send({
                    status: 0,
                    type: 'ERROR_PARAMS',
                    message: err.message
                })
                return;
            }

            //检验店铺名称的唯一性
            const is_exist = await RestaurantModel.findOne({
                name: fields.name
            });
            if (is_exist) {
                console.log('店铺已存在，请尝试其他店铺名称');
                res.send({
                    status: 0,
                    type: 'RESTURANT_EXISTS',
                    message: '店铺已存在，请尝试其他店铺名称'
                })
                return;
            }
            //新店铺的字段以及有些字段的默认值
            const opening_hours = fields.startTime && fields.endTime ? fields.startTime + '/' + fields.endTime : '8:30/20:30';
            const newRestaurant = {
                name: fields.name,
                address: fields.address,
                desc: fields.desc,
                delivery_fee: fields.delivery_fee,
                minimum_order_amount: fields.minimum_order_amount,
                id: restaurant_id,
                latitude: fields.latitude,
                longitude: fields.longitude,
                opening_hours: [opening_hours],
                phone: fields.phone,
                slogan: fields.slogan || '欢迎光临，用餐高峰请提前下单，谢谢',
                rating: (4 + Math.random()).toFixed(1),
                rating_count: Math.ceil(Math.random() * 1000),
                status: Math.round(Math.random()),
                recent_order_num: Math.ceil(Math.random() * 1000),
                image_path: fields.image_path,
                category: fields.category,
                activities: fields.activities,
                supports: [],
                delivery_mode: [],
                license: {
                    legal_person: "",
                    license_date: "",
                    license_number: "",
                    license_scope: "",
                    license_address: "",
                    company_name: "",
                    business_license_img: fields.business_license_img || '',
                    catering_service_license_img: fields.catering_service_license_img || '',
                }
            }
            //配送方式
            if (fields.delivery_mode) {
                newRestaurant.delivery_mode.push({
                    color: "57A9FF",
                    id: 1,
                    is_solid: true,
                    text: "蜂鸟专送"
                })
            }

            //保存数据,增加对应食品种类的数量,给评价，出售食物一些随机初始数据
            try {
                const restaurant = new RestaurantModel(newRestaurant);
                await restaurant.save();
                Category.addCategoryCount(fields.category)
                Rating.initData(restaurant_id);
                Menu.initData(restaurant_id);
                res.send({
                    status: 1,
                    sussess: '添加餐馆成功',
                    restaurantDetail: newRestaurant
                })
            } catch (err) {
                console.log('商铺写入数据库失败', err);
                res.send({
                    status: 0,
                    type: 'ERROR_SERVER',
                    message: '添加商铺失败',
                })
            }
        })
    }

    //更新餐馆信息
    async updateRestaurant(req, res, next) {
        const restaurant_id = req.params.restaurant_id;
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.log('获取餐馆信息form出错', err);
                res.send({
                    status: 0,
                    type: 'ERROR_FORM',
                    message: '表单信息错误',
                })
                return
            }
            const {
                name,
                address,
                description = '',
                phone,
                image_path,
                category,
                latitude,
                longitude
            } = fields;
            if (restaurant_id == 7) {
                res.send({
                    status: 0,
                    message: '此店铺用做展示，请不要修改'
                })
                return
            }
            try {
                // 检查参数
                if (!name) {
                    throw new Error('餐馆名称错误');
                } else if (!address) {
                    throw new Error('餐馆地址错误');
                } else if (!phone) {
                    throw new Error('餐馆联系电话错误');
                } else if (!category) {
                    throw new Error('餐馆所属食品分类错误');
                } else if (!image_path) {
                    throw new Error('餐馆店铺图片地址错误');
                }
                let newData = {
                    name,
                    address,
                    description,
                    phone,
                    category,
                    image_path
                };
                if (latitude && longitude) {
                    object.assign(newData, {
                        latitude,
                        longitude,
                    })
                }
                await RestaurantModel.findOneAndUpdate({
                    id: restaurant_id
                }, {
                    $set: newData
                });
                res.send({
                    status: 1,
                    success: '修改商铺信息成功',
                })
            } catch (err) {
                console.log(err.message, err);
                res.send({
                    status: 0,
                    type: 'ERROR_UPDATE_RESTAURANT',
                    message: '更新商铺信息失败',
                })
            }
        })
    }

    // 删除餐馆
    async deleteRestaurant(req, res, next) {
        const restaurant_id = req.params.restaurant_id;
        if (!Number(restaurant_id)) {
            console.log('restaurant_id参数错误');
            res.send({
                status: 0,
                type: 'ERROR_PARAMS',
                message: 'restaurant_id参数错误',
            })
            return
        }
        if (restaurant_id == 7) {
            res.send({
                status: 0,
                message: '此店铺用做展示，请不要删除'
            })
            return
        }
        try {
            const restaurant = await RestaurantModel.findOne({
                id: restaurant_id
            });
            if (!restaurant) {
                throw new Error('没有找到该餐馆');
            }
            await RestaurantModel.remove({
                id: restaurant_id
            });
            res.send({
                status: 1,
                success: '删除餐馆成功'
            });
        } catch (err) {
            console.log('删除餐馆失败', err);
            res.send({
                status: 0,
                type: 'DELETE_RESTURANT_FAILED',
                message: '删除餐馆失败',
            })
        }
    }

    // 获取餐馆总数量
    async getRestaurantCount(req, res, next) {
        try {
            const count = await RestaurantModel.count();
            res.send({
                status: 1,
                count
            })
        } catch (err) {
            console.log('获取餐馆数量失败', err);
            res.send({
                status: 0,
                type: 'ERROR_TO_GET_COUNT',
                message: '获取餐馆数量失败'
            })
        }
    }

    // 获取餐馆详情
    async getRestaurantDetail(req, res, next) {
        const restaurant_id = req.params.restaurant_id;
        if (!restaurant_id || !Number(restaurant_id)) {
            console.log('获取餐馆详情参数ID错误');
            res.send({
                status: 0,
                type: 'ERROR_PARAMS',
                message: '餐馆ID参数错误',
            })
            return
        }
        try {
            const restaurant = await RestaurantModel.findOne({
                id: restaurant_id
            });
            res.send(restaurant);
        } catch (err) {
            console.log('获取餐馆详情失败', err);
            res.send({
                status: 0,
                type: 'GET_DATA_ERROR',
                message: '获取餐馆详情失败',
            })
        }
    }

    // 获得餐馆列表（可筛选类型，可排序）
    async getRestaurants(req, res, next) {
        const {
            latitude,
            longitude,
            offset = 0,
            limit = 20,
            order_by = 4,
            delivery_mode = [],
            support_ids = [],
            restaurant_category_ids = []
        } = req.query;

        try {
            if (!latitude) {
                throw new Error('latitude参数错误');
            } else if (!longitude) {
                throw new Error('longitude参数错误');
            }
        } catch (err) {
            console.log('latitude/longitude参数错误');
            res.send({
                status: 0,
                type: 'ERROR_PARAMS',
                message: err.message
            })
            return
        }
        let filter = {};
        //获取对应食品种类
        if (restaurant_category_ids.length && Number(restaurant_category_ids[0])) {
            const category = await Category.getNameById(Number(restaurant_category_ids[0]));
            Object.assign(filter, {
                category
            });
        }
        //按照距离，评分，销量等排序
        let sortBy = {};
        if (Number(order_by)) {
            switch (Number(order_by)) {
                case 1:
                    object.assign(sortBy, {
                        float_minimum_order_amount: 1
                    })
                    break;
                case 2:
                    object.assign(filter, {
                        location: {
                            $near: [longitude, latitude]
                        }
                    })
                    break;
                case 3:
                    object.assign(sortBy, {
                        rating: -1
                    })
                    break;
                case 5:
                    object.assign(filter, {
                        location: {
                            $near: [longitude, latitude]
                        }
                    })
                    break;
                case 6:
                    object.assign(sortBy, {
                        recent_order_num: -1
                    })
                    break;
            }
        }
        //查找配送方式
        if (delivery_mode.length) {
            delivery_mode.forEach(item => {
                if (Number(item)) {
                    Object.assign(filter, {
                        'delivery_mode.id': Number(item)
                    })
                }
            })
        }
        //查找活动支持方式
        if (support_ids.length) {
            const valid_support_ids = [];
            support_ids.forEach(item => {
                if (Number(item) && Number(item) !== 8) {
                    valid_support_ids.push(Number(item))
                } else if (Number(item) === 8) { //品牌保证特殊处理
                    Object.assign(filter, {
                        is_premium: true
                    })
                }
            })
            if (valid_support_ids.length) { //匹配同时拥有多种活动的数据
                Object.assign(filter, {
                    'supports.id': {
                        $all: valid_support_ids
                    }
                })
            }
        }
        const restaurants = await RestaurantModel.find(filter, '-_id').sort(sortBy).limit(Number(limit)).skip(Number(offset));
        const from = latitude + ',' + longitude;
        let to = '';

        //获取百度地图测局所需经度纬度
        restaurants.forEach((item, index) => {
            const splitStr = (index == restaurants.length - 1) ? '' : '|';
            to += item.latitude + ',' + longitude + splitStr;
        })
        try {
            if (restaurants.length) { //获取距离信息，并合并到数据中
                const distance_duration = this.getDistance(from, to);
                restaurants.map((item, index) => {
                    return Object.assign(item, distance_duration[index])
                })
            }
        } catch (err) {
            // 百度地图达到上限后会导致加车失败，需优化
            console.log('从addressComoponent获取测距数据失败', err);
            restaurants.map((item, index) => {
                return Object.assign(item, {
                    distance: '10公里',
                    order_lead_time: '40分钟'
                })
            })
        }
        try {
            res.send(restaurants)
        } catch (err) {
            res.send({
                status: 0,
                type: 'ERROR_GET_RESTAURANT_LIST',
                message: '获取店铺列表数据失败'
            })
            return
        }
    }


}

export default new Restaurant()