const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceId = process.env.TWILIO_SERViCE_ID;
const client = require('twilio')(accountSid, authToken);

module.exports = async function (countrycode, phonenumber, otp) {
    const verification = await client.verify.v2.services(serviceId)
                                        .verificationChecks
                                        .create({to: `+${countrycode}${phonenumber}`, code: otp });
    return verification;
}