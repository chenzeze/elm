'use strict';

import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const cartSchema = Schema({
	id: Number,
	cart: {
		id: Number,
		foods: []
	}
})

cartSchema.index({
	id: 1
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart