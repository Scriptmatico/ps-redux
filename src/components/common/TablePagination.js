import React from 'react';
import PropTypes from 'prop-types';

const TablePagination = ({
  pages,
  active = 1,
  itemsPerPage,
  onPageClick,
  onItemsPerPageChange,
}) => {
  const itemsPerPageMenu = ['5', '10', '15', '20', '100'];
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
        <ul className="pagination">
          <li className={active === 1 ? 'page-item disabled' : 'page-item'}>
            <button
              className="page-link"
              onClick={() => onPageClick(active - 1)}
            >
              <span aria-hidden="true">&laquo;</span>
            </button>
          </li>
          {pageElements}
          <li className={active === pages ? 'page-item disabled' : 'page-item'}>
            <button
              className="page-link"
              onClick={() => onPageClick(active + 1)}
            >
              <span aria-hidden="true">&raquo;</span>
            </button>
          </li>
        </ul>
      </div>
      <div className="col align-self-end">
        <ul className="pagination" style={{ float: 'right' }}>
          <li>
            <span>Items per page:</span>
          </li>
          <li>
            <span aria-hidden="true">&nbsp;&nbsp;&nbsp;</span>
          </li>
          <li>
            <select
              className="custom-select"
              onChange={onItemsPerPageChange}
              defaultValue={itemsPerPage}
            >
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
  onItemsPerPageChange: PropTypes.func.isRequired,
  active: PropTypes.number,
  itemsPerPage: PropTypes.number,
};

export default TablePagination;
