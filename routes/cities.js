import express from 'express'
import City from '../controller/v1/cities'
const router = express.Router();
// http://localhost:8010/cities?type=guess
// http://localhost:8010/cities?type=hot
// http://localhost:8010/cities?type=group
router.get('/', City.getCity);
router.get('/pois', City.search);
router.get('/:id', City.getCityById);
router.get('/exactaddress/:geohash', City.getExactAddress);
export default router