const router = require('express').Router()
const ctrl = require('../controllers/user')
const auth = require('../config/auth-config')

router.get('/', auth, ctrl.getAllUsers)
router.get('/:id', auth, ctrl.getUserById)

router.post('/login', ctrl.loginUser)
router.post('/signup', ctrl.createUser)

router.get('/refresh/:id', ctrl.refreshToken)

module.exports = router
