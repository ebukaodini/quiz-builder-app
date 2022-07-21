import styled from "styled-components"
import { Button, Empty, LinkButton, PageWrapper } from "../components"
import Logo from '../assets/textlogo.svg'
import { Quiz, useAuthStore, useModalStore, useQuizStore } from "../store"
import { ArrowRight, Copy, User } from "react-feather"
import { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { copyToClipboard, once, domain, formatDate } from "../utils"

const ImgLogo = styled.img`
  height: 40px !important;
  width: fit-content;
`
const Hero = styled.div`
  height: 10vh;
  width: 100%;
`

export const UserQuizzes: React.FC<{}> = () => {

  const { userQuizzes } = useQuizStore()
  const { authenticated, user } = useAuthStore()
  const { push, goBack, replace } = useHistory()
  const { toast } = useModalStore()
  const [pagination, setPagination] = useState({
    current: 1,
    total: Math.ceil(userQuizzes.length / 10),
    limit: 10
  })

  useEffect(() => {
    return once(() => {
      if (authenticated === false) {
        toast('Please login to create quiz')
        replace('/auth/login')
      }
    })
  }, [authenticated, replace, toast])

  const handleCopy = (quiz: Quiz) => {
    copyToClipboard(`${domain}/q/${quiz?.permalink}`, 'Quiz link copied to clipboard.')
  }

  return (
    <div>
      <PageWrapper noContainer={true}>

        <Hero className="w-100 bg-light border-bottom mb-3">

          <div className="w-100 h-100 container d-flex justify-content-between">

            <div className="d-flex flex-column justify-content-center al ign-items-center">
              <ImgLogo src={Logo} alt="Quiz App" title="Quiz App" />
              <h6 className="ms-5 m-0">My Quizzes ({userQuizzes.length})</h6>
            </div>

            <div className="d-flex gap-2 my-auto">
              <Button onClick={goBack}
                className="btn-sm btn-muted border-0 text-primary py-2 px-3" title='Go back'>Back</Button>
              <Button onClick={() => push('/create')}
                className="btn-sm btn-primary py-2 px-3" title='Create quiz'>Create quiz</Button>
            </div>

          </div>

        </Hero>

        <div className="container w-100 mb-5">
          {
            userQuizzes.length > 0 ?
              <div className="list-group list-group-flush">
                {
                  userQuizzes
                    ?.slice(((pagination.current - 1) * pagination.limit), (pagination.limit * pagination.current))
                    .map((quiz, index) => (
                      <div key={index} className="w-100 p-3 bg-white list-group-item d-flex flex-column gap-2">
                        <div className="w-100 d-flex justify-content-between">
                          <h6 className="text-dark">{quiz?.title}</h6>
                          <span className="text-dark fw-light fs-7">{formatDate(quiz?.created!)}</span>
                        </div>

                        <div className="text-dark">There are {quiz.questions.length} questions in this quiz. This quiz has been attempted {quiz?.attempt} times.</div>

                        <div className="w-100 d-flex justify-content-between mt-3">
                          <span className="d-flex align-items-center text-dark fs-7 gap-1">
                            <User size={13} />
                            {user?.firstname} {user?.lastname}
                          </span>

                          <div className="d-flex gap-2">
                            <LinkButton to={`/q/${quiz.permalink}`} title="Attempt quiz"
                              className="btn-primary dark btn-sm">
                              Attempt</LinkButton>
                            <Button title="Share quiz" onClick={() => handleCopy(quiz)}
                              className="btn-primary dark btn-sm d-flex align-items-center gap-2">
                              <Copy size={16} /> Share</Button>
                            <LinkButton to={`/list/${quiz.permalink}`} title="Quiz details"
                              className="btn-primary dark btn-sm d-flex align-items-center gap-2">
                              View <ArrowRight size={16} /></LinkButton>
                          </div>
                        </div>

                      </div>
                    ))
                }
              </div>
              : <Empty />
          }

        </div>

      </PageWrapper>

      <div className="w-100 position-fixed start-0 end-0 bottom-0 mt-5">
        <div className="container w-100 bg-white py-2 px-3 shadow-sm d-flex justify-content-between align-items-center">
          <span className="text-secondary">Showing page {pagination.current} of {pagination.total}</span>

          <div className="d-flex gap-2">
            <Button disabled={pagination.current <= 1} onClick={() => {
              setPagination({ ...pagination, current: pagination.current - 1 })
            }} className="btn-sm btn-outline-secondary border-secondary py-2 px-3" title='Previous'>Previous</Button>

            <Button disabled={pagination.current === pagination.total} onClick={() => {
              setPagination({ ...pagination, current: pagination.current + 1 })
            }} className="btn-sm btn-outline-secondary border-secondary py-2 px-3" title='Next'>Next</Button>
          </div>
        </div>
      </div>
    </div >


  )
}
