const mongoose = require('mongoose');
const redis = require('redis');
const url = 'redis://127.0.0.1:6379';
const util = require('util');
const client = redis.createClient(url);

client.get = util.promisify(client.get);

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function(){
    this.cacheValue = true;
}


mongoose.Query.prototype.exec = async function () {

    if(!this.cacheValue){
        exec.apply(this, arguments)
    }

    const key = Object.assign({}, this.getQuery(),{collection : this.mongooseCollection.name});

    const result = await client.get(key);

    if(result){

        const doc = JSON.parse(result);

        Array.isArray(doc)
        ? result.map((data) => new this.model(d)) : new model(doc);
    }

    const res = exec.apply(this, arguments);

    client.set(key, JSON.stringify(res));

    return res;
}

















// const redis = require('redis');
// const util = require('util');
// const redisUrl = "redis://127.0.0.1:6379"
// const client = redis.createClient(redisUrl);
// const {googleId} = req.user;
//
// client.get = util.promisify(client.get);
//
//
// let notes = await client.get(googleId);
//
// if(notes){
//     console.log('Sending from cache')
//     res.send(JSON.parse(notes));
// }else{
//
//     client.set(googleId, JSON.stringify(notes));
//
// }

