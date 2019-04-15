import CitiesModel from '../../models/cities'
import pinyin from 'pinyin'
import AddressComponent from '../../prototype/addressComponent'
class City extends AddressComponent {
    constructor() {
        super();
        this.getCity = this.getCity.bind(this);
        this.getCityName = this.getCityName.bind(this);
        this.search = this.search.bind(this);
        this.getExactAddress = this.getExactAddress.bind(this);
    }
    async getCity(req, res, next) {
        const type = req.query.type;
        let cityInfo;
        try {
            switch (type) {
                case 'guess':
                    const city = await this.getCityName(req);
                    cityInfo = await CitiesModel.cityGuess(city);
                    break;
                case 'hot':
                    cityInfo = await CitiesModel.cityHot();
                    break;
                case 'group':
                    cityInfo = await CitiesModel.cityGroup();
                    break;
                default:
                    res.json({
                        name: 'ERROR_QUERY_TYPE',
                        message: '参数错误'
                    })
                    return
            }
            res.send(cityInfo)
        } catch (err) {
            res.send({
                name: 'ERROR_DATA',
                message: '获取数据失败'
            })
        }
    }

    async getCityById(req, res, next) {
        const cityid = req.params.id;
        if (isNaN(cityid)) {
            res.json({
                name: 'ERROR_PARAM_TYPE',
                message: '参数错误',
            })
            return
        }
        try {
            const cityInfo = await CitiesModel.getCityById(cityid);
            res.send(cityInfo)
        } catch (err) {
            res.send({
                name: 'ERROR_DATA',
                message: '获取数据失败'
            })
        }
    }

    async getExactAddress(req, res, next) {
        try {
            const geohash = req.params.geohash || '';
            if (geohash.indexOf(',') == -1) {
                res.send({
                    status: 0,
                    type: 'ERROR_PARAMS',
                    message: '参数错误',
                })
                return;
            }
            const poisArr = geohash.split(',');
            const result = await this.getpois(poisArr[0], poisArr[1]);
            const address = {
                address: result.result.address,
                city: result.result.address_component.province,
                geohash,
                latitude: poisArr[0],
                longitude: poisArr[1],
                name: result.result.formatted_addresses.recommend,
            }
            res.send(address);
        } catch (err) {
            console.log('getpois返回信息失败', err);
            res.send({
                status: 0,
                type: 'ERROR_DATA',
                message: '获取数据失败',
            })
        }
    }

    // 把城市的中文名称=》拼音
    async getCityName(req) {
        try {
            const cityInfo = await this.guessPosition(req);
            const pinyinArr = pinyin(cityInfo.city, {
                style: pinyin.STYLE_NORMAL
            });
            let cityName = '';
            pinyinArr.forEach(item => {
                cityName += item[0];
            })
            return cityName;
        } catch (err) {
            return '北京';
        }
    }

    async search(req, res, next) {
        let {
            type = 'search', city_id, keyword
        } = req.query;
        if (!keyword) {
            res.send({
                name: 'ERROR_QUERY_TYPE',
                message: '参数错误',
            })
            return
        } else if (isNaN(city_id)) {
            try {
                const cityname = await this.getCityName(req);
                const cityInfo = await CitiesModel.cityGuess(cityname);
                city_id = cityInfo.id;
            } catch (err) {
                console.log('搜索地址时，获取定位城失败')
                res.send({
                    name: 'ERROR_GET_POSITION',
                    message: '获取数据失败',
                })
            }
        }
        try {
            const cityInfo = await CitiesModel.getCityById(city_id);
            const resObj = await this.searchPlace(keyword, cityInfo.name, type);
            const cityList = [];
            resObj.data.forEach((item, index) => {
                cityList.push({
                    name: item.title,
                    address: item.address,
                    latitude: item.location.lat,
                    longitude: item.location.lng,
                    geohash: item.location.lat + ',' + item.location.lng,
                })
            });
            res.send(cityList);
        } catch (err) {
            res.send({
                name: 'GET_ADDRESS_ERROR',
                message: '获取地址信息失败',
            });
        }
    }
}

export default new City()