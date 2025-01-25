import React from 'react';
import '../../App.css';
import Cards from '../Cards';
import MainPicSection from '../MainPic';
import Footer from '../Footer';
import Form from '../ourCustomers'

function Home() {
  return (
    <>
      <MainPicSection />
      <Cards />
      <Form />
      <Footer />
    </>
  );
}

export default Home;