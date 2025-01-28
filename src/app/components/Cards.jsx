import React from 'react';
import './Cards.css';
import CardItem from './CardItem';

function Cards() {
  return (
    <div className='SMcards'>
      <h1>What's special about us?</h1>
      <div className='SMcards__container'>
        <div className='SMcards__wrapper'>
          <ul className='SMcards__items'>
            <CardItem
              src='/bulb.jpg'
              text='Monitor your electricity consumption... and Your home'
              label='1'
              path='/services'
            />
            <CardItem
              src='/device.jpg'
              text='Save your bills. Turn off devices during peak hours.'
              label='2'
              path='/services'
            />
          </ul>
          <ul className='SMcards__items'>
            <CardItem
              src='/control.jpg'
              text='Control all your devices on the run.'
              label='3'
              path='/services'
            />
            <CardItem
              src='/cam.jpg'
              text='Watch for intruders!'
              label='4'
              path='/products'
            />
            <CardItem
              src='/off.jpg'
              text='Emergency shutdown and Do Not Disturb modes'
              label='5'
              path='/sign-up'
            />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Cards;