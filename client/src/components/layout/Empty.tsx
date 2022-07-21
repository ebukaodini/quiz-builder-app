import styled from "styled-components"
import EmptyImage from '../../assets/Empty.svg'

const Wrapper = styled.div`
  width: 400px;
`
type props = {
  // children: JSX.Element | JSX.Element[]
}

export const Empty: React.FC<props> = () => {
  return (
    <Wrapper className="d-flex mx-auto gap-3 flex-column justify-content-center align-items-center">
      <img src={EmptyImage} alt="Empty quiz" title="Empty quiz" className="w-100" />
      <p className="fs-4 text-dark fw-light">No available quiz</p>
    </Wrapper>
  )
}