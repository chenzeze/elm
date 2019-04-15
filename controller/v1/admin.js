import AddressComponent from '../../prototype/addressComponent'
import AdminModel from '../../models/admin'
import formidable from 'formidable'
import dtime from 'time-formater'
class Admin extends AddressComponent {
    constructor() {
        super();
        this.login = this.login.bind(this);
        this.register = this.register.bind(this);
    }

    async signout(req, res, next) {
        delete req.session.admin_id;
        res.send({
            status: 1,
            success: '用户退出成功'
        })
    }
    async getAllAdmin(req, res, next) {
        try {
            const admins = await AdminModel.find({}, '-_id');
            res.send(admins);
        } catch (err) {
            console.log('获取管理员数据失败');
            res.send({
                status: 0,
                type: 'GET_DATA_FAILED',
                message: '获取管理员数据失败'
            })
        }
    }
    async getAdminCount(req, res, next) {
        try {
            const count = await AdminModel.count();
            res.send({
                status: 1,
                count
            });
        } catch (err) {
            console.log('获取管理员人数失败');
            res.send({
                status: 0,
                type: 'GET_DATA_FAILED',
                message: '获取管理员人数失败'
            })
        }
    }
    async updateAvatar(req, res, next) {
        //更新头像
        const s_id = req.session.admin_id;
        const p_id = req.params.admin_id;
        const admin_id = s_id || p_id;
        if (!admin_id || !Number(admin_id)) {
            console.log('更新头像，admin_id错误', admin_id)
            res.send({
                status: 0,
                type: 'ERROR_USERID',
                message: 'admin_id参数错误',
            })
            return
        }
        try {
            const image_path = await this.getPath(req, res);
            await AdminModel.findOneAndUpdate({
                id: admin_id
            }, {
                $set: {
                    avatar: image_path
                }
            });
            res.send({
                status: 1,
                image_path,
            })
        } catch (err) {
            console.log('更新头像失败', err);
            res.send({
                status: 0,
                type: 'ERROR_UPLOAD_IMG',
                message: '更新头像失败'
            })
        }

    }

    async login(req, res, next) {
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.log('获取表单数据出现问题')
                res.send({
                    status: 0,
                    type: 'ERROR_GET_FORM_DATA',
                    message: '获取表单数据出现问题'
                })
                return
            }
            const {
                user_name,
                password,
                status = 1
            } = fields;
            try {
                if (!username) {
                    throw new Error('用户名不能为空');
                } else if (!password) {
                    throw new Error('密码不能为空');
                }
            } catch (err) {
                console.log('参数错误', err);
                res.send({
                    status: 0,
                    type: 'ERROR_PARAMS',
                    message: '参数错误'
                })
            }

            try {
                const admin = await AdminModel.findOne({
                    user_name
                });
                const newPassword = this.encryption(password);
                if (!admin) { //如果没有该用户就注册
                    this.register(req, res);
                }
                // 检验密码是否正确
                if (admin.password.toString() != newPassword.toString()) {
                    throw new Error('密码不正确');
                }
            } catch (err) {
                console.log('参数错误', err);
                res.send({
                    status: 0,
                    type: 'ERROR_PARAMS',
                    message: '参数错误'
                })
            }
        })
    }

    async register(req, res, next) {
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            const {
                user_name,
                password,
                repassword,
                status = 1,
                city
            } = fields;
            if (!user_name || !password || !repassword) {
                console.log('参数错误', err);
                res.send({
                    status: 0,
                    type: 'ERROR_PARAMS',
                    message: '参数错误'
                })
                return
            }
            let admin_id;
            let cityInfo;
            try {
                const admin = await AdminModel.findOne({
                    user_name
                });
                admin_id = await this.getId('admin_id');
                // 获取所在城市
                cityInfo = await this.guessPosition(req);
                if (admin) {
                    throw new Error('该用户名已存在');
                } else if (password.toString() != repassword.toString()) {
                    throw new Error('两次输入密码不一致');
                }
            } catch (err) {
                console.log('管理员注册失败', err);
                res.send({
                    status: 0,
                    type: 'REGISTER_ADMIN_FAILED',
                    message: '管理员注册失败'
                })
            }

            const enPassword = this.encryption(password);
            const newAdmin = {
                user_name,
                password: enPassword,
                id: admin_id,
                create_time: dtime().format('YYYY-MM-DD HH:mm'),
                status,
                city: cityInfo.city
            };
            await AdminModel.create(newAdmin);
            req.session.admin_id = admin_id;
            res.send({
                status: 1,
                success: '注册管理员成功'
            })
        });
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

export default new Admin()