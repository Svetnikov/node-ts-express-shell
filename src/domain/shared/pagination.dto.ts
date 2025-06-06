export class PaginationDto {
    private constructor(
        public readonly page: number,
        public readonly limit: number
    ){}

    static create( page: number = 1, limit: number = 10 ): [string?, PaginationDto?] {
        if ( isNaN(page) || isNaN(limit)) return ['Page and Limit must be numbers']
            
        

        if (page <= 0 || limit <= 0) return ['Page or/and limit must be numbers']

        return [undefined, new PaginationDto(page, limit)]

        
    }
    
}