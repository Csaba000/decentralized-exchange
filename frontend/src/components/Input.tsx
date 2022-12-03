import styled from 'styled-components';

const Input = styled.input`
    border-radius: 5px;
    outline: none;
    border: none;
    padding: 10px;
    margin: 10px;
    width: 60%;
    font-size: 1.5em;
    color: white;
    font-family: 'Roboto-Mono', monospace;
    font-weight: bold;
    background-color: transparent;
    @media (max-width: 768px) {
        /* width: 40px; */
        height: 40px;
        font-size: 0.7rem;
    }
`;

export default Input;