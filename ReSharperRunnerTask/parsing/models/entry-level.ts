// We take the sarif levels, see https://docs.oasis-open.org/sarif/sarif/v2.1.0/errata01/os/sarif-v2.1.0-errata01-os-complete.html#_Toc141790898
export enum EntryLevel {
    None = 0,
    Note = 1,
    Warning = 2,
    Error = 3
}