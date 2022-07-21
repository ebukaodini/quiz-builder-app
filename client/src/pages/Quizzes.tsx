import styled from "styled-components"
import { Button, Empty, IconButton, Input, LinkButton, PageWrapper } from "../components"
import Logo from '../assets/textlogo.svg'
import { Quiz, useAuthStore, useModalStore, useQuizStore } from "../store"
import { Search, User } from "react-feather"
import { formatDate } from "../utils"
import { useState } from "react"

const LogoWrapper = styled.div`
  height: 60px;
  width: fit-content;
`
const Hero = styled.div`
  height: 45vh;
  width: 100%;
`

export const Quizzes: React.FC<{}> = () => {

  const { quizzes } = useQuizStore()
  const [filterQuizzes, setFilteredQuizzes] = useState<Quiz[]>(quizzes)
  const { authenticated, logout } = useAuthStore()
  const { confirm } = useModalStore()
  const [pagination, setPagination] = useState({
    current: 1,
    total: Math.ceil(filterQuizzes.length / 9),
    limit: 9
  })

  const handleLogout = () => {
    confirm('Are you sure you want to log out?', 'danger', async () => logout())
  }
  const handleSearch = (e: any) => {
    e.preventDefault()
    const search = e.target[0].value.toLowerCase().trim()

    const filter = quizzes?.filter(quiz =>
      quiz.title.toLowerCase().includes(search)
    )!
    setFilteredQuizzes(filter)
    setPagination({ ...pagination, current: 1, total: Math.ceil(filter.length / 9) })
  }
  const handleResetSearch = (e: any) => {
    const search = e.target.value
    if (search.trim().length === 0) {
      setFilteredQuizzes(quizzes)
      setPagination({ ...pagination, current: 1, total: Math.ceil(quizzes.length / 9) })
    }
  }

  return (
    <div>
      <PageWrapper noContainer={true}>

        <Hero className="w-100 bg-light border-bottom mb-3">

          <div className="w-100 h-100 container d-flex flex-column justify-content-center align-items-center">
            <LogoWrapper className="w-100 d-flex justify-content-center mb-5">
              <img src={Logo} alt="Quiz App" title="Quiz App" />
            </LogoWrapper>

            <form onSubmit={handleSearch} className="w-lg-50 w-100">
              <div className="position-relative">
                <Input type='search' onChange={handleResetSearch} className="form-control px-3 py-3 mb-3" placeholder="search quiz" />
                <IconButton title='Search'
                  className="bg-transparent text-grey border-0 position-absolute top-50 end-0 translate-middle p-0">
                  <Search size={18} />
                </IconButton>
              </div>
            </form>

            <p className="text-primary text-center">There are {quizzes?.length ?? 0} quizzes available. You can add yours by clicking the Add button below.</p>

            <div className="d-flex gap-2">
              <LinkButton title="create quiz" to='/create' className="btn-primary">Add new quiz</LinkButton>
              {
                authenticated === true &&
                <>
                  <LinkButton title="my quiz" to='/list' className="btn-primary px-4">My quizzes</LinkButton>
                  <Button title="logout" onClick={handleLogout} className="btn-danger text-light px-4">Log Out</Button>
                </>
              }
            </div>
          </div>

        </Hero>

        <div className="container w-100 mb-5">
          {
            filterQuizzes.length > 0 ?
              <div className="row">
                {
                  filterQuizzes
                    ?.slice(((pagination.current - 1) * pagination.limit), (pagination.limit * pagination.current))
                    .map((quiz, index) => (
                      <div key={index} className="col-12 col-md-6 col-lg-4 mb-3 p-3">
                        <div className="w-100 p-3 bg-white shadow-sm d-flex flex-column gap-2">

                          <div className="w-100 d-flex justify-content-between">
                            <h6 className="text-dark">{quiz.title}</h6>
                            <span className="text-dark fw-light fs-7">{formatDate(quiz.created)}</span>
                          </div>

                          <div className="text-dark">There are {quiz.questions.length} questions in this quiz. This quiz has been attempted {quiz.attempt} times.</div>

                          <div className="w-100 d-flex justify-content-between mt-3">
                            <span className="d-flex align-items-center text-dark fs-7 gap-1">
                              <User size={13} />
                              {quiz?.user?.firstname} {quiz?.user?.lastname}
                            </span>

                            <LinkButton to={`/q/${quiz.permalink}`} title="Attempt quiz" className="btn-primary dark btn-sm">Attempt</LinkButton>
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
    </div>


  )
}
