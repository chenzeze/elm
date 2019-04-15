'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const addressSchema = new Schema({
	id: Number,
	user_id: Number,
	name: String,
	phone: String,
	address: String,
	address_detail: String,
	is_valid: {
		type: Number,
		default: 1
	},
	st_geohash: String,
	poi_type: {
		type: Number,
		default: 0
	},
	tag: {
		type: String,
		default: '家'
	},
	sex: {
		type: Number,
		default: 1
	},
})

addressSchema.index({
	id: 1
});

const Address = mongoose.model('Address', addressSchema);

export default Address