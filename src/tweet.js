const fs = require('fs');
const months = ['january', 'february', 'march', 'april', 'may', 'june',
 'july', 'august', 'september', 'october', 'november' , 'december'];

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
            }
        );
    });
};

module.exports.get_trending_topic = function (twit, tweet_params) {
    return new Promise( (resolve, reject) => {

        twit.get(
            'trends/place',
            tweet_params,
            (err, data, response) => {
                if(err){
                    reject(err);
                }
                else{
                    const most_popular_topic = data[0].trends[0].name.replace('#', '');
                    let date = data[0].created_at.split('T')[0];

                    date = date.split('-');
                    date = date[2] + ' ' + months[parseInt(date[1])-1];
                    resolve({
                        date: date,
                        topic: most_popular_topic
                    });
                }
            }
        );
    });
};
