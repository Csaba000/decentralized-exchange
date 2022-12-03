import styled from 'styled-components';

export const Card = styled.div`
    padding: 0 1rem; 
    background-color: #374dad;
    width: 500px;
    height: 400px;
    border-radius: 10px;
    border-top: 0 solid #000;
    border-width: 3px;
    border-color: #202020;
    box-shadow: 10px 10px 10px rgba(0,0,0,0.9);
    animation: pop-in 0.5s ease-in-out;
    @keyframes pop-in {
        0% {
            transform: scale(0.5);
            opacity: 0;
        }
        100% {
            transform: scale(1);
            opacity: 1;
        }
    }
    &:hover {
        transform: scale(1.01);
        transition: all .2s ease-in-out;
    }
    //make responsive
    @media (max-width: 768px) {
        width: 370px;
        height: 370px;
        font-size: 0.7rem;
    }
`;

export const HeaderForCard = styled.div`
    display: flex;
    padding-top: 20px;
    padding-left: 20px;
    justify-content: space-between;
    width: 100%;
    margin: 0 auto;
    margin-top: 10px;
    margin-bottom: 10px;
    color: #F8F8F8;
    font-family: 'Roboto-Mono', monospace;
    font-weight: bold;
`;

export const SpaceBetweenForCard = styled.div`
    display: flex;
    background-color: #1e2d73;
    border-radius: 28px;
    align-items: center;
    justify-content: space-between;
    width: 90%;
    /* padding: 10px; */
    margin: 0 auto;
    margin-top: 3.5px;
    margin-bottom: 3.5px;
    padding-left: 30px;
    border-width: 3px;
    border-color: #202020;
    box-shadow: 3px 3px 3px rgba(0,0,0,0.7);
`;

export const Dropdown = styled.select`
    border-radius: 10px;
    outline: none;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 20%;
    width: 30%;
    font-size: 1.5em;
    color: white;
    background-color: #0d1b5c;
    @media (max-width: 768px) {
        /* width: 40px; */
        text-align: center;
        height: 35px;
        font-size: 0.7rem;
    }
`;

export const FloatRight = styled.div`
    float: right;
    margin-right: 20px;
    display: flex;
    flex-direction: row;
`;

export const Footer = styled.div`  
    display: flex;
    padding-top: 20px;
    justify-content: center;
    width: 100%;
    margin: 0 auto;
    /* margin-top: 10px; */
    /* margin-bottom: 10px; */
    color: #F8F8F8;
    font-family: 'Roboto-Mono', monospace;
    font-weight: bold;

    @media (max-width: 768px) {
      padding-top: 50px;
    }
`;

export const ArrowInside = styled.div`
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #1e2d73;
    width: 30px;
    height: 30px;
    border: 2px solid rgb(1, 30, 52);
    border-radius: 9px;
    padding: 0px;
    cursor: pointer;
    color: black;

`

export const CenterMid = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    color: #F8F8F8;
    font-family: 'Roboto-Mono', monospace;
    font-weight: bold;
`;

//create swap image
export const SwapIcon = styled.img`
    width: 25px;
    height: 25px;
    margin: 0 auto;
    display: block;
    margin-top: 7px;
`;

//create settings button component
export const SettingsButton = styled.button`
    border-radius: 28px;
    height: 40px;
    width: 110%;
    font-size: 0.8em;
    padding: 0.25em 1em;
    width: auto;
    color: white;
    background-color: #0d1b5c;
    box-shadow: 3px 3px 3px rgba(0,0,0,0.7);
    cursor: pointer;
    //hover effect
    &:hover {
        transition:  0.3s ease-in-out ;
        transform: scale(1.025); 
    }
`;

//create a span component
export const Span = styled.span` 
    color: #F8F8F8;
    font-family: 'Roboto-Mono', monospace;
    font-weight: bold;
`;


export default Card;
