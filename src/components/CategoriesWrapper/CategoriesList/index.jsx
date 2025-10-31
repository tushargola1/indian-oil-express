import './categorieslist.css';
import { Link } from 'react-router-dom';

import imgMain from '../../../assets/image/category-news/1.png'

const Categorieslist = ({ title, content, date, img }) => {

  return (
    <Link to={`news-detail`} className='container_list'>
      <section className='list_image' >
        <img src={imgMain} alt={title} />
      </section>
      <section className='list_content' aria-labelledby={title}>
        <h2 className='single-line heading'>{title}</h2>
        <p className='single-line'>{content}</p>
      </section>
      <section className='list_date' aria-labelledby={date}>
        <h5>{date}</h5>
      </section>
    </Link>
  )
}

export default Categorieslist
