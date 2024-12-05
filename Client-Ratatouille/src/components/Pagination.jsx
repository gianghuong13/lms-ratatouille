import React from 'react'

const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange}) => {

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const pageNumbers = [...Array(totalPages).keys()].map(i => i + 1);

    const firstItemIndex = (currentPage - 1) * itemsPerPage + 1;
    const lastItemIndex = Math.min(currentPage * itemsPerPage, totalItems);

    const handlePageChange = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            onPageChange(pageNumber);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const handlePrev = () => { 
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    return (
        <div className="pagination">
            
            <div className='text-sm text-gray-600'>
                Showing {firstItemIndex} to {lastItemIndex} of {totalItems} entries
            </div>
            
            <div className='pagination-container flex justify-end items-center mt-2'>
                <button 
                    onClick={handlePrev}
                    className='px-4 py-2 bg-gray-300 rounded-xl disabled:bg-gray-100 mr-2'
                    disabled={currentPage === 1}
                >
                    Prev
                </button>

                <div className='page-numbers flex items-center'>
                    {pageNumbers.map(pageNumber => (
                        <button
                            key={pageNumber}
                            onClick={() => handlePageChange(pageNumber)}
                            className={`px-3 py-2 mx-1 border rounded-xl ${pageNumber === currentPage ? 'bg-blue-500 text-white' : 'bg-white'}`}
                        >
                            {pageNumber}
                        </button>
                    
                    ))}
                </div>

                <button
                    onClick={handleNext}
                    className='px-4 py-2 bg-gray-300 rounded-xl disabled:bg-gray-100 ml-2'
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    )
}

export default Pagination