import express from 'express'
import Category from '../controller/v1/category'
import Food from '../controller/v1/food'
import Restaurant from '../controller/v1/restaurant'
import Delivery from '../controller/v1/delivery'
import Activity from '../controller/v1/activity'
import Rating from '../controller/v1/rating'
import Menu from '../controller/v1/menu'
const router = express.Router();

// http://localhost:8010/restaurants?latitude=1&longitude=1
// http://localhost:8010/restaurants/count
// http://localhost:8010/restaurants/add 必须字段
// http://localhost:8010/restaurants/7/detail
// http://localhost:8010/restaurants/15/delete
// http://localhost:8010/restaurants/update 

router.get('/', Restaurant.getRestaurants);
router.get('/count', Restaurant.getRestaurantCount);
router.post('/add', Restaurant.addRestaurant);
router.get('/:restaurant_id/detail', Restaurant.getRestaurantDetail);
router.delete('/:restaurant_id/delete', Restaurant.deleteRestaurant);
router.post('/update', Restaurant.updateRestaurant);

// http://localhost:8010/restaurants/categories
// http://localhost:8010/restaurants/categories/7/add
// http://localhost:8010/restaurants/categories/219
// http://localhost:8010/restaurants/deliveries
// http://localhost:8010/restaurants/activities
router.get('/menuCategories/:restaurant_id', Menu.getCategories);
router.post('/menuCategories/:restaurant_id/add', Menu.addCategory);
router.get('/menuFoods/:restaurant_id', Menu.getFoods);

router.get('/categories', Category.getCategories);
router.get('/categories/:restaurant_id', Category.getCategoryNameById);
router.get('/deliveries', Delivery.getDeliveries);
router.get('/activities', Activity.getActivities);

// http://localhost:8010/restaurants/foods
// http://localhost:8010/restaurants/foods/count
// http://localhost:8010/restaurants/foods/7/add
// http://localhost:8010/restaurants/foods/7
// http://localhost:8010/restaurants/foods/7/delete
// http://localhost:8010/restaurants/foods/7/update
router.get('/foods', Food.getFoods);
router.get('/foods/count', Food.getFoodsCount);
router.post('/foods/:restaurant_id/add', Food.addFood);
router.delete('/foods/:food_id/delete', Food.deleteFood);
router.post('/foods/:food_id/update', Food.updateFood);

router.get('/ratings/:restaurant_id', Rating.getRatings)
router.get('/ratings/:restaurant_id/scores', Rating.getScores)
router.get('/ratings/:restaurant_id/tags', Rating.getTags)
export default router