'use strict';

import mongoose from 'mongoose'
import userData from '../InitData/users'
const Schema = mongoose.Schema;

const userSchema = new Schema({
	id: Number,
	username: String,
	password: String,
})

const User = mongoose.model('User', userSchema);
User.findOne((err, data) => {
	if (!data) {
		userData.forEach(item => {
			User.create(item);
		})
	}
})
export default User