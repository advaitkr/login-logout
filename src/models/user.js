const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userSchema = new mongoose.Schema({
    name: {
    type:String,
    required:true,
    maxlength:32,
    trim:true
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
        trim: true,
        validate(value) {
            if( value.toLowerCase().includes('password')) {
                throw new Error('password musn\'t contain password')
            }
        }
    },phone: {                  
        type:String,
        required:true,
        minLength:10,
        maxLength:20,
        unique:true
      },
      address:{
        type:String,
        required:true,
        maxLength:150,
       },
      tokens: [{
        token: {
        type: String,
        required: true
          }
        }]

    },{
        timestamps: true
        })
        userSchema.methods.generateAuthToken = async function () {
            const user = this
            const token = jwt.sign({ _id: user._id.toString()}, process.env.JWT_SECRET)
            user.tokens = user.tokens.concat({token})
             await user.save()
             return token
        }
        userSchema.pre('save',async function(next){
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password,salt)
            next()
         })
        userSchema.statics.findByCredentials = async (password,phone) => {
            const user = await User.findOne({ phone })
            console.log(user)
            if (!user) {
                throw new Error('Unable to log in')
            }
            const isMatch = await bcrypt.compare(password, user.password)
            console.log(isMatch)
            if(!isMatch) {
                throw new Error('Unable to login')
            }
        
            return user
        }
        
        
const User = mongoose.model('User', userSchema)

module.exports = User