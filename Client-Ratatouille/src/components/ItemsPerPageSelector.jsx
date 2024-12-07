import React from 'react'

const ItemsPerPageSelector = ({ itemsPerPage, onItemsPerPageChange }) => {
    const options = [10, 15, 20, 50];

    return (
        <div className='items-per-page flex items-center'>
            <select id="itemsPerPage" 
                    value={itemsPerPage} 
                    onChange={(e) => onItemsPerPageChange(parseInt(e.target.value))} 
                    className='border border-gray-400 p-2 rounded-3xl'>
                {options.map(option => (
                    <option key={option} value={option} className=''>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    )
}

export default ItemsPerPageSelector;