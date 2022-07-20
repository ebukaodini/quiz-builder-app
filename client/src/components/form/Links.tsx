import { Link, LinkProps } from "react-router-dom"
import styled from "styled-components"

const StyledLinkButton = styled(Link)`
  &:focus {
    outline: none !important;
    box-shadow: none !important;
    border-color: ${props => props.theme.primary};
  }
`
const StyledAnchorButton = styled.a`
  &:focus {
    outline: none !important;
    box-shadow: none !important;
    border-color: ${props => props.theme.primary};
  }
`
const StyledLinkIconButton = styled(Link)`
  width: 40px;
  height: 40px;

  &:hover, 
  &:active {
    background-color: ${props => props.theme.grey};
  }
  &:focus {
    outline: none !important;
    box-shadow: none !important;
    border-color: none !important;
  }
`
const StyledAnchorIconButton = styled.a`
  width: 40px;
  height: 40px;

  &:hover, 
  &:active {
    background-color: ${props => props.theme.grey};
  }
  &:focus {
    outline: none !important;
    box-shadow: none !important;
    border-color: none !important;
  }
`
export const LinkText: React.FC<LinkProps<unknown> & React.RefAttributes<HTMLAnchorElement>> = (props) => {
  if (!props["title"]) return <span /> // return a span to indicate to the user that the aria-label is needed before link is displayed
  return <Link {...props} aria-label={props.title} className={`text-decoration-none text-primary ${props.className}`} />
}

export const LinkButton: React.FC<LinkProps<unknown> & React.RefAttributes<HTMLAnchorElement>> = (props) => {
  if (!props["title"]) return <span /> // return a span to indicate to the user that the aria-label is needed before link is displayed
  return <StyledLinkButton {...props} aria-label={props.title} className={`text-decoration-none btn ${props.className}`} />
}

export const AnchorButton: React.FC<React.AnchorHTMLAttributes<HTMLAnchorElement>> = (props) => {
  if (!props["title"]) return <span /> // return a span to indicate to the user that the aria-label is needed before link is displayed
  return <StyledAnchorButton {...props} aria-label={props.title} className={`text-decoration-none btn ${props.className}`} />
}

export const AnchorIconButton: React.FC<React.AnchorHTMLAttributes<HTMLAnchorElement>> = (props) => {
  if (!props["title"]) return <span /> // return a span to indicate to the user that the aria-label is needed before link is displayed
  return <StyledAnchorIconButton {...props} aria-label={props.title} className={`text-decoration-none btn rounded-circle p-0 d-flex align-items-center justify-content-center ${props.className}`} />
}

export const LinkIconButton: React.FC<LinkProps<unknown> & React.RefAttributes<HTMLAnchorElement>> = (props) => {
  if (!props["title"]) return <span /> // return a span to indicate to the user that the aria-label is needed before link is displayed
  return <StyledLinkIconButton {...props} aria-label={props.title} className={`btn rounded-circle p-0 d-flex align-items-center justify-content-center ${props.className}`} />
}
