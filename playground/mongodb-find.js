const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect( 'mongodb://localhost:27017/TodoApp', (err, client) => {

    if(err) {
        console.log('Unable to connect to MongoDB server');
    }
    else {
        console.log('Connected to MongoDB server');

        const db = client.db('TodoApp');

        // fetch all
        // db.collection('Todos').find().toArray().then( (docs) => {
        //     console.log('Todos');
        //     console.log(JSON.stringify(docs,undefined,2));
        // }, err => {
        //     console.log('Unable to fetch todos', err);
        // });

        // fetch completed false and type 1 only
        // db.collection('Todos').find( {completed: false, type: 1} ).toArray().then( (docs) => {
        //     console.log('Todos');
        //     console.log(JSON.stringify(docs,undefined,2));
        // }, err => {
        //     console.log('Unable to fetch todos', err);
        // });

        // db.collection('Todos').find( {
        //     _id: new ObjectID('5bac92c940d60b20a4a8d07d')
        // } ).toArray().then( (docs) => {
        //     console.log('Todos');
        //     console.log(JSON.stringify(docs,undefined,2));
        // }, err => {
        //     console.log('Unable to fetch todos', err);
        // });

        // fetch the count
        // db.collection('Todos').find().count().then( (count) => {
        //     console.log(`Todos count: ${count}`);
        // }, err => {
        //     console.log('Unable to fetch todos', err);
        // });

        // fetch completed false and type 1 only
        db.collection('Users').find( {name: 'Morty'} ).toArray().then( (docs) => {
            console.log(JSON.stringify(docs,undefined,2));
        }, err => {
            console.log('Unable to fetch todos', err);
        });

        client.close();
    }
});