const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect( 'mongodb://localhost:27017/TodoApp', (err, client) => {

    if(err) {
        console.log('Unable to connect to MongoDB server');
    }
    else {
        console.log('Connected to MongoDB server');

        const db = client.db('TodoApp');

        // db.collection('Todos').findOneAndUpdate( {
        //     _id: new ObjectID('5badd0367703fb23f9ea5ff0')
        // }, {
        //     $set: {
        //         completed: true
        //     }
        // }, {
        //     returnOriginal: false
        // }).then( (result) => {
        //     console.log(result);
        // });

        //5bac949610a0982900dc5d49
        db.collection('Users').findOneAndUpdate( {
            _id: new ObjectID('5bac949610a0982900dc5d49')
        }, {
            $set: {
                name: 'lowolfne'
            },
            $inc: {
                age: 1
            }
        }, {
            returnOriginal: false
        }).then( (result) => {
            console.log(result);
        });
        client.close();
    }
});