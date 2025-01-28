import React from 'react';
import { Link } from 'react-router-dom';

function CardItem(props) {
  return (
    <>
      <li className='SMcards__item'>
        <Link className='SMcards__item__link' to={props.path}>
          <figure className='SMcards__item__pic-wrap' data-category={props.label}>
            <img
              className='SMcards__item__img'
              alt='Travel Image'
              src={props.src}
            />
          </figure>
          <div className='SMcards__item__info'>
            <h5 className='SMcards__item__text'>{props.text}</h5>
          </div>
        </Link>
      </li>
    </>
  );
}

export default CardItem;