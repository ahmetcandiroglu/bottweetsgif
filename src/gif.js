const axios = require('axios');
const fs = require('fs');
const http = require('http');
const request = require('request');
const giphy_config = require('./config').giphy_config;

module.exports.search_gif = function(search_key, random, search_limit = 25) {

    return new Promise( (resolve, reject) => {
        console.log(`Searching for ${search_key} begins..`);

        const url = giphy_config.search_endpoint
            + giphy_config.api_key
            + "&q=" + search_key;

        axios.get(url)
            .then(response => {
                let index;
                if(random){
                    index  = Math.floor( Math.random() * search_limit);
                }
                else{
                    index = 0;
                }

                const gif_url = response.data.data[index].images.downsized.url;

                resolve(gif_url);
            })
            .catch(error => {
                reject(error);
            });
    });
};

module.exports.download_gif = function(gif_url, gif_name){

    return new Promise( (resolve, reject) => {
        const dest = giphy_config.gif_dest + gif_name + ".gif";

        request.head(gif_url, (err, res, body) => {

            request(gif_url)
                .pipe(fs.createWriteStream(dest))
                .on('close', () => { resolve(dest) });
        });
    });
};

module.exports.random_gif = function (tag) {

    return new Promise(function(resolve, reject) {

        console.log(`Finding a random gif under #${tag}..`);

        const url = giphy_config.random_endpoint
            + giphy_config.api_key
            + "&tag=" + tag;

        axios.get(url)
            .then(response => {
                const gif_url = response.data.data.fixed_height_downsampled_url;
                resolve(gif_url);
            })
            .catch(error => {
                reject(error);
            });
    });
};
