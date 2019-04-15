'use strict';

import mongoose from 'mongoose'
const Schema = mongoose.Schema;
import foodData from '../InitData/foods'
const foodSchema = new Schema({
	id: Number,
	name: {
		type: String,
		isRequired: true
	},
	pinyin_name: {
		type: String,
		default: ''
	},
	restaurant_id: {
		type: Number,
		isRequired: true
	},
	menu_id: {
		type: Number,
		isRequired: true
	},
	rating_id: {
		type: Number,
		default: 0
	},
	image_path: {
		type: String,
		default: ""
	},
	stock: {
		type: Number,
		default: 1000
	},
	month_sales: {
		type: Number,
		default: 0
	},
	sold_out: {
		type: Boolean,
		default: false
	},
	price: {
		type: Number,
		default: 0
	},
	rating: {
		type: Number,
		default: 0
	},
	packing_fee: {
		type: Number,
		default: 0
	},
	original_price: {
		type: Number,
		default: 0
	},
	satisfy_count: {
		type: Number,
		default: 0
	},
	description: {
		type: String,
		default: ""
	},
	attrs: [],
	activities: [],
	specs: [{
		spec: String,
		packing_fee: Number,
		price: Number
	}]
})

foodSchema.index({
	item_id: 1
});



const Food = mongoose.model('Food', foodSchema);
Food.findOne((err, data) => {
	if (!data) {
		foodData.forEach(item => {
			Food.create(item);
		})
	}
})

export default Food