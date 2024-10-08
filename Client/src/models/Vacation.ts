export default interface Vacation {
    id: number,
    description: string | null,
    status: VacationStatus,
    sender: string,
    startDate: Date,
    endDate: Date,
}

export enum VacationStatus {
    Approved = 'APPROVED',
    Pending = 'PENDING',
    Rejected = 'REJECTED'
}