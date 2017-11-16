const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slugs = require('slugs');

const storeSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: 'Store is required...'
    },
    slug: String,
    description: {
        type: String,
        trim: true
    },
    tags: [String],
    created: {
        type: Date,
        default: Date.now
    },
    location: {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: [{
            type: Number,
            required: 'Coordinates are required'
        }],
        address: {
            type: String,
            required: 'You must supply an address'
        }
    },
    photo: String
});

storeSchema.pre('save', async function(next){
    if(!this.isModified('name')){
        next();
        return;
    }
    this.slug = slugs(this.name);

    const slugRexEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
    
    const storesWithSlug = await this.constructor.find({ slug: slugRexEx });
   
    console.log('Store with slug... ' + storesWithSlug + typeof(storesWithSlug));

    if(storesWithSlug.length) {
        this.slug = `${this.slug}-${storesWithSlug.length + 1}`;
    }

    next();
});

module.exports = mongoose.model('Store', storeSchema)