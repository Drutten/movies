import { Movie } from "../models/movie";

interface IService {
    getData(inputValue: string): Promise<[Movie[], string]>;
}


export class Service implements IService {
    private api_key: string = "dff00005";
    private urlStart: string = "http://www.omdbapi.com/";
    
    constructor(){}
    
    //Fetches data and returnes tuple of Movie array and totalResults in promise
    async getData(inputValue: string): Promise<[Movie[], string]> {
        
        let url = `${this.urlStart}?apikey=${this.api_key}&s=${inputValue}`;
        let response: Response = await fetch(url, { method: 'GET'});
        let data = await response.json();

        let movies: Movie[] = [];
        let total: string = "";

        if(data.Search){
            total = data.totalResults;

            data.Search.forEach(function(item: any){
                movies.push(new Movie(item.Title, item.Year, item.imdbID, item.Poster));   
            });

        }
        
        let tuple: [Movie[], string] = [movies, total];

        return tuple;

    }

}