const router = require('express').Router();
const passport = require('passport');
const controller = require('../controllers/user');
const userValidators = require('../validator/userValidator');
const cloudinary = require('../middleware/cloudinaryImage');
const authUser = require('../helpers/jwt');

router.get('/users', controller.getAllUsers);
router.get('/:username', controller.getUserByUsername);
router.patch(
  '/:username/profile',
  [
    authUser.authUser,
    userValidators.validateUserExists,
    userValidators.validateUserProfileUpdate
  ],
  controller.updateUserProfile
);

router.patch(
  '/:username/image/upload',
  [
    authUser.authUser,
    userValidators.validateUserExists,
    cloudinary.uploadImage('image'),
    cloudinary.deleteCloudImage
  ],
  controller.uploadUserImage
);

// Auth Routes
router.post(
  '/signup',
  [userValidators.validateUserSignup],
  controller.createUser
);

router.post('/login', [userValidators.validateUserEmail], controller.loginUser);

router.get('/login/?provider=facebook', [
  passport.authenticate('facebook', {
    scope: ['profile']
  })
]);

router.get(
  '/login/?provider=facebook/redirect',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);

router.post(
  '/resetpassword',
  [userValidators.validateUserEmail],
  controller.sendPasswordMail
);

router.patch(
  '/newpassword',
  [userValidators.validatePassword],
  controller.resetPassword
);

module.exports = router;
