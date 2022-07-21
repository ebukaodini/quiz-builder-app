import styled from "styled-components"
import { Button, PageWrapper } from "../components"
import { useHistory } from "react-router-dom"
import Logo from '../assets/textlogo.svg'

const LogoWrapper = styled.div`
  height: 30px;
  width: fit-content;
`

export const Unknown: React.FC<{}> = () => {

  const { goBack } = useHistory()

  return (
    <div>
      <PageWrapper className="vh-100">

        <div className="h-100 d-flex justify-content-center align-items-center">
          <div>

            <LogoWrapper className="w-100 d-flex justify-content-center mb-3">
              <img src={Logo} alt="Quiz App" title="Quiz App"/>
            </LogoWrapper>

            <div className="text-center">
              <h1 className="m-0">Unknown Page</h1>
              <p>You've reached an unknown page. Go back to take a quiz.</p>
              <Button title='Go back' className="btn btn-primary mt-5" onClick={goBack}>Go back</Button>
            </div>

          </div>
        </div>

      </PageWrapper>
    </div>
  )
}
