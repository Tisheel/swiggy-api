const client = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_TOKEN)

const sendMessage = async (to, body) => {
     client.messages
        .create({
            body,
            from: '+13159291952',
            to
        })
        .then(message => console.log(message.sid))
}

module.exports = sendMessage