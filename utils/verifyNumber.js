import twilio from "twilio";

export const verifyNumber = number => {
  // Your AccountSID and Auth Token from console.twilio.com
  //   const accountSid = "ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
  //   const authToken = "your_auth_token";

  const client = twilio(
    process.env.TWILIO_LIVE_ACCOUNT_SID,
    process.env.TWILIO_ACCOUNT_AUTH_TOKEN
  );

  client.messages
    .create({
      body: "Please verify your phone number to proceed. Thank you!",
      to: number, // Text your number
      from: process.env.TWILIO_SENDER_NUMBER, // From a valid Twilio number
    })
    .then(message => console.log(message.sid));
};
