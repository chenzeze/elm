import fetch from 'node-fetch';
import formidable from 'formidable'
import path from 'path'
import fs from 'fs'
import qiniu from 'qiniu'
import gm from 'gm'
import Ids from '../models/ids'
import {
    resolve
} from 'url';
import {
    rejects
} from 'assert';

qiniu.conf.ACCESS_KEY = 'Ep714TDrVhrhZzV2VJJxDYgGHBAX-KmU1xV1SQdS';
qiniu.conf.SECRET_KEY = 'XNIW2dNffPBdaAhvm9dadBlJ-H6yyCTIJLxNM_N6';

export default class BaseComponent {
    constructor() {
        this.idList = ['restaurant_id', 'food_id', 'order_id', 'user_id', 'address_id', 'cart_id', 'img_id', 'category_id', 'item_id', 'sku_id', 'admin_id', 'statis_id'];
        // this.imgTypeList = ['shop', 'food', 'avatar', 'default'];
        this.encryption = this.encryption.bind(this);
        this.uploadImg = this.uploadImg.bind(this);
    }
    async uploadImg(req, res, next) {
        try {
            const image_path = await this.getPath(req, res);
            res.send({
                status: 1,
                image_path
            })
        } catch (err) {
            console.log('上传图片失败', err);
            res.send({
                status: 0,
                type: 'ERROR_UPLOAD_IMG',
                message: '上传图片失败'
            })
        }
    }

    async getPath(req, res) {
        return new Promise((resolve, reject) => {
            const form = formidable.IncomingForm();
            form.uploadDir = './public/img';
            form.parse(req, async (err, fields, files) => {
                let img_id;
                try {
                    img_id = await this.getId('img_id');
                } catch (err) {
                    console.log('获取图片id失败');
                    fs.unlinkSync(files.file.path);
                    reject('获取图片id失败');
                }
                const hashName = (new Date().getTime() + Math.ceil(Math.random() * 10000)).toString(16) + img_id;
                const extname = path.extname(files.file.name);
                if (!['.jpg', '.jpeg', '.png'].includes(extname)) {
                    fs.unlinkSync(files.file.path);
                    res.send({
                        status: 0,
                        type: 'ERROR_EXTNAME',
                        message: '文件格式错误'
                    })
                    reject('上传失败');
                    return
                }
                const fullName = hashName + extname;
                const repath = './public/img/' + fullName;
                try {
                    fs.renameSync(files.file.path, repath);
                    // 用gm剪裁图片
                    gm(repath).resize(200, 200, "!").write(repath, async (err) => {
                        resolve(fullName)
                    })
                } catch (err) {
                    console.log('保存图片失败', err);
                    if (fs.existsSync(repath)) {
                        fs.unlinkSync(repath);
                    } else {
                        fs.unlinkSync(files.file.path);
                    }
                    reject('保存图片失败')
                }
            })
        })

    }
    async fetch(url = '', data = {}, type = 'GET', resType = 'json') {
        type = type.toUpperCase();
        resType = resType.toUpperCase();
        // get 的数据convert 成query 字符串
        if (type === 'GET') {
            let datastr = '';
            Object.keys(data).forEach(key => {
                datastr += key + '=' + data[key] + '&';
            })

            if (datastr !== '') {
                datastr = datastr.slice(0, -1);
                url = url + '?' + datastr;
            }
        }

        let requestConfig = {
            method: type,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }

        //相当于 requestConfig.body=JSON.stringify(data)
        if (type === 'POST') {
            Object.defineProperties(requestConfig, 'body', {
                value: JSON.stringify(data)
            })
        }

        let responseJson;
        try {
            const response = await fetch(url, requestConfig);
            if (resType === 'TEXT') {
                responseJson = await response.text();
            } else {
                responseJson = await response.json();
            }
        } catch (err) {
            console.log('url为', url);
            console.log('获取Http数据失败', err);
            throw new Error(err);
        }
        return responseJson;
    }
    async getId(type) {
        if (!this.idList.includes(type)) {
            console.log('id类型错误');
            throw new Error('id类型错误');
            return
        }
        try {
            const idData = await Ids.findOne();
            idData[type]++;
            await idData.save();
            return idData[type];
        } catch (err) {
            console.log('获取ID数据失败');
            throw new Error(err);
        }
    }
    encryption(password) {
        const newpassword = this.Md5(this.Md5(password).substr(2, 7) + this.Md5(password));
        return newpassword
    }
    Md5(password) {
        const md5 = crypto.createHash('md5');
        return md5.update(password).digest('base64');
    }
}