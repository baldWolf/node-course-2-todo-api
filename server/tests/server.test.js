const expect = require('expect');
const request = require('supertest');
const {app} = require ('./../server');
const {Todo} = require('./../models/todo');
const {user} = require('./../models/user');
const {ObjectID} = require('mongodb');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

// const todos = [ {
//     _id: new ObjectID(),
//     text: 'First todo'
// },{
//     _id: new ObjectID(),
//     text: 'Second todo',
//     completed: true,
//     completedAt: 333
// }]

// // clears the Todo database in mocha test
// beforeEach((done)=> {
//     Todo.remove({}).then( ()=> {
//         return Todo.insertMany( todos );
//     }).then( () => done()); 
// });

describe('POST/todos', () => {
    it('should create a new todo', (done)=> {
        var text = 'test todo';

        request(app)
        .post('/todos')
        .set('x-auth', users[0].tokens[0].token)
        .send( {
            text
        })
        .expect(200)
        .expect( (res) => {
            expect(res.body.text).toBe(text);
        })
        .end((err, res)=> {
            if (err){
                return done(err);
            }

            Todo.find({
                text
            }).then( (todos) => {
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            }).catch( (e) => {
                done(e);
            })
        });
    });

    it('should not create todo with invalid body data', (done)=> {
        request(app)
        .post('/todos')
        .set('x-auth', users[0].tokens[0].token)
        .send({})
        .expect(400)
        .end((err,res) => {
            if ( err ) {
                return done(err);
            }

            Todo.find().then((todos)=> {
                expect(todos.length).toBe(2);
                done();
            }).catch( (e) => {
                done(e);
            });
        });
    });
});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
        .get('/todos')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body.todos.length).toBe(1);
        })
        .end(done);
    });
});


describe('GET /todos/:id', ()=> {
    it('should return todo doc', (done) => {
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
            //console.log(res.body.text);
            expect(res.body.text).toBe(todos[0].text);
        })
        .end(done);
    });

    it('should not return todo doc created by other user', (done) => {
        request(app)
        .get(`/todos/${todos[1]._id.toHexString()}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done);
    });

    // it('should return 404 if todo found', (done)=> {
    //     request(app)
    //     .get(`/todos/5bb3626b6e3ada1d20fafc6a}`)
    //     .expect(404)
    //     .expect((res) => {
    //         expect(res.body).toEqual({});
    //     })
    //     .end(done);
    // });

    // it('should return 404 for non-object ids', (done)=> {
    //     request(app)
    //     .get(`/todos/1234}`)
    //     .expect(404)
    //     .expect((res) => {
    //         expect(res.body).toEqual({});
    //     })
    //     .end(done);
    // });

    it('should return 404 if todo found', (done)=> {
        var hexId = new ObjectID().toHexString();
        
        request(app)
        .get(`/todos/${hexId}}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done);
    });

    it('should return 404 for non-object ids', (done)=> {
        request(app)
        .get(`/todos/1234}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done);
    });
});


describe('DELETE /todos:id', () => {
    it('should remove a todo', (done) => {
        var hexId = todos[1]._id.toHexString();

        request(app)
        .delete(`/todos/${hexId}`)
        .set('x-auth', users[1].tokens[0].token)
        .expect(200)
        .expect( (res) => {
            //console.log(`body id ${res.body._id} `);
            expect(res.body.todo._id).toBe(hexId);
        })
        .end((err,res) => {
            if (err) {
                return done(err);
            }
            
            Todo.findById(hexId).then((todo) => {
                expect(todo).toBeFalsy();
                done();
            }).catch((e)=> {
                done(e);
            });
        });
    });

    it('should not remove a todo by other users', (done) => {
        var hexId = todos[0]._id.toHexString();

        request(app)
        .delete(`/todos/${hexId}`)
        .set('x-auth', users[1].tokens[0].token)
        .expect(404)
        .end((err,res) => {
            if (err) {
                return done(err);
            }
            
            Todo.findById(hexId).then((todo) => {
                expect(todo).toBeTruthy();
                done();
            }).catch((e)=> {
                done(e);
            });
        });
    });

    it('should return 404 if todo not found', (done) => {
        var hexId = new ObjectID().toHexString();

        request(app)
        .delete(`/todos/${hexId}`)
        .set('x-auth', users[1].tokens[0].token)
        .expect(404)
        .end(done);
    });

    it ('should return 404 if object id is invalid', (done) => {

        request(app)
        .get('/todos/1234}')
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done);
    });
});

describe('PATCH /todos/:id', () => {
    it('should update the todo',(done) => {
        // grab id of first item
        var hexId = todos[0]._id.toHexString();

        request(app)
        .patch(`/todos/${hexId}`)
        .set('x-auth', users[0].tokens[0].token)
        .send( { 
            text: 'Awesome Text',
            completed: true
        })
        .expect(200)
        .expect( (res) => {
            //console.log(res.body.todo);

            expect(res.body.todo.text).toBe('Awesome Text');
            expect(res.body.todo.completed).toBe(true);

            var completedAt = res.body.todo.completedAt;
            expect(typeof completedAt).toBe('number');
        })
        .end(done);
        // .end((err, res) => {
            
        //     if (err){
        //         return done(err);
        //     }

        //     Todo.findById(hexId).then((todo) => {
        //         expect(res.body.todo.text).toBe('Awesome Text');
        //         expect(res.body.todo.completed).toBe(true);
    
        //         var completedAt = res.body.todo.completedAt;
        //         expect(typeof completedAt).toBe('number');
        //         done();
        //     }).catch((e)=> {
        //         done(e);
        //     });

        //     //done();
        // })
    });

    it('should not update the todo by other user',(done) => {
        // grab id of first item
        var hexId = todos[1]._id.toHexString();

        request(app)
        .patch(`/todos/${hexId}`)
        .set('x-auth', users[0].tokens[0].token)
        .send( { 
            text: 'Awesome Text',
            completed: true
        })
        .expect(404)
        .end(done);
    });

    it('should clear completedAt when todo is not completed', (done) => {
        // grab id of second todo item
        // udpate text,, set completed to false 
        // 200
        // text is changed, completed false, completedAt is null

        var hexId = todos[1]._id.toHexString();

        request(app)
        .patch(`/todos/${hexId}`)
        .send( { 
            text: 'Awesome Text 2',
            completed: false
        })
        .set('x-auth', users[1].tokens[0].token)
        .expect(200)
        .expect( (res) => {
            expect(res.body.todo.text).toBe('Awesome Text 2');
            expect(res.body.todo.completed).toBe(false);

            var completedAt = res.body.todo.completedAt;
            expect(completedAt).toBeFalsy();
            // this seems not working
            //expect(completedAt).toNotExist();
        })
        .end(done);
        // .end((err, res) => {
            
        //     if (err){
        //         return done(err);
        //     }

        //     Todo.findById(hexId).then((todo) => {
        //         expect(res.body.todo.text).toBe('Awesome Text 2');
        //         expect(res.body.todo.completed).toBe(false);
    
        //         var completedAt = res.body.todo.completedAt;
        //         expect(completedAt).toBeFalsy();
        //         done();
        //     }).catch((e)=> {
        //         done(e);
        //     });
        //     //done();
        // })
    });
});

describe('GET /users/me', ()=> {
    it('should return user if authenticated', (done) => {
        request(app)
        .get('/users/me')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect( (res) => {
            expect(res.body._id).toBe(users[0]._id.toHexString());
            expect(res.body.email).toBe(users[0].email);
        })
        .end(done);
    });

    it ('should return 401 if not authenticated', (done) => {
        request(app)
        .get('/users/me')
        .expect(401)
        .expect( (res) => {
            expect(res.body).toEqual({});

        })
        .end(done);
    });
});

describe('POST /users', ()=> {
    it('should create a user', (done) => {
        var email = 'example@example.com';
        var password = '123afwefwefwafbc';

        request(app)
        .post('/users')
        .send({
            email,
            password
        })
        .expect(200)
        .expect((res) => {
            //expect(res.headers['x-auth']).toExist();
            //expect(res.body._id).toExist();
            expect(res.headers['x-auth']).toBeTruthy();
            expect(res.body._id).toBeTruthy();
            expect(res.body.email).toBe(email);
        })
        .end( (err) => {
            if (err) {
                return done(err);
            }

            user.findOne({email}).then( (current) => {
                expect(current).toBeTruthy();
                //expect(user.password).toNotBe(password);
                expect(user.password).not.toEqual(password);
                done();
            }).catch((e) => {
                done(e);
            });
        });
    });

    it('should return validation errors if request invalid', (done)=> {
        var email = 'example@example.com';
        var password = '123afwefwefwafbc';

        request(app)
        .post('/users')
        .send({
            email: 'and',
            password: '1243'
        })
        .expect(400)
        .end(done);
    });

    it('should not create user if email in use', (done) => {
        request(app)
        .post('/users')
        .send({
            email: users[0].email,
            password: users[0].password
        })
        .expect(400)
        .end(done);
    });
});

describe('POST /users/login', ()=> {
    it('should login user and return auth token', (done)=> {
        var email = users[1].email;
        var password = users[1].password;

        request(app)
        .post('/users/login')
        .send({
            email,
            password
        })
        .expect(200)
        .expect((res) => {
            //console.log(res);
            expect(res.headers['x-auth']).toBeTruthy();
        })
        .end( (err,res) => {
            if(err) {
                return done(err);
            }

            user.findById(users[1]._id).then((current) => {
                // expect(current.tokens[0]).toInclude({
                //     access: 'auth',
                //     token: res.headers['x-auth']
                // })

                expect(res.headers['x-auth']).toBeTruthy();
                done();
            }).catch((e) => {
                done(e);
            });
        });
    });

    it('should reject invalid login', (done) => {
        var email = users[1].email;
        var password = 'jeojerjnkodffjopsjpoejfpjpfjpjpoewja';
        request(app)
        .post('/users/login')
        .send({
            email,
            password
        })
        .expect(400)
        .end((err,res) => {
            if (err) {
                return done(err);
            }

            user.findById(users[1]._id).then((current) => {
                expect(current.tokens.length).toBe(1);
                done();
            }).catch((e) => {
                done(e);
            })
        });
    });
});

describe('DELETE /users/me/token', () => {
    it('should remove auth token on logout', (done) => {
        var tokens = users[0].tokens;

        request(app)
        .delete('/users/me/token')
        .set('x-auth', tokens[0].token )
        .expect(200)
        .end((err, res)=> {
            if (err) {
                return done(err);
            }
            
            user.findById(users[0]._id).then((current) => {
                expect(current.tokens.length).toBe(0);
                done();
            }).catch((e) => {
                done(e);
            })
        });
    });
});