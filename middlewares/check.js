import AdminModel from '../models/admin'
import UserModel from '../models/user'
class Check {
    constructor() {

    }
    async checkUser(req, res, next) {
        const user_id = req.session.user_id;
        if (!user_id || !Number(user_id)) {
            res.send({
                status: 0,
                type: 'ERROR_SESSION',
                message: '亲，您还没有登录',
            })
            return
        } else {
            const user = await UserModel.findOne({
                user_id
            });
            if (!user) {
                res.send({
                    status: 0,
                    type: 'HAS_NO_ACCESS',
                    message: '亲，您还没有注册'
                })
                return
            }
        }
        next()
    }
    async checkAdmin(req, res, next) {
        const admin_id = req.session.admin_id;
        if (!admin_id || !Number(admin_id)) {
            res.send({
                status: 0,
                type: 'ERROR_SESSION',
                message: '亲，您还没有登录',
            })
            return
        } else {
            const admin = await AdminModel.findOne({
                id: admin_id
            });
            if (!admin) {
                res.send({
                    status: 0,
                    type: 'HAS_NO_ACCESS',
                    message: '亲，您还不是管理员',
                })
                return
            }
        }
        next()
    }
    async checkSuperAdmin(req, res, next) {
        const admin_id = req.session.admin_id;
        if (!admin_id || !Number(admin_id)) {
            res.send({
                status: 0,
                type: 'ERROR_SESSION',
                message: '亲，您还没有登录',
            })
            return
        } else {
            const admin = await AdminModel.findOne({
                id: admin_id
            });
            if (!admin || admin.status != 2) {
                res.send({
                    status: 0,
                    type: 'HAS_NO_ACCESS',
                    message: '亲，您的权限不足',
                })
                return
            }
        }
        next()
    }
}

export default new Check()