const sendGridMail = require('@sendgrid/mail');
sendGridMail.setApiKey("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");

function getMessage() {
  const body = 'This is a test email using SendGrid from Node.js';
  return {
    to: 'akshay.singhal@krishnacollege.ac.in',
    from: 'daphne.gulgowski94@ethereal.email',
    subject: 'Test email with Node.js and SendGrid',
    text: body,
    html: `<strong>${body}</strong>`,
  };
}

module.exports=async function sendEmail() {
  try {
    await sendGridMail.send(getMessage());
    console.log('Test email sent successfully');
  } catch (error) {
    console.error('Error sending test email');
    console.error(error);
    if (error.response) {
      console.error(error.response.body)
    }
  }
}