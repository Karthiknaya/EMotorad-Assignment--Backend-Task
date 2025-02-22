const mongoose = require('mongoose');

// Define the schema for the Contact model
const contact_Schema = new mongoose.Schema({
  phoneNumber:
  { 
    type: String, 
    required: true 
  },  // Ensuring phoneNumber is required.
  email: 
  { 
    type: String, 
    required: true, 
  },  // Ensuring email is required.
  linkedId: 
  { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Contact' },  // Reference to another Contact
  linkPrecedence: 
  { 
    type: String, 
    enum: ['primary', 'secondary'], 
    default: 'primary' 
  },  // linkPrecedence
  createdAt: 
  { 
    type: Date, 
    default: Date.now 
  },
  // update time
  updatedAt: 
  { 
    type: Date, 
    default: Date.now 
  },
  deletedAt: 
  { 
    type: Date, 
    required: false
   }
});
 // update delete time by softDelete
contact_Schema.methods.softDelete = function(){
  this.deletedAt = Date.now();
  return this.save();
};

// Create and export the Contact model
const Contact = mongoose.model('Contact', contact_Schema);
module.exports = Contact;



