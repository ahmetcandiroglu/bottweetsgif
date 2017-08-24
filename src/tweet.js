const fs = require('fs');

module.exports.upload_gif_to_twitter = function (twit, gif_location) {

    return new Promise( (resolve, reject) => {
        console.log(`Uploading gif to twitter from [${gif_location}]`);

        const b64content = fs.readFileSync(gif_location, {encoding: 'base64'});

        twit.post(
            'media/upload',
            {media_data: b64content},
            (err, data, response) => {
                if(err){
                    reject(err);
                }
                else{
                    resolve(data);
                }
            });

    });
};

module.exports.post_status = function (twit, tweet_params) {
    return new Promise( (resolve, reject) => {

        twit.post(
            'statuses/update',
            tweet_params,
            (err, data, response) => {
                if(err){
                    reject(err);
                }
                else{
                    resolve(data);
                }
            });
    });
};
