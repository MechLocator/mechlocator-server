import twilio from "twilio";

export const verifyNumber = number => {
  // Your AccountSID and Auth Token from console.twilio.com
  //   const accountSid = "ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
  //   const authToken = "your_auth_token";

  const client = twilio(
    process.env.TWILIO_ACCOUNT_TEST_SID,
    process.env.TWILIO_ACCOUNT_SECRET_KEY
  );

  client.messages
    .create({
      body: "Please verify your phone number to proceed. Thank you!",
      to: number, // Text your number
      from: "+12345678901", // From a valid Twilio number
    })
    .then(message => console.log(message.sid));
};
