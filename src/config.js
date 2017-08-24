const twit_config = {
    consumer_key: '..',
    consumer_secret: '..',
    access_token: '..',
    access_token_secret: '..',
};

const giphy_config = {
    api_key : "..",
    search_endpoint : "https://api.giphy.com/v1/gifs/search?api_key=",
    random_endpoint : "https://api.giphy.com/v1/gifs/random?api_key=",
    gif_dest : "media/",
};

module.exports = {
    twit_config : twit_config,
    giphy_config : giphy_config
};
