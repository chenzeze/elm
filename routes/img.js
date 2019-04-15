import express from 'express'
import BaseComponent from '../prototype/baseComponent'
const Base = new BaseComponent();
const Router = express.Router();
Router.post('/add', Base.uploadImg);

export default Router