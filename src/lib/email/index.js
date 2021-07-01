import sgMail from "@sendgrid/mail";

export const sendEmail = async (recipientAddress) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: recipientAddress,
    from: process.env.SENDER_EMAIL,
    subject: "Hello from Strive",
    html: "<strong>You just made a new post!</strong>",
  };

  await sgMail.send(msg);
};
