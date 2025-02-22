const express = require('express');
const mongoose = require('mongoose');
const Contact = require('./Model/Contact');

const app = express();
app.use(express.json());
// Connecting to MongoDB
mongoose.connect('mongodb://localhost:27017/contactdb');

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>{
  console.log(`Server is running on port ${PORT}`);
});

app.post('/identify', async(req,res) =>{
  try{
    //get the email and number from the body request
    const {email, phoneNumber} = req.body;

    // check is there a valid email and phone number is provided
    if(!email && !phoneNumber){
      return res.status(400).json({ error: 'Email or phone number is required' });
    }
    //check whether atleast one from phone or email is there is database
    let contact = await Contact.findOne({ $or:[{ email }, { phoneNumber }]});
    // if not found then create a new query
    if(!contact){
      contact = new Contact({ email, phoneNumber, linkPrecedence: 'primary' });
      await contact.save();
      return res.status(200).json({
        primaryContactId: contact._id,
        emails: [contact.email],
        phoneNumbers: [contact.phoneNumber],
        secondaryContactIds: []
      });
    }
     // if one of the collection from database is matched with  the email or the number then get the primary root database
    let primaryContact = contact.linkPrecedence === 'primary' ? contact : await Contact.findById(contact.linkedId);
    // to get all the secondary collections of the primary contact
    let secondaryContact = await Contact.find({ linkedId: primaryContact._id, linkPrecedence: 'secondary'});
   //compare if any one of the parameter is equal to the user input values then create a new collection
    if((email && email !== primaryContact.email) || (phoneNumber && phoneNumber !== primaryContact.phoneNumber)){
      let newContact = new Contact({
        email: email !== primaryContact.email ? email : primaryContact.email,
        phoneNumber: phoneNumber !== primaryContact.phoneNumber ? phoneNumber : primaryContact.phoneNumber,
        linkedId: primaryContact._id,
        linkPrecedence: 'secondary'
      });
      await newContact.save();
      secondaryContact.push(newContact);
    }
    //to show the result get all the email phone numbers and secondary ids to display
    let emails = [primaryContact.email, ...secondaryContact.map(sc => sc.email)].filter(Boolean);
    let phoneNumbers = [primaryContact.phoneNumber, ...secondaryContact.map(sc => sc.phoneNumber)].filter(Boolean);
    let secondaryContactIds = secondaryContact.map(sc => sc._id);
    // send the result
    res.status(200).json({
      primaryContactId: primaryContact._id,
      emails,
      phoneNumbers,
      secondaryContactIds
    });
  }catch(error){
    // send the error message
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing the request'});
  }
});
//creating a new route for deleting the contact
// usiing softdelete method to update the delete time and not to remove from database
app.delete('/contact/:id', async (req, res) =>{
    // take the id through the request address parameter
    const {id} = req.params;
    try{
      // Find the contact using the id
      const contact = await Contact.findById(id);
      if(!contact){
        //if contact is not found in database then send error 
        return res.status(404).json({ message: 'Contact is not available' });
      }
      // Soft delete the contact from database
      await contact.softDelete();
      // send the succesfull message
      res.status(200).json({ message: 'Contact soft deleted successfully' });
    }catch(error){
        // else send error message
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

