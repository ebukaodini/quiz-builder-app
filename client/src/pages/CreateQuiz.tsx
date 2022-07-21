import styled from "styled-components"
import { Button, CheckboxInput, IconButton, Input, LinkButton, PageWrapper } from "../components"
import Logo from '../assets/textlogo.svg'
import { Question, Quiz, useAuthStore, useModalStore, useQuizStore } from "../store"
import { CheckCircle, Copy, Minus, User } from "react-feather"
import { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { copyToClipboard, domain, formatDate } from "../utils"

const ImgLogo = styled.img`
  height: 40px !important;
  width: fit-content;
`
const Hero = styled.div`
  height: 10vh;
  width: 100%;
`

export const CreateQuiz: React.FC<{}> = () => {

  const { publishQuiz } = useQuizStore()
  const { authenticated, user } = useAuthStore()
  const { toast, loading, confirm } = useModalStore()
  const { push, goBack } = useHistory()
  const newAnswer = { option: '', isAnswer: false }
  const newQuestion: Question = {
    question: '', order: 1, type: 'single', answers: [newAnswer]
  }
  const [title, setTitle] = useState<string>('')
  const [questions, setQuestions] = useState<Question[]>([newQuestion])
  const [pagination, setPagination] = useState({
    current: 1,
    limit: 10
  })
  const [currentQuestion, setCurrentQuestion] = useState<Question>()
  const [isReviewing, setIsReviewing] = useState(false)
  const [isPublished, setIsPublished] = useState(false)
  const [publishedQuiz, setPublishedQuiz] = useState<Quiz>()

  useEffect(() => {
    if (authenticated === false) push('/auth/login')
  }, [authenticated, push])

  useEffect(() => {
    setCurrentQuestion(questions[(pagination.current - 1)])
  }, [pagination, questions])

  const saveCurrentQuestion = () => {
    questions.splice((pagination.current - 1), 1, currentQuestion!)
    setQuestions([...questions])
  }
  const handleAddQuestion = () => {
    saveCurrentQuestion()
    setPagination({ ...pagination, current: pagination.current + 1 })
    setQuestions([...questions, newQuestion])
  }
  const handleNextQuestion = () => {
    saveCurrentQuestion()
    setPagination({ ...pagination, current: pagination.current + 1 })
  }
  const handlePreviousQuestion = () => {
    saveCurrentQuestion()
    setPagination({ ...pagination, current: pagination.current - 1 })
  }
  const handleAddAnswer = () => {
    setCurrentQuestion({ ...currentQuestion!, answers: [...currentQuestion?.answers!, newAnswer] })
  }
  const handleRemoveQuestion = () => {
    if (pagination.current === 1) {
      toast('Can\'t remove all questions. Try cancelling the quiz.', 'danger')
      return
    }
    questions.splice((pagination.current - 1), 1)
    setPagination({ ...pagination, current: (pagination.current - 1) })
    setQuestions([...questions!])
  }
  const handleRemoveAnswer = (index: number) => {
    if (currentQuestion?.answers.length === 1) {
      toast('Can\'t remove all questions. Try cancelling the quiz.', 'danger')
      return
    }
    const answers = currentQuestion?.answers!
    answers.splice(index, 1)
    setCurrentQuestion({ ...currentQuestion!, answers: [...answers] })
  }
  const handleUpdateQuestion = (field: 'question' | 'type', value: string) => {
    setCurrentQuestion({ ...currentQuestion!, [field]: value })
  }
  const handleUpdateAnswer = (index: number, field: 'option' | 'isAnswer', value: string | boolean) => {
    let answers = currentQuestion?.answers!
    if (field === 'isAnswer' && currentQuestion?.type === 'single') {
      answers = answers?.map(answer => ({ ...answer, isAnswer: false }))
    }

    const answer = { ...answers[index]!, [field]: value }
    answers?.splice(index, 1, answer)
    setCurrentQuestion({ ...currentQuestion!, answers: [...answers!] })
  }

  const handleReview = () => {
    saveCurrentQuestion()
    setIsReviewing(true);
    setPagination({ ...pagination!, current: 1 })
  }
  const handlePublish = () => {
    confirm('Are you sure you want to pusblish this quiz?', 'warning', async () => {
      try {
        loading(true, 'Publishing quiz...')
        const resp = await publishQuiz({
          title, questions
        })
        loading(false)

        if (resp.status === true) {
          toast(resp.message)
          setIsPublished(true)
          setPublishedQuiz(resp.data.quiz)
        } else {
          toast(resp.message, 'danger', false)
        }
      } catch (error: any) {
        loading(false)
        toast(error.message, 'danger')
      }
    })
  }
  const handleCopy = () => {
    copyToClipboard(`${domain}/q/${publishedQuiz?.permalink}`, 'Quiz link copied to clipboard.')
  }

  return (
    <div>
      <PageWrapper noContainer={true}>

        <Hero className="w-100 bg-light border-bottom mb-3">

          <div className="w-100 h-100 container d-flex justify-content-between">

            <div className="d-flex flex-column justify-content-center al ign-items-center">
              <ImgLogo src={Logo} alt="Quiz App" title="Quiz App" />
              <h6 className="ms-5 m-0">Create Quiz {isPublished ? '- Pubished' : isReviewing && '- Review'}</h6>
            </div>

            {
              !isPublished &&
              <>
                {
                  isReviewing ?
                    <div className="d-flex gap-2 my-auto">
                      <Button onClick={() => setIsReviewing(false)}
                        className="btn-sm btn-danger text-light py-2 px-3" title='Edit'>Edit</Button>

                      <Button onClick={() => handlePublish()}
                        className="btn-sm btn-success text-light py-2 px-3" title='Publish'>Publish</Button>
                    </div> :
                    <div className="d-flex gap-2 my-auto">
                      <Button onClick={goBack}
                        className="btn-sm btn-danger text-light py-2 px-3" title='Cancel'>Cancel</Button>

                      <Button onClick={handleReview}
                        className="btn-sm btn-success text-light py-2 px-3" title='Review'>Review</Button>
                    </div>
                }
              </>
            }

          </div>

        </Hero>

        {
          isReviewing ?
            isPublished ?
              <div className="container w-100 mb-5">
                <div className="w-100 p-3 bg-white shadow-sm d-flex flex-column gap-2">

                  <div className="d-flex text-success align-items-center gap-2">
                    <CheckCircle size={20} />
                    Published
                  </div>

                  <div className="w-100 d-flex justify-content-between">
                    <h6 className="text-dark">{publishedQuiz?.title}</h6>
                    <span className="text-dark fw-light fs-7">{formatDate(publishedQuiz?.created!)}</span>
                  </div>

                  <div className="text-dark">There are {questions.length} questions in this quiz. This quiz has been attempted {publishedQuiz?.attempt} times.</div>

                  <div className="w-100 d-flex justify-content-between mt-3">
                    <span className="d-flex align-items-center text-dark fs-7 gap-1">
                      <User size={13} />
                      {user?.firstname} {user?.lastname}
                    </span>

                    <div className="d-flex gap-2">
                      <Button onClick={() => window.location.reload()} title="Create another quiz" className="btn-primary dark btn-sm">Create another quiz</Button>
                      <LinkButton to={`/q/${publishedQuiz?.permalink}`} title="Attempt quiz" className="btn-primary dark btn-sm">Attempt</LinkButton>
                      <Button title="Share quiz" onClick={handleCopy}
                        className="btn-primary dark btn-sm d-flex align-items-center gap-2">
                        <Copy size={16} /> Share</Button>
                    </div>

                  </div>

                </div>

              </div>
              :
              <div className="container w-100 mb-5">

                <div className="d-flex mb-5 justify-content-between align-items-center">
                  <h1 className="m-0">{title.trim().length > 1 ? title : 'No title'}</h1>
                  <span>Question {pagination.current}</span>
                </div>

                <div className="mb-5 w-100 d-flex flex-column gap-1">
                  <span className="fs-4">{currentQuestion?.question.trim().length! > 1 ? currentQuestion?.question! : 'No question'}</span>
                  <span className="fs-7 text-danger"><b>NOTE:</b> This is a {currentQuestion?.type} choice question.</span>
                </div>

                <div>
                  {
                    currentQuestion?.answers.map((answer, index) =>
                      <div key={index} className="mb-2 d-flex align-items-center py-0 px-2 gap-4">
                        <CheckboxInput className="form-check" readOnly={true} type={currentQuestion.type === 'multiple' ? 'checkbox' : 'radio'} name="answerOption" checked={answer.isAnswer} />
                        <span className="fs-5">{answer.option}</span>
                      </div>
                    )
                  }
                </div>

              </div> :
            <div className="container w-100 mb-5">

              <div className="mb-4">
                <label htmlFor="title" className="text-dark fs-5 mb-2">Title</label>
                <Input id="title" type='text' value={title} onChange={e => setTitle(e.target.value)}
                  placeholder="Enter quiz title" className="form-control py-3" />
              </div>

              <div className="d-flex align-items-center justify-content-between mb-3">
                <h5 className="">Question {pagination.current}</h5>
                <IconButton title="Remove question" className="border-0 text-danger p-0" onClick={handleRemoveQuestion}>
                  <Minus size={18} />
                </IconButton>
              </div>

              <div className="mb-2">
                <label htmlFor="title" className="text-dark fs-6 mb-2">Question</label>
                <Input id="title" value={currentQuestion?.question} onChange={e => handleUpdateQuestion('question', e.target.value)}
                  type='text' placeholder="Enter question" className="form-control py-3" />
              </div>

              <div className="btn-group gap-0 mb-4">
                <Button type="button" title="One Answer" onClick={() => handleUpdateQuestion('type', 'single')}
                  className={`${currentQuestion?.type === 'single' ? 'btn-primary' : 'btn-light'} btn-sm py-2`}>One Answer</Button>
                <Button type="button" title="Multiple Answers" onClick={() => handleUpdateQuestion('type', 'multiple')}
                  className={`${currentQuestion?.type === 'multiple' ? 'btn-primary' : 'btn-light'} btn-sm py-2`}>Multiple Answers</Button>
              </div>

              <h6 className="text-dark fw-normal mb-4">Answers</h6>

              {
                currentQuestion?.answers.map((answer, index) =>
                  <div key={index} className="mb-2 d-flex align-items-center py-0 px-2 gap-3 border border-grey">
                    <CheckboxInput className="form-check" type={currentQuestion.type === 'multiple' ? 'checkbox' : 'radio'} name="answerOption"
                      checked={answer.isAnswer} onChange={e => handleUpdateAnswer(index, 'isAnswer', e.target.checked)} />
                    <Input id="title" type='text' value={answer.option} onChange={e => handleUpdateAnswer(index, 'option', e.target.value)}
                      placeholder="Enter answer option" autoFocus={true} className="form-control fs-6 border-0" />
                    <IconButton
                      className="border-0 text-danger p-0 bg-transparent"
                      title="Remove question" onClick={() => handleRemoveAnswer(index)}>
                      <Minus size={18} />
                    </IconButton>
                  </div>
                )
              }

              <Button disabled={currentQuestion?.answers.length === 5}
                title="Add answer" className="btn-primary mt-4"
                onClick={handleAddAnswer}
              >Add Answer Option</Button>

            </div>
        }


      </PageWrapper>

      {!isPublished &&
        <div className="w-100 position-fixed start-0 end-0 bottom-0 mt-5">
          <div className="container w-100 bg-white py-2 px-3 shadow-sm d-flex justify-content-between align-items-center">
            <span className="text-secondary">Question {pagination.current} of {questions.length!}</span>

            <div className="d-flex gap-2">
              <Button disabled={pagination.current <= 1}
                title='Previous' onClick={handlePreviousQuestion} className="btn-sm btn-outline-secondary border-secondary py-2 px-3"
              >Previous</Button>

              {
                pagination.current < questions.length || isReviewing === true ?
                  <Button disabled={isReviewing === true ? pagination.current === questions.length : pagination.current === pagination.limit}
                    className="btn-sm btn-outline-secondary border-secondary py-2 px-3"
                    title='Next' onClick={handleNextQuestion}
                  >Next</Button> :
                  <Button disabled={pagination.current === pagination.limit}
                    className="btn-sm btn-outline-secondary border-secondary py-2 px-3"
                    title='Add Question' onClick={handleAddQuestion}
                  >Add Question</Button>
              }

            </div>
          </div>
        </div>
      }
    </div >


  )
}
