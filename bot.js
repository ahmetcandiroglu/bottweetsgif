const Twit = require('twit');
const twit_config = require('./src/config').twit_config;

const gif = require('./src/gif');
const tweet = require('./src/tweet');

const T = new Twit(twit_config);

let user_stream = T.stream('user');
console.log("User stream has started\n----------------------");

user_stream.on('follow', followed);


function followed(event) {
    const screen_name = event.source.screen_name;

    console.log(`Dude, this guy @${screen_name} checking us!`);

    gif.random_gif("thanks")
        .then(gif_url => {
            return gif.download_gif(gif_url, "thanks");
        })
        .then(gif_location => {
            return tweet.upload_gif_to_twitter(T, gif_location);
        })
        .then( data => {
            let tweet_params = {
                status: `Hey @${screen_name}, how u doin? text me anytime #bottweetsgifs`,
                media_ids : [data.media_id_string],
            };

            return tweet.post_status(T, tweet_params);
        })
        .then(data => {
            console.log('Tweet has been posted..');
        })
        .catch(err => {
            console.log('An error occurred..');
        });

}

function tweet_random_number(){

    let number = Math.floor( Math.random() * 100 );

    const tweet_params = {
        status: number + " #bottweetsgifs"
    };

    tweet.post_status(T, tweet_params)
        .then(data => {
            console.log('Tweet has been posted..');
        })
        .catch(err => {
            console.log('Tweet could not posted!', err);
        });
}
