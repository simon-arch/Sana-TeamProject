export default interface Plan {
    id: number,
    title: string,
    description: string | null,
    timeStart: Date,
    timeEnd: Date,
    owner: string
}