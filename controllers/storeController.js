const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid'); 

const multerOptions = {
    storage: multer.memoryStorage(),
    fileFilter(req, file, next){
        const isPhoto = file.mimetype.startsWith('image/');
        console.log(isPhoto);
        if(isPhoto){
            next(null, true)
        }else{
            next({message: 'Filetype Invalid'}, false);
        }
    },
};
exports.homePage = (req, res) => {
    res.render('index');
};

exports.addStore = (req, res) => {
    res.render('editStore', {title: 'Add Store'});
}

exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {
    //check if there is not new file
    if(!req.file){
        next();
        return;
    }
    const extention = req.file.mimetype.split('/')[1];
    req.body.photo = `${uuid.v4()}.${extention}`; 
    //resize the photo
    const photo = await jimp.read(req.file.buffer);
    await photo.resize(800, jimp.AUTO);
    await photo.write(`./public/uploads/${req.body.photo}`);

    next();
};

exports.createStore = async (req, res) => {
    const store = await (new Store(req.body)).save();
    req.flash('success', `Store ${store.name} created successfully please leave a review`)
    res.redirect(`/stores/${store.slug}`);
}

exports.getStores = async (req, res) => {
    const stores = await Store.find();
    res.render('stores', { title: 'Stores', stores})
}

exports.editStore = async (req, res) => {
    const store = await Store.findOne({ _id: req.params.id });

    res.render('editStore', { title: `${store.name}`, store })

   //TODO: Add verifcation for store oweners 
}

exports.updateStore = async (req, res) => {
    req.body.location.type = 'Point';

    const store = await Store.findOneAndUpdate({ _id: req.params.id}, req.body, {
        new: true,
        runValidators: true
    }).exec();

    req.flash('success', `Sucessfully updated ${store.name}, <a href="/stores/${store.slug}">View the store</a>`);
    res.redirect(`/stores/${store._id}/edit`);
}

exports.getStoreBySlug = async (req, res, next) => {
    //Query the db to see if there is a slug
    const store = await Store.findOne({slug: req.params.slug});
    //If there is null returned call next to send it to a not found
    if(!store) return next();
    console.log(store.photo)
    res.render('store', { store, title: store.name });

}