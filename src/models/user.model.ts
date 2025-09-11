import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({// createdAt
  name: {
    type: String,
    required: [true, 'User Name is required'],
    trim: true,
    minlength: 2,
    maxlength: 50,
  },
  email: {
    type: String,
    required: [true, 'User Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'Please fill a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'User Password is required'],
    minLength: 6,
  }
}, { timestamps: true });

// userSchema.pre('save', async function (next) {
//   if(!this.isModified(this.password)) return next()
//     this.password = await bcrypt.hash(this.password, 10)
//   next()
//   
// })

const User = mongoose.model('User', userSchema);

export default User;