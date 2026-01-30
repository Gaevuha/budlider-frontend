import ReactPaginate from 'react-paginate';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './Pagination.module.css';

interface PaginationProps {
  pageCount: number;
  currentPage: number;
  onPageChange: (selectedItem: { selected: number }) => void;
  pageRangeDisplayed?: number;
  marginPagesDisplayed?: number;
}

export function Pagination({
  pageCount,
  currentPage,
  onPageChange,
  pageRangeDisplayed = 3,
  marginPagesDisplayed = 2,
}: PaginationProps) {
  if (pageCount <= 1) {
    return null;
  }

  return (
    <div className={styles.paginationWrapper}>
      <ReactPaginate
        pageCount={pageCount}
        pageRangeDisplayed={pageRangeDisplayed}
        marginPagesDisplayed={marginPagesDisplayed}
        onPageChange={onPageChange}
        forcePage={currentPage}
        containerClassName={styles.container}
        pageClassName={styles.pageItem}
        pageLinkClassName={styles.pageLink}
        activeClassName={styles.active}
        activeLinkClassName={styles.activeLink}
        previousClassName={styles.previousItem}
        nextClassName={styles.nextItem}
        previousLinkClassName={styles.previousLink}
        nextLinkClassName={styles.nextLink}
        disabledClassName={styles.disabled}
        disabledLinkClassName={styles.disabledLink}
        breakClassName={styles.breakItem}
        previousLabel={<ChevronLeft className="w-5 h-5" />}
        nextLabel={<ChevronRight className="w-5 h-5" />}
        breakLabel="..."
      />
    </div>
  );
}
