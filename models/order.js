'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const orderSchema = new Schema({
	id: Number, // 订单号
	restaurant_id: Number,
	user_id: Number,
	address_id: Number,
	remark_id: Number,
	cart_id: Number,
	payment_id: Number,
	is_deliver_by_fengniao: {
		type: Boolean,
		default: true
	},
	orinal_total_price: Number,
	total_price: Number,
	total_price_explanation: String,
	anticipated_delivery_time: String,
	created_time: String,
	is_online_paid: Number,
	invoice: {
		status_text: {
			type: String,
			default: "不需要开发票"
		},
		is_available: {
			type: Boolean,
			default: true
		},
	},
	deliver_fee: {
		category_id: {
			type: Number,
			default: 2
		},
		name: {
			type: String,
			default: '配送费'
		},
		price: {
			type: Number,
			default: 4
		},
		quantity: {
			type: Number,
			default: 1
		},
	},
	packing_fee: {
		category_id: {
			type: Number,
			default: 1
		},
		name: {
			type: String,
			default: '包装费'
		},
		price: Number,
		quantity: Number
	}

})

orderSchema.index({
	id: 1
});

const Order = mongoose.model('Order', orderSchema);

export default Order