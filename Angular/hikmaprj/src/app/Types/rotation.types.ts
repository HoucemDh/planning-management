export interface rotationMp {
    dispoof: number;
    article: string;
    designation: string;
}

export interface PageInfo {
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

export interface rotationResponse {
    content: rotationMp[];
    pageInfo: PageInfo;
}
