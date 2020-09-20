const mongoose  = require('mongoose');

const tourSchema = mongoose.Schema({
     _id :  mongoose.Schema.Types.ObjectId,
    name:{
        type: String,
        required : true,
        unique: true,
        uppercase: true
    },
    price:{
        type: Number,
        required: false
    },
    ratingAverage:{
        type: Number,
        default: 4.5
    },
    durations:{
        type: Number,
        required:[true, 'A tour must have duration']
    },
    maxGroupSize:{
        type: Number,
        required:[true, 'A tour must have maximum Size'],
        min:[1,'hkhkhkh'],
        max:[100,'hhjkhkhk']
    },
    difficulty:{
        type: String,
        required: true,
        enum:{
      values:  ['easy', 'medium', 'hard'],
      message: 'Should be one of these'
        }
    },
    ratingQuantity:{
        type: Number,
        default: 0
    },
    discount:{
        type: Number,
        required: false,
        validate:{
            validator:  function(val){
                return val < this.price;
             },
             message: 'price always greater that discount'
        }
    },
    summary:{
         type: String,
         trim: true,
         maxlength:[40, 'jhhkhkhk'],
         minlength:[10, 'hkhkhkh']
    },
    description:{
        type: String,
        trim: true
    },
    imageCover:{
        type: String,
    },
    images:[String],
    createdAt:{
        type: Date,
        default: Date.now()
    },
    startDates:[Date],
    secretTour:{
        type: Boolean,
        default: false
    }

},{
 toJSON: { virtuals: true },
 toObjct: { virtuals: true }
});

tourSchema.virtual('durationWeeks').get(function(){
    return this.durations / 7 ;
})

tourSchema.pre(/^find/, function(next) {
    this.find({ secretTour:{ $ne: true} });
    next();
});

tourSchema.pre('aggregate', function(next){
    this.pipeline().unshift({ $match: {secretTour: {$ne: true}} });
    next();
})
const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;