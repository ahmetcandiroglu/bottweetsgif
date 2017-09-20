const Twit = require('twit');
const twit_config = require('./src/config').twit_config;

const gif = require('./src/gif');
const tweet = require('./src/tweet');

const T = new Twit(twit_config);

let user_stream = T.stream('user');
console.log("User stream has started..\n");
user_stream.on('follow', followed);

console.log("Daily gif stream has started..");
daily_trending_gif();
setInterval(daily_trending_gif, 1000*60*60*24);

function daily_trending_gif(){
    console.log('Posting today\'s gif..');

    tweet.get_trending_topic(T, {id: '23424977'})
        .then(response => {

            const isHashtag = response.topic.indexOf('#') > -1;
            let topic = response.topic.replace('#', '');

            console.log(`Trending topic of ${response.date} is '${response.topic}'\n`);
            topic = topic.charAt(0).toLowerCase() + topic.slice(1);
            topic = topic.replace( /([A-Z])/g, " $1" ).toLowerCase().split(' ').join('+');
            let date = response.date.split(' ').join('+');

            const gif_search_key = topic;// + '+' + date;
            console.log(gif_search_key);

            let tweet_status = `Today's gif #bottweetsgifs ${response.topic}`;

            post_tweet(gif_search_key, tweet_status, 'daily', false);

        });
}

function followed(event) {
    const screen_name = event.source.screen_name;
    console.log(`Dude, this guy @${screen_name} checking us!`);

    post_tweet('thanks', `Hey @${screen_name}, how u doin? text me anytime #bottweetsgifs`, 'thanks', true);
}

function post_tweet(gif_search_key, status, gif_file_name, random = false){
    gif.search_gif(gif_search_key, random)
    .then(gif_url => {
        return gif.download_gif(gif_url, gif_file_name);
    })
    .then(gif_location => {
        return tweet.upload_gif_to_twitter(T, gif_location);
    })
    .then( data => {
        let tweet_params = {
            status: status,
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
