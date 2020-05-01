const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'ahlesswywk@gmail.com',
    subject: 'Thanks for joining in!',
    text: `Welcome to the app, ${name}. Let me know how you get along with the app`,
  });
};

const sendCancellationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'ahlesswywk@gmail.com',
    subject: 'Sorry to see you go!',
    text: `Goodbye ${name}, I hope to see you back sometime soon. Also, please let us know what we can go to improve the app`,
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancellationEmail,
};
