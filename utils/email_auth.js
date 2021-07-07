const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.EMAILAPI);

const registration = async (email, username, pass, callback)=>{
  const msg = {
    to: email, // Change to your recipient
    from: process.env.ADMIN, // Change to your verified sender
    templateId: process.env.REG_AUTH_TEMPLATE,
    dynamic_template_data: {
      name: username,
      OTP:  pass,
    }
  }
  sgMail.send(msg, false)
    .then(() => {
      callback(undefined,"Success");
    })
    .catch((error) => {
      callback("error",error);
    })
}

const forgotPassword = async (email, username, pass, callback)=>{
  const msg = {
    to: email, // Change to your recipient
    from: process.env.ADMIN, // Change to your verified sender
    templateId: process.env.FORGOT_PASS_TEMPLATE,
    dynamic_template_data: {
      name: username,
      newpass:  pass,
    }
  }
  sgMail.send(msg, false)
    .then(() => {
      callback(undefined,"Success");
    })
    .catch((error) => {
      callback("error",error);
    })
}

// console.log(forgotPassword('poojan4004@gmail.com',"Poojan Patel","1321",(err,msg)=>{
//     console.log(msg)
// }));
// console.log(registration('poojan4004@gmail.com',"Poojan Patel","1321",(err,msg)=>{
//   console.log(msg)
// }));

module.exports = {
  registration,
  forgotPassword
}