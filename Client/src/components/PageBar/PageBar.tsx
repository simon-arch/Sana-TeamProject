import {Pagination} from "react-bootstrap";

interface Props {
    pageSize: number,
    totalCount: number,
    page: number,
    setPage(prevState: number): void
}

function* iterator(from: number, to: number) {
    for (let i = from; i <= to; i++) {
        yield i;
    }
}

const PageBar = (props: Props) => {
    const totalPages = Math.ceil(props.totalCount / props.pageSize);

    const paginationItems = (from: number, to: number) =>
        [...iterator(from, to)].map(current =>
            <Pagination.Item
                key={current}
                active={props.page === current}
                onClick={() => props.setPage(current)}
            >{current}</Pagination.Item>)

    return (
        <Pagination>
            <Pagination.Prev disabled={props.page === 1} onClick={() => {
                props.page > 1 && props.setPage(props.page - 1);
            }}/>
            {
                totalPages > 7
                ? (
                    props.page < 4 ? <>
                        { paginationItems(1, 5) }
                        <Pagination.Ellipsis/>
                        <Pagination.Item onClick={() => props.setPage(totalPages)}>{totalPages}</Pagination.Item>
                    </>
                    : totalPages - props.page >= 4 ?  <>
                        <Pagination.Item onClick={() => props.setPage(1)}>1</Pagination.Item>
                        <Pagination.Ellipsis/>
                        { paginationItems(props.page - 1, props.page + 1) }
                        <Pagination.Ellipsis/>
                        <Pagination.Item onClick={() => props.setPage(totalPages)}>{totalPages}</Pagination.Item>
                    </>
                    : <>
                        <Pagination.Item onClick={() => props.setPage(1)}>1</Pagination.Item>
                        <Pagination.Ellipsis/>
                        { paginationItems(totalPages - 4, totalPages) }
                    </>
                ) : paginationItems(1, totalPages)
            }
            <Pagination.Next disabled={props.page === totalPages} onClick={() => {
                props.page < totalPages && props.setPage(props.page + 1);
            }}/>
        </Pagination>
    );
};

export default PageBar;