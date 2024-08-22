export default interface TimeStamp {
    id: number,
    username: string,
    timeStart: Date,
    timeEnd: Date | null,
    source: Source,
    editor: string | null
}

export enum Source {
    System = 'SYSTEM',
    User = 'USER',
    Timer = 'TIMER'
}