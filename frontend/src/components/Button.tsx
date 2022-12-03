import styled from "styled-components";

const Button = styled.button`
  border-radius: 28px;
  height: 60px;
  width: 90%;
  font-size: 1.4em;
  color: white;
  background-color: #0d1b5c;
  box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.7);
  cursor: pointer;
  //hover effect
  &:hover {
    transition: 0.3s ease-in-out;
    transform: scale(1.025);
  }
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

export default Button;
