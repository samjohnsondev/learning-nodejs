const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController'); 
const { catchErrors } = require('../handlers/errorHandlers');

// Do work here
router.get('/', catchErrors(storeController.getStores));
router.get('/stores', catchErrors(storeController.getStores));
router.get('/add', storeController.addStore);

router.post('/add', 
    storeController.upload,
    catchErrors(storeController.resize),
    catchErrors(storeController.createStore)
);

router.post('/add/:id', 
    storeController.upload,
    catchErrors(storeController.resize),    
    catchErrors(storeController.updateStore)
);

router.post('/register',
    userController.validateRegister,
    userController.register,
    authController.login
) 

router.post('/login', authController.login);

router.get('/stores/:id/edit', catchErrors(storeController.editStore));
//Go to the page for each store
router.get('/store/:slug', catchErrors(storeController.getStoreBySlug));
router.get('/tags/', catchErrors(storeController.getStoreByTag));
router.get('/tags/:tag', catchErrors(storeController.getStoreByTag));
router.get('/login', userController.loginForm);
router.get('/register', userController.registerForm);
router.get('/logout', authController.logout);

module.exports = router;