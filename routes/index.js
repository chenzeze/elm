import restaurants from './restaurants'
import cities from './cities'
import users from './users'
import admin from './admin'
import img from './img'
export default app => {
    app.use('/restaurants', restaurants)
    app.use('/cities', cities)
    app.use('/users', users)
    app.use('/admin', admin)
    app.use('/img', img)
}