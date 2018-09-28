const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect( 'mongodb://localhost:27017/TodoApp', (err, client) => {

    if(err) {
        console.log('Unable to connect to MongoDB server');
    }
    else {
        console.log('Connected to MongoDB server');

        const db = client.db('TodoApp');

        // delete many
        // db.collection('Todos').deleteMany({text: 'eat lunch'}).then( (result) => {
        //     console.log(result);
        // });

        // delete one
        // db.collection('Todos').deleteOne( {text: 'eat lunch'}).then( (result) => {
        //     console.log(result);
        // });

        // find one and delete
        // db.collection('Todos').findOneAndDelete({ completed: false }).then( (result) => {
        //     console.log(result);
        // });

        // 
        // db.collection('Users').deleteMany( {name: 'Morty'}).then( (result) => {
        //     console.log(result)
        // });

        db.collection('Users').findOneAndDelete({ 
            _id: new ObjectID('5baddfd37703fb23f9ea61ee')
        }).then( (result) => {
            console.log(result);
        });

        client.close();
    }
});