export default interface ResultSet<T> {
    totalCount: number;
    results: T[];
}