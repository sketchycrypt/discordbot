const repeat = require('node-schedule');
const request = require('request');

module.exports = (client) => {

    let client_id = "2lehd18zwt2wzt9v0skno3n4uqwe80";
    let watching_ids = ["fazzc"];

    let check_stream_status = repeat.scheduleJob(
        '*/3 * * * * *',
        () => {
            watching_ids.forEach((twitch_id) => {
                request.get(
                    `https://api.twitch.tv/kraken/streams/${twitch_id}?client_id=${client_id}`,
                    (err, res, body) => {
                        if(err) console.log(err);
                        console.log(`RESPONSE! ${body}`);
                  }
                );
            });
        }
    );
}