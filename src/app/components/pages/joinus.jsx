import React from 'react';
import styled from 'styled-components';

const JoinUs = () => {
  return (
    <StyledWrapper>
      <button> <span>Register today</span>
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
@import url("https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap");

  button {
   outline: none;
   cursor: pointer;
   border: none;
   padding: 0.9rem 2rem;
   margin-top: 1rem;
   font-family: inherit;
   font-size: inherit;
   position: relative;
   display: inline-block;
   letter-spacing: 0.05rem;
   font-weight: 700;
   font-size: 17px;
   border-radius: 500px;
   overflow: hidden;
   background: #0A1630 ;
   color: #000000;
  }

  button span {
   position: relative;
   z-index: 10;
   transition: color 0.4s;
  }

  button:hover span {
   color: #fffafa;
  }

  button::before,
  button::after {
   position: absolute;
   top: 0;
   left: 0;
   width: 100%;
   height: 100%;
   z-index: 0;
  }

  button::before {
   content: "";
   background: #fffafa;
   width: 120%;
   left: -10%;
   transform: skew(30deg);
   transition: transform 0.4s cubic-bezier(0.3, 1, 0.8, 1);
  }

  button:hover::before {
   transform: translate3d(100%, 0, 0);
  }`;

export default JoinUs;
