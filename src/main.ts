import {Movie} from "./models/movie";
import {Service} from "./services/service";
import { MovieStorage } from "./services/movieStorage";

class Main {
    private dataService: Service = new Service();
    private storage = new MovieStorage();
    movies: Movie[] = [];
    favoriteMovies: Movie[] = [];
    constructor(){}

    start(): void{
        
        this.displayStoredFavorites();
        const btn: HTMLElement | null = document.getElementById("s-btn");
        if(btn){
            btn.addEventListener("click", ()=>{this.fetchMovies()});
        }

        document.addEventListener('click',(event: MouseEvent)=> {this.addToFavorites(event)});
        document.addEventListener('click',(event: MouseEvent)=> {this.removeFromFavorites(event)});
                
    }


    addToFavorites(event: MouseEvent): void{
        const event_cast_type = event as any;
        // Check if the clicked element is not heart, return
        if (!event_cast_type.target.matches('.heart')){return;}
        let id = event_cast_type.target.parentElement.parentElement.getAttribute(`id`);
        //add to favorites if it is not there
        if(!this.isInFavorites(id)){
            let movie = this.getMovieById(id);
            this.favoriteMovies.push(movie);
            //localStorage
            this.storage.storeList(this.favoriteMovies, `favorites`);
            this.displayFavorite(movie);
            this.updateNumberFavorites();
        }
    }


    removeFromFavorites(event: MouseEvent): void{
        const event_cast_type = event as any;
        // Check if the clicked element is not trash, return
        if (!event_cast_type.target.matches('.trash')){return;}
        let id = event_cast_type.target.parentElement.parentElement.getAttribute(`id`);
        let removeIndex = 0;
        this.favoriteMovies.forEach((item, idx)=>{
            if(item.getId === id){removeIndex = idx}
        });
        this.favoriteMovies.splice(removeIndex, 1);
        //localStorage
        this.storage.storeList(this.favoriteMovies, `favorites`);
        event_cast_type.target.parentElement.parentElement.remove();
        this.updateNumberFavorites();
    }


    isInFavorites(id: string): boolean{
        let contains = false;
        this.favoriteMovies.forEach((item)=>{
            if(item.getId === id){contains = true;}
        });
        return contains;
    }


    getMovieById(id: string): Movie{
        //find index
        let movieIndex: number = 0;
        this.movies.forEach((item, idx)=>{
            if(item.getId === id){movieIndex = idx;}
        });
        return this.movies[movieIndex];
    }


    //fetches the searched movie
    async fetchMovies(): Promise<void>{
        let inputValue = this.getInputValue();
        let data: [Movie[], string] = await this.dataService.getData(inputValue); 
        this.displayMovies(data);    
    }



    //Returns value from input
    getInputValue(): string{

        let input = (<HTMLInputElement>document.getElementById("movieSearch")).value;
        //Empty the input field
        (<HTMLInputElement>document.getElementById("movieSearch")).value = "";
        input = input.trim();
        input = input.split(' ').join('+');
        
        return input;
    }



    // Takes tuple of Movie array and totalResults 
    // Displays movie result on page
    displayMovies(movieTuple: [Movie[], string]): void{
        
        const message = document.getElementById("message");
        const wrapper = document.getElementsByClassName("wrapper")[0];
        this.movies = movieTuple[0];
        const total = movieTuple[1];
        wrapper.innerHTML = "";
        //Check if there are movies
        if (this.movies.length){
            message.innerHTML = `${this.movies.length} movies of ${total}`;
            //let content = "";
            
            this.movies.forEach((movie, idx)=>{
                let movieContainer = this.createMovieContainer(movie, `&#10084;`, `heart`);
                wrapper.appendChild(movieContainer);
            });                
        }
        else{
            message.innerHTML = `Could not find the movie`;        
        }    
    }


    displayFavorite(movie: Movie){
        const favoritesContainer = document.getElementsByClassName("wrapper")[1];
        let movieContainer = this.createMovieContainer(movie, `&#128465;`, `trash`);
        favoritesContainer.appendChild(movieContainer);
    }


    //lägg till parametrar icon: string och iconClass: string
    createMovieContainer(movie: Movie, icon: string, iconClass: string): HTMLDivElement{
        let movieContainer: HTMLDivElement = document.createElement(`div`);
        movieContainer.className = `mv`;
        movieContainer.setAttribute(`id`, `${movie.getId}`);
        let content: string = "";
        content += `<div class="img-container">`;
                
            if(movie.getPoster != "N/A"){
                content += `<img src="${movie.getPoster}" alt="movie poster">`;
            }
            else{ content += `<img src="https://i.postimg.cc/Hky5tTRj/noimage.png" alt="poster is missing">`; }
            content += `</div>`;
            let titleStr: string = movie.getTitle;
            let hiddenTitle = "";
            if(titleStr.length > 38){
                titleStr = `${titleStr.substr(0, 35)}...`;
                hiddenTitle = `data-toggle="tooltip" title="${movie.getTitle}"`;
            }
            content += `<div class="text" ${hiddenTitle}><p><b>${titleStr}</b><br><span>${movie.getYear}</span></p>
            <span class="${iconClass}" data-toggle="tooltip" title="favorite">${icon}</span></div>`;

            movieContainer.innerHTML = content;
        return movieContainer;
    }


    displayStoredFavorites(): void{
        this.storage.retrieveList(this.favoriteMovies, `favorites`);
        this.favoriteMovies.forEach((item)=>{
            this.displayFavorite(item);
        });
        this.updateNumberFavorites();   
    }


    updateNumberFavorites(): void{
        const numFavorites = document.getElementById("number-items");
        if(this.favoriteMovies.length > 0){
            numFavorites.innerHTML = `${this.favoriteMovies.length}`;
        }
        else{numFavorites.innerHTML = "";}
        
    }
    
} // end class Main





window.onload = function(){
    let main = new Main();
    main.start();


    const topBtn = document.getElementById("topBtn");
    topBtn.addEventListener("click", toTop);


    function toTop(): void {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }


    window.onscroll = function() {scrollFunction()};
    //Show button for scrolling up
    function scrollFunction(): void {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            topBtn.style.display = "block";
        } else {
            topBtn.style.display = "none";
        }
    }
}



