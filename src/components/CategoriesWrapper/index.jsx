//static custom  json data;
import categories from './categories.json';
import { useState } from 'react';

//util import
import { noRedundant } from './noRedundant';

//child components imports 
import Categorieslist from './CategoriesList';
import Pagination from './Pagination';
import CategorySecondary from './CategorySecondary';

import './categories.css';


const CategoriesWrapper = () => {
  const categoriesUnique = noRedundant(categories);

  //states important! ==>  state that triggers UI from children
  const [index, setIndex] = useState(1);
  const [typeFocus, setTypeFocus] = useState(categoriesUnique[0])

  //local variables
  const itemsPerPage = 5;

  const categoriesToDisplay = categories.slice(
    (index - 1) * itemsPerPage,
    index * itemsPerPage
  );

  return (
    <div className='container-fluid my-2 px-lg-5 px-md-3 px-3'>
      <section aria-label="categories page" className="categories_container">
        <article className="article_primary">
          <h2><em>{typeFocus}</em></h2>
          <hr />
          {categoriesToDisplay.map((info, i) => (
            <Categorieslist {...info} key={i} />
          ))}
          <Pagination
            index={index} setIndex={setIndex} itemsPerPage={itemsPerPage} />
        </article>
        <article className="article_secondary">
          <CategorySecondary categoriesUnique={categoriesUnique} setTypeFocus={setTypeFocus} typeFocus={typeFocus} />
        </article>

      </section>
    </div>

  );
};

export default CategoriesWrapper;
