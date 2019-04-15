import mongoose from 'mongoose'

const restaurantSchema = new mongoose.Schema({
	activities: [],
	address: String,
	delivery_mode: [],
	desc: {
		type: String,
		default: ""
	},
	order_lead_time: {
		type: String,
		default: ""
	},
	distance: {
		type: String,
		default: ""
	},
	location: {
		type: [Number],
		index: '2d'
	},
	delivery_fee: {
		type: Number,
		default: 0
	},
	minimum_order_amount: {
		type: Number,
		default: 0
	},
	id: Number,
	category: String,
	license: {
		company_name: {
			type: String,
			default: ""
		},
		legal_person: {
			type: String,
			default: ""
		},
		license_date: {
			type: String,
			default: ""
		},
		license_number: {
			type: String,
			default: ""
		},
		license_scope: {
			type: String,
			default: ""
		},
		license_address: {
			type: String,
			default: ""
		},
		business_license_img: {
			type: String,
			default: ""
		},
		catering_service_license_img: {
			type: String,
			default: ""
		}
	},
	image_path: {
		type: String,
		default: ""
	},

	latitude: Number,
	longitude: Number,
	name: {
		type: String,
		required: true
	},
	opening_hours: {
		type: Array,
		default: ["08:30/20:30"]
	},
	phone: {
		type: String,
		required: true
	},

	slogan: {
		type: String,
		default: "欢迎光临，用餐高峰请提前下单，谢谢"
	},
	rating: {
		type: Number,
		default: 0
	},
	rating_count: {
		type: Number,
		default: 0
	},
	recent_order_num: {
		type: Number,
		default: 0
	},
	status: {
		type: Number,
		default: 0
	},
	supports: [],
});

restaurantSchema.index({
	id: 1
}); //primary_key 主键

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

export default Restaurant