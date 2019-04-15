'use strict';

import mongoose from 'mongoose'
import userInfoData from '../InitData/userInfo'
const Schema = mongoose.Schema;

const userInfoSchema = new Schema({
	registe_time: String,
	user_id: Number,
	avatar: {
		type: String,
		default: 'default.jpg'
	},
	is_member_new: {
		type: Boolean,
		default: true
	},
	default_address_id: {
		type: Number,
		default: 0
	},
	current_invoice_id: {
		type: Number,
		default: 0
	},
	city: String,
})

userInfoSchema.index({
	id: 1
});


const UserInfo = mongoose.model('UserInfo', userInfoSchema);
UserInfo.findOne((err, data) => {
	if (!data) {
		userInfoData.forEach(item => {
			UserInfo.create(item);
		})
	}
})
export default UserInfo