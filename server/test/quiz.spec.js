process.env.NODE_ENV = 'test';

const Users = require('../src/models/users.model')
const Quizzes = require('../src/models/quizzes.model')
const Questions = require('../src/models/questions.model')

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app')
const { describe, it } = require('mocha')

const should = chai.should();
chai.use(chaiHttp);


describe('/quiz', () => {

  // remove the users
  before((done) => {
    Users.deleteMany({}, (err) => {
      done();
    })
  });

  // remove the quizzes
  before((done) => {
    Quizzes.deleteMany({}, (err) => {
      done();
    })
  });

  // remove the questions
  before((done) => {
    Questions.deleteMany({}, (err) => {
      done();
    })
  });

  describe('Publish quiz', () => {

    // add a new user
    let authToken = ''
    before((done) => {
      chai.request(app)
        .post('/auth/register')
        .send({
          firstname: "James",
          lastname: "Doe",
          email: "james.doe@example.com",
          password: "1#James",
          cpassword: "1#James"
        })
        .end((err, res) => {
          authToken = res.body.data.authToken
          done()
        })
    })

    it('it should return authentication error', (done) => {
      chai.request(app)
        .post('/quiz')
        .send({})
        .end((err, res) => {
          res.should.have.status(401);
          res.type.should.equal('application/json');
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.should.equal('Unauthorized')
          done()
        })
    })

    describe('Validation', () => {

      it('it should return validation errors', (done) => {
        let quiz = {
          title: "",
          questions: []
        }

        chai.request(app)
          .post('/quiz')
          .set('Authorization', `Bearer ${authToken}`)
          .send(quiz)
          .end((err, res) => {
            res.should.have.status(400);
            res.type.should.equal('application/json');
            res.body.should.be.a('object');
            res.body.should.have.property('message');
            res.body.message.should.equal('Invalid fields')
            res.body.should.have.property('errors')
            res.body.errors.should.have.property('title')
            res.body.errors.title[0].should.equal('Please provide a title for this quiz.')
            res.body.errors.should.have.property('questions')
            res.body.errors.questions[0].should.equal('Please add atleast one question.')
            done()
          })
      })

      describe('Questions', () => {

        it('it should return invalid question validation error ', (done) => {
          let quiz = {
            title: "Sample Quiz",
            questions: [{}]
          }

          chai.request(app)
            .post('/quiz')
            .set('Authorization', `Bearer ${authToken}`)
            .send(quiz)
            .end((err, res) => {
              res.should.have.status(400);
              res.type.should.equal('application/json');
              res.body.should.be.a('object');
              res.body.should.have.property('message');
              res.body.message.should.equal('Invalid fields')
              res.body.should.have.property('errors')
              res.body.errors.should.have.property('questions')
              res.body.errors.questions[0].should.equal('There is an invalid question.')
              done()
            })
        })

        it('it should return invalid question type validation error ', (done) => {
          let quiz = {
            title: "Sample Quiz",
            questions: [
              {
                order: 1,
                type: "multiples",
                question: "Question 2",
                answers: []
              }
            ]
          }

          chai.request(app)
            .post('/quiz')
            .set('Authorization', `Bearer ${authToken}`)
            .send(quiz)
            .end((err, res) => {
              res.should.have.status(400);
              res.type.should.equal('application/json');
              res.body.should.be.a('object');
              res.body.should.have.property('message');
              res.body.message.should.equal('Invalid fields')
              res.body.should.have.property('errors')
              res.body.errors.should.have.property('questions')
              res.body.errors.questions[0].should.equal('Question type can only be single or multiple.')
              done()
            })
        })

        it('it should return question text error', (done) => {
          let quiz = {
            title: "Sample Quiz",
            questions: [
              {
                order: 1,
                type: "multiple",
                question: "",
                answers: []
              }
            ]
          }

          chai.request(app)
            .post('/quiz')
            .set('Authorization', `Bearer ${authToken}`)
            .send(quiz)
            .end((err, res) => {
              res.should.have.status(400);
              res.type.should.equal('application/json');
              res.body.should.be.a('object');
              res.body.should.have.property('message');
              res.body.message.should.equal('Invalid fields')
              res.body.should.have.property('errors')
              res.body.errors.should.have.property('questions')
              res.body.errors.questions[0].should.equal('Question text cannot be empty.')
              done()
            })
        })

      })

      describe('Answers', () => {

        it('it should validate the length of answers provided for a question', (done) => {
          let quiz = {
            title: "Sample Quiz",
            questions: [
              {
                order: 1,
                type: "single",
                question: "Question 1",
                answers: []
              }
            ]
          }

          chai.request(app)
            .post('/quiz')
            .set('Authorization', `Bearer ${authToken}`)
            .send(quiz)
            .end((err, res) => {
              res.should.have.status(400);
              res.type.should.equal('application/json');
              res.body.should.be.a('object');
              res.body.should.have.property('message');
              res.body.message.should.equal('Invalid fields')
              res.body.should.have.property('errors')
              res.body.errors.should.have.property('questions')
              res.body.errors.questions[0].should.equal('Please add atleast one question answer.')
              done()
            })
        })

        it('it should check answers for atleast one valid answer', (done) => {
          let quiz = {
            title: "Sample Quiz",
            questions: [
              {
                order: 1,
                type: "single",
                question: "Question 1",
                answers: [
                  {
                    option: "option 1",
                    isAnswer: false
                  },
                  {
                    option: "option 2",
                    isAnswer: false
                  }
                ]
              }
            ]
          }

          chai.request(app)
            .post('/quiz')
            .set('Authorization', `Bearer ${authToken}`)
            .send(quiz)
            .end((err, res) => {
              res.should.have.status(400);
              res.type.should.equal('application/json');
              res.body.should.be.a('object');
              res.body.should.have.property('message');
              res.body.message.should.equal('Invalid fields')
              res.body.should.have.property('errors')
              res.body.errors.should.have.property('questions')
              res.body.errors.questions[0].should.equal('Question must have a valid answer.')
              done()
            })
        })

        it('it should validate answers with single question type', (done) => {
          let quiz = {
            title: "Sample Quiz",
            questions: [
              {
                order: 1,
                type: "single",
                question: "Question 1",
                answers: [
                  {
                    option: "option 1",
                    isAnswer: true
                  },
                  {
                    option: "option 2",
                    isAnswer: true
                  }
                ]
              }
            ]
          }

          chai.request(app)
            .post('/quiz')
            .set('Authorization', `Bearer ${authToken}`)
            .send(quiz)
            .end((err, res) => {
              res.should.have.status(400);
              res.type.should.equal('application/json');
              res.body.should.be.a('object');
              res.body.should.have.property('message');
              res.body.message.should.equal('Invalid fields')
              res.body.should.have.property('errors')
              res.body.errors.should.have.property('questions')
              res.body.errors.questions[0].should.equal('Single question type can only have one valid answer.')
              done()
            })
        })

        it('it should validate answers with multiple question type', (done) => {
          let quiz = {
            title: "Sample Quiz",
            questions: [
              {
                order: 1,
                type: "multiple",
                question: "Question 1",
                answers: [
                  {
                    option: "option 1",
                    isAnswer: true
                  },
                  {
                    option: "option 2",
                    isAnswer: false
                  },
                  {
                    option: "option 3",
                    isAnswer: false
                  }
                ]
              }
            ]
          }

          chai.request(app)
            .post('/quiz')
            .set('Authorization', `Bearer ${authToken}`)
            .send(quiz)
            .end((err, res) => {
              res.should.have.status(400);
              res.type.should.equal('application/json');
              res.body.should.be.a('object');
              res.body.should.have.property('message');
              res.body.message.should.equal('Invalid fields')
              res.body.should.have.property('errors')
              res.body.errors.should.have.property('questions')
              res.body.errors.questions[0].should.equal('Multiple question type must have more than one valid answer.')
              done()
            })
        })

      })

    })

    describe('Success', () => {

      it('it should successfully create a quiz', (done) => {
        let quiz = {
          title: "Sample Quiz",
          questions: [
            {
              order: 1,
              type: "single",
              question: "Question 1",
              answers: [
                {
                  option: "option 1",
                  isAnswer: true
                },
                {
                  option: "option 2",
                  isAnswer: false
                },
                {
                  option: "option 3",
                  isAnswer: false
                }
              ]
            }
          ]
        }

        chai.request(app)
          .post('/quiz')
          .set('Authorization', `Bearer ${authToken}`)
          .send(quiz)
          .end((err, res) => {
            res.should.have.status(200)
            res.type.should.equal('application/json')
            res.body.should.be.a('object')
            res.body.should.have.property('message')
            res.body.message.should.equal('Quiz published.')
            res.body.data.should.have.property('quiz')
            res.body.data.quiz.should.be.a('object')
            res.body.data.quiz.should.have.property('id')
            res.body.data.quiz.should.have.property('title')
            res.body.data.quiz.should.have.property('permalink')
            res.body.data.quiz.should.have.property('attempt')
            res.body.data.quiz.should.have.property('created')
            done()
          })
      })

    })

    // remove the users
    after((done) => {
      Users.deleteMany({}, (err) => {
        done();
      })
    });

    // remove the quizzes
    after((done) => {
      Quizzes.deleteMany({}, (err) => {
        done();
      })
    });

    // remove the questions
    after((done) => {
      Questions.deleteMany({}, (err) => {
        done();
      })
    });

  })

  describe('List user quiz', () => {

    // add a new user
    let authToken = ''
    before((done) => {
      chai.request(app)
        .post('/auth/register')
        .send({
          firstname: "James",
          lastname: "Doe",
          email: "james.doe@example.com",
          password: "1#James",
          cpassword: "1#James"
        })
        .end((err, res) => {
          authToken = res.body.data.authToken
          done()
        })
    })

    // add a quiz
    let id = ''
    before((done) => {
      chai.request(app)
        .post('/quiz')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: "Sample Quiz",
          questions: [
            {
              order: 1,
              type: "single",
              question: "Question 1",
              answers: [
                {
                  option: "option 1",
                  isAnswer: true
                },
                {
                  option: "option 2",
                  isAnswer: false
                },
                {
                  option: "option 3",
                  isAnswer: false
                }
              ]
            },
            {
              order: 1,
              type: "single",
              question: "Question 2",
              answers: [
                {
                  option: "option 1",
                  isAnswer: true
                },
                {
                  option: "option 2",
                  isAnswer: false
                },
                {
                  option: "option 3",
                  isAnswer: false
                }
              ]
            }
          ]
        })
        .end((err, res) => {
          id = res.body.data.quiz.id
          done()
        })
    })

    it('it should return authentication error', (done) => {
      chai.request(app)
        .get('/quiz/list')
        .end((err, res) => {
          res.should.have.status(401);
          res.type.should.equal('application/json');
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.message.should.equal('Unauthorized')
          done()
        })
    })

    it('it should list user quizzes', (done) => {
      chai.request(app)
        .get('/quiz/list')
        .set('Authorization', `Bearer ${authToken}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.type.should.equal('application/json');
          res.body.should.be.a('object');
          res.body.should.have.property('message')
          res.body.message.should.equal('User quizzes.')
          res.body.should.have.property('data')
          res.body.data.should.have.property('list')
          res.body.data.list.should.be.a('array')
          res.body.data.list[0].should.have.property('questions')
          res.body.data.list[0].questions.should.be.a('array')
          res.body.data.list[0].questions[0].should.have.property('order')
          res.body.data.list[0].questions[0].should.have.property('type')
          res.body.data.list[0].questions[0].should.have.property('question')
          res.body.data.list[0].questions[0].should.have.property('answers')
          done()
        })
    })

    describe('Delete quiz', () => {

      it('it should return invalid quiz id', (done) => {
        chai.request(app)
          .delete('/quiz/123456')
          .end((err, res) => {
            res.should.have.status(400);
            res.type.should.equal('application/json');
            res.body.should.be.a('object');
            res.body.should.have.property('message')
            res.body.message.should.equal('Invalid quiz id.')
            done()
          })
      })

      it('it should return invalid quiz id', (done) => {
        chai.request(app)
          .delete('/quiz/62d5da6ba72561ff1aa2c0ba')
          .end((err, res) => {
            res.should.have.status(400);
            res.type.should.equal('application/json');
            res.body.should.be.a('object');
            res.body.should.have.property('message')
            res.body.message.should.equal('Quiz with id does not exist.')
            done()
          })
      })

      it('it should delete quiz with quiz id', (done) => {
        chai.request(app)
          .delete('/quiz/' + id)
          .end((err, res) => {
            res.should.have.status(200);
            res.type.should.equal('application/json');
            res.body.should.be.a('object');
            res.body.should.have.property('message')
            res.body.message.should.equal('Quiz deleted.')
            done()
          })
      })

    })

    // remove the users
    after((done) => {
      Users.deleteMany({}, (err) => {
        done();
      })
    });

    // remove the quizzes
    after((done) => {
      Quizzes.deleteMany({}, (err) => {
        done();
      })
    });

    // remove the questions
    after((done) => {
      Questions.deleteMany({}, (err) => {
        done();
      })
    });
  })

  describe('Get quizzes', () => {

    // add a new user
    let authToken = ''
    before((done) => {
      chai.request(app)
        .post('/auth/register')
        .send({
          firstname: "James",
          lastname: "Doe",
          email: "james.doe@example.com",
          password: "1#James",
          cpassword: "1#James"
        })
        .end((err, res) => {
          authToken = res.body.data.authToken
          done()
        })
    })

    // add a quiz
    let permalink = ''
    before((done) => {
      chai.request(app)
        .post('/quiz')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: "Sample Quiz",
          questions: [
            {
              order: 1,
              type: "single",
              question: "Question 1",
              answers: [
                {
                  option: "option 1",
                  isAnswer: true
                },
                {
                  option: "option 2",
                  isAnswer: false
                },
                {
                  option: "option 3",
                  isAnswer: false
                }
              ]
            },
            {
              order: 1,
              type: "single",
              question: "Question 2",
              answers: [
                {
                  option: "option 1",
                  isAnswer: true
                },
                {
                  option: "option 2",
                  isAnswer: false
                },
                {
                  option: "option 3",
                  isAnswer: false
                }
              ]
            }
          ]
        })
        .end((err, res) => {
          permalink = res.body.data.quiz.permalink
          done()
        })
    })

    // add another quiz
    before((done) => {
      chai.request(app)
        .post('/quiz')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: "Sample Quiz 2",
          questions: [
            {
              order: 1,
              type: "single",
              question: "Question 1",
              answers: [
                {
                  option: "option 1",
                  isAnswer: true
                },
                {
                  option: "option 2",
                  isAnswer: false
                },
                {
                  option: "option 3",
                  isAnswer: false
                }
              ]
            },
            {
              order: 1,
              type: "single",
              question: "Question 2",
              answers: [
                {
                  option: "option 1",
                  isAnswer: true
                },
                {
                  option: "option 2",
                  isAnswer: false
                },
                {
                  option: "option 3",
                  isAnswer: false
                }
              ]
            }
          ]
        })
        .end((err, res) => {
          done()
        })
    })

    it('it should get all quizzes', (done) => {
      chai.request(app)
        .get('/quiz')
        .end((err, res) => {
          res.should.have.status(200);
          res.type.should.equal('application/json');
          res.body.should.be.a('object');
          res.body.should.have.property('message')
          res.body.message.should.equal('All quizzes.')
          res.body.should.have.property('data')
          res.body.data.should.have.property('list')
          res.body.data.list.should.be.a('array')
          res.body.data.list[0].should.have.property('questions')
          res.body.data.list[0].questions.should.be.a('array')
          res.body.data.list[0].questions[0].should.have.property('order')
          res.body.data.list[0].questions[0].should.have.property('type')
          res.body.data.list[0].questions[0].should.have.property('question')
          res.body.data.list[0].questions[0].should.have.property('answers')
          done()
        })
    })

    it('it should return invalid quiz permalink', (done) => {
      chai.request(app)
        .get('/quiz/123456')
        .end((err, res) => {
          res.should.have.status(400);
          res.type.should.equal('application/json');
          res.body.should.be.a('object');
          res.body.should.have.property('message')
          res.body.message.should.equal('Invalid quiz link.')
          done()
        })
    })

    // remove the users
    after((done) => {
      Users.deleteMany({}, (err) => {
        done();
      })
    });

    // remove the quizzes
    after((done) => {
      Quizzes.deleteMany({}, (err) => {
        done();
      })
    });

    // remove the questions
    after((done) => {
      Questions.deleteMany({}, (err) => {
        done();
      })
    });
  })

})

