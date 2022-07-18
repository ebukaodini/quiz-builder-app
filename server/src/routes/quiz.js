const express = require('express')
const router = express.Router()
const { body, param, validationResult } = require('express-validator')
const randomstring = require("random-string-gen")
const Quizzes = require('../models/quizzes.model')
const Questions = require('../models/questions.model')
const authenticateToken = require('../utils/authenticateToken')
const mergeValidationErrors = require('../utils/mergeValidationErrors')

router.post('/',
  body('title', 'Please provide a title for this quiz.')
    .trim()
    .isLength({ min: 1 }),
  body('questions')
    .custom(async questions => {
      if (questions.length === 0)
        return Promise.reject('Please add atleast one question.')

      if (questions.every(question => {
        const keys = Object.keys(question)
        return keys.includes('order') && keys.includes('type') && keys.includes('question') && keys.includes('answers')
      }) == false)
        return Promise.reject('There is an invalid question.')

      if (questions.every(question => {
        return question.type === 'single' || question.type === 'multiple'
      }) == false)
        return Promise.reject('Question type can only be single or multiple.')

      if (questions.every(question => {
        return question.question.length > 0
      }) == false)
        return Promise.reject('Question text cannot be empty.')

      if (questions.every(question => {
        return question.answers.length > 0
      }) == false)
        return Promise.reject('Please add atleast one question answer.')

      if (questions.every(question => {
        return question.answers.filter(a => a.isAnswer === true).length > 0
      }) == false)
        return Promise.reject('Question must have a valid answer.')

      if (questions.every(question => {
        if (question.type === 'single')
          return question.answers.filter(a => a.isAnswer === true).length === 1
        return true
      }) == false)
        return Promise.reject('Single question type can only have one valid answer.')

      if (questions.every(question => {
        if (question.type === 'multiple')
          return question.answers.filter(a => a.isAnswer === true).length > 1
        return true
      }) == false)
        return Promise.reject('Multiple question type must have more than one valid answer.')

    }),
  authenticateToken,
  async (req, res, next) => {
    try {

      const errors = validationResult(req).array();
      if (errors.length > 0)
        return res.error('Invalid fields', mergeValidationErrors(errors))

      const { title, questions } = req.body

      let permalink = randomstring({ length: 6, type: 'alphanumeric', capitalization: 'lowercase' })
      while (await Quizzes.findOne({ permalink: permalink }) !== null) {
        permalink = randomstring({ length: 6, type: 'alphanumeric', capitalization: 'lowercase' })
      }

      Quizzes.create({
        user: req.user, title, permalink
      }).then(async quiz => {

        const { title, permalink, attempt, created, _id: id } = quiz

        // add quiz questions
        const updatedQuestions = questions.map(question => ({ ...question, quiz: quiz._id }))
        await Questions.insertMany([...updatedQuestions])

        return res.success('Quiz published.', { quiz: { title, permalink, attempt, created, id } })
      })

    } catch (error) {
      next(error)
    }
  })

router.get('/list',
  authenticateToken,
  async (req, res, next) => {
    try {

      Quizzes.find({
        user: req.user
      }).then(async quizzes => {

        const formattedQuizzes = quizzes.map(quiz => {
          const { title, permalink, attempt, created, _id: id } = quiz
          return { title, permalink, attempt, created, id }
        })

        const quizIds = formattedQuizzes.map(quiz => quiz.id.toString())

        // get all questions related to quiz
        let quizWithQuestions = []
        await Questions
          .find({
            quiz: { $in: [...quizIds] }
          }).then(questions => {
            if (questions !== null) {
              formattedQuizzes.forEach(quiz => {
                const quizQuestions = questions.filter(question =>
                  question.quiz.toString() === quiz.id.toString()
                ).sort((a, b) => a.order > b.order)

                const formattedQuestions = quizQuestions.map(ques => {
                  const { order, type, question, answers } = ques
                  formattedAnswers = answers.map(ans => {
                    const { option, isAnswer } = ans
                    return { option, isAnswer }
                  })
                  return { order, type, question, answers: formattedAnswers }
                })

                quizWithQuestions.push({
                  ...quiz,
                  questions: formattedQuestions
                })
              })
            } else
              quizWithQuestions = quiz
          })

        return res.success('User quizzes.', { list: quizWithQuestions })
      })

    } catch (error) {
      next(error)
    }
  })

router.get('/',
  async (req, res, next) => {
    try {

      Quizzes.find()
        .then(async quizzes => {

          const formattedQuizzes = quizzes.map(quiz => {
            const { title, permalink, attempt, created, _id: id } = quiz
            return { title, permalink, attempt, created, id }
          })

          const quizIds = formattedQuizzes.map(quiz => quiz.id.toString())

          // get all questions related to quiz
          let quizWithQuestions = []
          await Questions
            .find({
              quiz: { $in: [...quizIds] }
            }).then(questions => {
              if (questions !== null) {
                formattedQuizzes.forEach(quiz => {
                  const quizQuestions = questions.filter(question =>
                    question.quiz.toString() === quiz.id.toString()
                  ).sort((a, b) => a.order > b.order)

                  const formattedQuestions = quizQuestions.map(ques => {
                    const { order, type, question, answers } = ques
                    formattedAnswers = answers.map(ans => {
                      const { option, isAnswer } = ans
                      return { option, isAnswer }
                    })
                    return { order, type, question, answers: formattedAnswers }
                  })

                  quizWithQuestions.push({
                    ...quiz,
                    questions: formattedQuestions
                  })
                })
              } else
                quizWithQuestions = quiz
            })

          return res.success('All quizzes.', { list: quizWithQuestions })
        })

    } catch (error) {
      next(error)
    }
  })

router.get('/:permalink',
  param('permalink', 'Invalid quiz link.')
    .trim()
    .isAlphanumeric()
    .custom(link => link.length === 6),
  async (req, res, next) => {
    try {

      const errors = validationResult(req).array();
      if (errors.length > 0)
        return res.error('Invalid quiz link.')

      Quizzes.findOne({ permalink: req.params.permalink })
        .then(async quiz => {

          if (quiz === null)
            return res.error('Invalid quiz link.')

          const { title, permalink, attempt, created, _id: id } = quiz
          const formattedQuiz = { title, permalink, attempt, created, id }

          // get all questions related to quiz
          let quizWithQuestions = {}
          await Questions
            .find({
              quiz: formattedQuiz.id.toString()
            }).then(questions => {
              if (questions !== null) {
                const quizQuestions = questions
                  .sort((a, b) => a.order > b.order)

                const formattedQuestions = quizQuestions.map(ques => {
                  const { order, type, question, answers } = ques
                  formattedAnswers = answers.map(ans => {
                    const { option, isAnswer } = ans
                    return { option, isAnswer }
                  })
                  return { order, type, question, answers: formattedAnswers }
                })

                quizWithQuestions = {
                  ...formattedQuiz,
                  questions: formattedQuestions
                }
              }
            })

          return res.success('Quiz.', { quiz: quizWithQuestions })
        })

    } catch (error) {
      next(error)
    }
  })

router.delete('/:id',
  param('id', 'Invalid quiz id.')
    .trim()
    .isMongoId(),
  async (req, res, next) => {
    try {

      const errors = validationResult(req).array();
      if (errors.length > 0)
        return res.error('Invalid quiz id.')

      Quizzes.findByIdAndDelete(req.params.id)
        .then(async _ => {

          if (_ === null)
            return res.error('Quiz with id does not exist.')

          await Questions.deleteMany({ quiz: req.params.id })
          return res.success('Quiz deleted.')
        })

    } catch (error) {
      next(error)
    }
  })

module.exports = router