import styled from "styled-components";

const sharedStyles = `
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
  width: 50%;
  z-index: 2;
`;


export const RSSignUp = styled.div`
  ${sharedStyles}
  left: 0;
  opacity: 0;
  z-index: 1;

  ${(props) => !props.userSignIn && `
    transform: translateX(100%);
    opacity: 1;
    z-index: 5;
  `}

  @media (max-width: 768px) {
    width: 90%;
    ${(props) => !props.userSignIn && `transform: translateX(0);`}
  }
`;


export const RSSignIn = styled.div`
  ${sharedStyles}
  left: 0;

  ${(props) => !props.userSignIn && `transform: translateX(100%);`}

  @media (max-width: 768px) {
    width: 90%;
  }
`;


export const RSLRCoverBG = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: transform 0.6s ease-in-out;
  z-index: 100;

  ${(props) => !props.userSignIn && `transform: translateX(-100%);`}

  @media (max-width: 768px) {
    display: none !important;
  }
`;


export const RSCover = styled.div`
  background: linear-gradient(to right, #0a1630, rgb(36, 75, 161));
  background-size: cover;
  background-position: 0 0;
  color: #fffafa;
  position: relative;
  left: -100%;
  height: 100%;
  width: 200%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;

  ${(props) => !props.userSignIn && `transform: translateX(50%);`}

  @media (max-width: 768px) {
    display: none !important;
  }
`;


export const RSSlider = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 50px;
  text-align: center;
  top: 0;
  height: 100%;
  width: 50%;
  transition: transform 0.6s ease-in-out;
`;


export const RSLeftSlider = styled(RSSlider)`
  transform: translateX(-20%);
  ${(props) => !props.userSignIn && `transform: translateX(0);`}
`;


export const RSRightSlider = styled(RSSlider)`
  right: 0;
  ${(props) => !props.userSignIn && `transform: translateX(20%);`}
`;


export const RSLRCoverBGPhone = styled.div`
  @media (max-width: 768px) {
    position: absolute;
    top: 43rem;
    width: 130%;
    height: 10%;
    overflow: hidden;
    transition: transform 0.3s ease-in-out;
    z-index: 6;

    ${(props) => props.userSignIn ? `
      top: 30rem; /* Position for Login */
    ` : `
      top: 43rem; /* Position for Sign-Up */
      transform: translateX(0);
    `}
  }
`;


    /* Dynamic positioning based on the 'userSignIn' prop */



export const RSCoverPhone = styled.div`
  @media (max-width: 768px) {
    background: linear-gradient(to right, rgba(10, 22, 48, 0), rgba(36, 76, 161, 0));
    position: relative;
    left: -100%;
    height: 100%;
    width: 200%;
    transform: translateX(0);
    transition: transform 0.6s ease-in-out;
    ${(props) => !props.userSignIn && `transform: translateX(50%);`}
  }
`;


export const RSLeftSliderPhone = styled(RSSlider)`
  @media (max-width: 768px) {
    transform: translateX(-20%);
    ${(props) => !props.userSignIn && `transform: translateX(0);`}
  }
`;


export const RSRightSliderPhone = styled(RSSlider)`
  @media (max-width: 768px) {
    right: 0;
    bottom: 100%;
    ${(props) => !props.userSignIn && `transform: translateX(20%);`}
  }
`;