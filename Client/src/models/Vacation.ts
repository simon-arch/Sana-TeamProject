export default interface Vacation {
    id: number,
    title: string,
    description: string | null,
    status: VacationStatus,
    sender: string,
    startDate: Date,
    endDate: Date,
}

export enum VacationStatus {
    Pending = 'PENDING',
    Approved = 'APPROVED',
    Rejected = 'REJECTED'
}