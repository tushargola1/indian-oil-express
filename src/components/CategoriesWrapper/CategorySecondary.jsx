import {  useNavigate } from 'react-router-dom';
import { FaAngleRight } from 'react-icons/fa';


const CategorySecondary = ({ categoriesUnique, setTypeFocus, typeFocus }) => {
    const nevigetor = useNavigate()
    
    function getvalueFromParams(cat){
        nevigetor(`?category=${cat}`)
        setTypeFocus(()=>cat)
    }
    return (
        <ul>
            <h3><em>Categories</em></h3>
            {categoriesUnique.map((category, i) => (
                <li key={i} className={typeFocus === category ? 'activeBtn' : ""}>
                    <FaAngleRight className="button-icon" />
                    <button  >
                        <span onClick={()=>getvalueFromParams(category)}>{category}</span>
                    </button>
                </li>
            ))}
        </ul>
    )
}

export default CategorySecondary
