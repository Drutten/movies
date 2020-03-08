export class Movie {
    
    private title: string;
    private year: string;
    private id: string;
    private poster: string;
    constructor(title: string, year: string, id: string, poster: string){
        this.title = title;
        this.year = year;
        this.id = id;
        this.poster = poster;
    }
    get getTitle(): string{
        return this.title;
    }
    get getYear(): string{
        return this.year
    }
    get getId(): string{
        return this.id;
    }
    get getPoster(): string{
        return this.poster;
    }
    
}