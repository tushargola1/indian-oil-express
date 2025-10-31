import { useState } from 'react';
import { HiChevronRight, HiChevronLeft } from 'react-icons/hi';
import categories from './categories.json';

const Pagination = ({
    index, setIndex, itemsPerPage
}) => {
    const totalPages = Math.ceil(categories.length / itemsPerPage);
    const [pageGroupStart, setPageGroupStart] = useState(1);

    const nextItem = () => {
        if (pageGroupStart + 5 <= totalPages) setPageGroupStart(pageGroupStart + 5);
    };
    const prevItem = () => {
        if (pageGroupStart - 5 >= 1) setPageGroupStart(pageGroupStart - 5);
    };
    const visibleButtons = Array.from({ length: Math.min(5, totalPages - pageGroupStart + 1) })
        .map((_, i) => pageGroupStart + i);


    return (
        <section className="pagination_buttons">
            <button onClick={prevItem} disabled={pageGroupStart === 1}>
                <HiChevronLeft />
            </button>

            {visibleButtons.map((page) => (
                <button
                    key={page}
                    onClick={() => setIndex(page)}
                    className={index === page ? 'active' : ''}
                >
                    {page}
                </button>
            ))}

            <button onClick={nextItem} disabled={pageGroupStart + 5 > totalPages}>
                <HiChevronRight />
            </button>
        </section>
    );
};

export default Pagination;