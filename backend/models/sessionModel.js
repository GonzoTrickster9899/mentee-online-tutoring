import mongoose from "mongoose"

const sessionSchema = new mongoose.Schema({
    userId:{type:String, required:true},
    tutId:{type:String, required:true},
    slotDate:{type:String, required:true},
    slotTime:{type:String, required:true},
    userData:{type:Object, required:true},
    tutData:{type:Object, required:true},
    amount:{type:Number, required:true},
    amountMinor:{type:Number, min:0},
    currency:{type:String, lowercase:true, trim:true},
    date:{type:Number, required:true},
    cancelled:{type:Boolean, default:false},
    cancelledAt:{type:Date},
    cancelledBy:{type:String, enum:["student", "tutor", "admin"]},
    payment:{type:Boolean, default:false},
    paymentStatus:{
        type:String,
        enum:["unpaid", "checkout_creating", "checkout_created", "paid", "failed", "expired", "cancelled", "legacy_paid_unverified"],
        default:"unpaid",
    },
    activeSlotKey:{type:String},
    stripeCheckoutSessionId:{type:String},
    stripePaymentIntentId:{type:String},
    checkoutAttempt:{type:Number, default:0},
    processedStripeEventIds:{type:[String], default:[]},
    isCompleted:{type:Boolean, default:false},
})

// A session is the source of truth for availability. This partial unique index allows historical
// cancelled sessions while guaranteeing one active reservation per tutor/date/time combination.
sessionSchema.index(
    {tutId:1, activeSlotKey:1},
    {unique:true, partialFilterExpression:{cancelled:false, activeSlotKey:{$type:"string"}}}
)
sessionSchema.index({stripeCheckoutSessionId:1}, {unique:true, sparse:true})

const sessionModel = mongoose.models.session || mongoose.model("session", sessionSchema)

export default sessionModel
