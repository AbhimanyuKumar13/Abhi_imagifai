import express from 'express'
import { generateImage } from '../controllers/imageController.js'
import {isAuthenticated} from '../middlewares/auth.js'

const imageRouter = express.Router()

imageRouter.post('/generate-image', isAuthenticated, generateImage)

export default imageRouter;