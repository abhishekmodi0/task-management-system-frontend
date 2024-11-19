import { usePagination, DOTS } from './usePagination';

const Pagination = props => {
  const {
    onPageChange,
    totalCount,
    siblingCount = 1,
    currentPage,
    pageSize,
  } = props;
  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize
  });

  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  let lastPage = paginationRange[paginationRange.length - 1];
  return (
    <ul style={{'cursor': 'pointer'}}
      className={'pagination'}
    >
      <li className={(currentPage === 1) ? 'page-item disabled' : 'page-item'}>
        <span onClick={onPrevious} className="page-link">Previous</span>
      </li>
      {paginationRange.map(pageNumber => {
        if (pageNumber === DOTS) {
          return <li key={pageNumber} className="page-item dots">&#8230;</li>;
        }

        return (
          <li className={pageNumber === currentPage ? "page-item active" : 'page-item'}>
            <span className="page-link"  onClick={() => onPageChange(pageNumber)}>{pageNumber}</span>
          </li>
        );
      })}
      <li 
        className={(currentPage === lastPage) ?  "page-item disabled" : 'page-item'}>
        <span onClick={onNext} className="page-link">Next</span>
      </li>
    </ul>
  );
};

export default Pagination;
