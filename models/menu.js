import mongoose from 'mongoose'
const Schema = mongoose.Schema;
const menuSchema = new Schema({
    description: String,
    is_selected: {
        type: Boolean,
        default: true
    },
    icon_url: {
        type: String,
        default: ''
    },
    name: {
        type: String,
        isRequired: true
    },
    id: {
        type: Number,
        isRequired: true
    },
    restaurant_id: {
        type: Number,
        isRequired: true
    },
    type: {
        type: Number,
        default: 1
    },
    foods: []
});

menuSchema.index({
    id: 1
});
const Menu = mongoose.model('Menu', menuSchema);
export default Menu