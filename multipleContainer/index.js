const express = require('express');
const redis = require('redis');

const app = express();
const client = redis.createClient();
client.set('visits', 0);

const port = 8081;

// the string visits in get op is actually 'key' in Redis db
app.get('/', (req, res) => {
    client.get('visits', (err, visits) => {
        res.send(`Number of visits is ${visits}`);
        client.set('visits', parseInt(visits) + 1);
    });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});