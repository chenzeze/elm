'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const adminSchema = new Schema({
	id: Number,
	user_name: String,
	password: String,
	create_time: String,
	admin_type: Number, //1:普通管理、 2:超级管理员
	city: String,
	avatar: {
		type: String,
		default: 'default.jpg'
	},
})

adminSchema.index({
	id: 1
});

const Admin = mongoose.model('Admin', adminSchema);


export default Admin