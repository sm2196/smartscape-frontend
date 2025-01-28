// import React, { useState, useEffect } from 'react';
// import { Button } from './Button';
// import { Link } from 'react-router-dom';
// import './Navbar.css';
// import { FaBars } from "react-icons/fa";
// import { ReactComponent as Logo } from './Logo.png';



// function Navbar() {
//   const [click, setclick] = useState(false);
//   const [button, setButton] = useState(true);
//   const handleClick = () => setClick(!click);
//   const closeMobileMenu = () => setClick(false);


//   const showButton = () => {
//     if (window.innerWidth <= 960) {
//       setButton(false);
//     } else {
//       setButton(true);
//     }
//   };

//   useEffect(() => {
//     showButton();
//   }, []);

//   window.addEventListener('resize', showButton);

//   const toggleMenu = () => {
//     setclick(!click);
//   };

//   return (
//     <>
//       <header className="SMheader">
//         <div className="SMcontainer">
//           <Link to='/' className='navbar-logo' onClick={closeMobileMenu}><Logo />
//           <i className='fab fa-typo3' />
//           </Link>
//           <nav>
//             <div className="logo">
//             </div>
//             <ul className={click ? "nav-link active" : "nav-link" }>
//               <li>
//                 <a href="/home" className="active">
//                   Home
//                 </a>
//               </li>
//               <li>
//                 <a href="/About">
//                   About
//                 </a>
//               </li>
//               <li>
//                 <a href="/services">
//                   Services
//                 </a>
//               </li>
//               <li>
//                 <a href="/contact">
//                   Contact Me
//                 </a>
//               </li>
//               <li>
//                 <a href="/FAQ">
//                   FAQ
//                 </a>
//               </li>
//             </ul>
//             {button && <Button buttonStyle='btn--outline'>SIGN UP</Button>}
//             <div className="icon" onClick={toggleMenu}>
//               <FaBars />
//             </div>
//           </nav>
//         </div>
//         {/* <Image
//             aria-hidden
//             src="./rand1.jpg"
//             alt="File icon"
//             width={16}
//             height={16}
//           /> */}
//       </header>
//     </>
//   );
// }

// export default Navbar;
