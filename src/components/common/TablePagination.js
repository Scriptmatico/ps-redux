import React from 'react';
import PropTypes from 'prop-types';

const TablePagination = ({
  pages,
  active = 1,
  onPageClick,
  onPrevious,
  onNext,
  onItemsPerPageChange,
}) => {
  const itemsPerPageMenu = ['1', '5', '10', '15', '20', '100'];
  const pageElements = [...Array(pages).keys()].map(page => (
    <li
      key={page + 1}
      className={page + 1 === active ? 'page-item active' : 'page-item'}
    >
      <button
        className="page-link"
        onClick={e => onPageClick(e.target.value)}
        value={(page + 1).toString()}
      >
        {(page + 1).toString()}
      </button>
    </li>
  ));

  return (
    <div className="row">
      <div className="col align-self-start">
        <ul className="p-2 pagination">
          <li className="page-item">
            <button className="page-link" onClick={onPrevious}>
              <span aria-hidden="true">&laquo;</span>
            </button>
          </li>
          {pageElements}
          <li>
            <button className="page-link" onClick={onNext}>
              <span aria-hidden="true">&raquo;</span>
            </button>
          </li>
        </ul>
      </div>
      <div className="col align-self-end">
        <ul className="p-2 pagination" style={{ float: 'right' }}>
          <li>
            <span>Items per page:</span>
          </li>
          <li>
            <span aria-hidden="true">&nbsp;&nbsp;&nbsp;</span>
          </li>
          <li>
            <select className="custom-select" onChange={onItemsPerPageChange}>
              {itemsPerPageMenu.map(item => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </li>
        </ul>
      </div>
    </div>
  );
};

TablePagination.propTypes = {
  pages: PropTypes.number.isRequired,
  onPageClick: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onItemsPerPageChange: PropTypes.func.isRequired,
  active: PropTypes.number,
};

export default TablePagination;
