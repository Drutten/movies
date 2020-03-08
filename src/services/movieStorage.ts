import { Movie } from "../models/movie";

export class MovieStorage {

    storeList(arr: Movie[], storageName: string): void{
        //Check if browser has webStorage
        if(typeof(Storage) !== "undefined"){           
            localStorage.setItem(storageName, JSON.stringify(arr));           
        }
    }


    retrieveList(arr: Movie[], storageName: string): void{
        //Check if browser has webStorage
        if(typeof(Storage) !== "undefined"){

            //Check if list is defined in localStorage
            if(localStorage.getItem(storageName)){

                //Retrieve from localStorage
                let tempList: any[];
                let temp: string | null = localStorage.getItem(storageName); 
                tempList = (temp)? JSON.parse(temp) : [];
                
                if(tempList.length > 0){
                    arr.length = 0;
                    tempList.forEach((item: any) => {
                        arr.push(new Movie(item.title, item.year, item.id, item.poster));
                    });
                }
            }    
        }
        else{
            let message = document.getElementById("message");
            message.innerHTML = `This browser does not support local storage`;
        }    
    }

}