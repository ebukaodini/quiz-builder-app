import styled from "styled-components"

const StyledButton = styled.button`
  &:focus {
    outline: none !important;
    box-shadow: none !important;
    border-color: ${props => props.theme.primary};
  }
`
const StyledIconButton = styled.button`
  width: 40px;
  height: 40px;

  &:hover, 
  &:active {
    background-color: ${props => props.theme.light};
  }
  &:focus {
    outline: none !important;
    box-shadow: none !important;
    border-color: none !important;
  }
`
export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = (props) => {
  if (!props["title"]) return <span /> // return a span to indicate to the user that the aria-label is needed before link is displayed
  return <StyledButton aria-label={props.title} {...props} className={`btn rounded-0 ${props.className}`} />
}

export const TextButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = (props) => {
  if (!props["title"]) return <span /> // return a span to indicate to the user that the aria-label is needed before link is displayed
  return <StyledButton aria-label={props.title} {...props} className={`btn rounded-0 p-0 pb-1 ${props.className}`} />
}

export const IconButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = (props) => {
  if (!props["title"]) return <span /> // return a span to indicate to the user that the aria-label is needed before link is displayed
  return <StyledIconButton aria-label={props.title} {...props} className={`btn rounded-circle p-0 d-flex align-items-center justify-content-center ${props.className}`} />
}
