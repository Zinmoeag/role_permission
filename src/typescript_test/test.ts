
type Person<T> = {
    name : string,
    age : T
}



type LoadingType = {
    state : "_loading",
}

type SuccessType = {
    state : "_success",
    data : {
        name : string,
        id : string
    }
}

type Errortype = {
    state : "_error",
    error : {
        status : number,
        message : string,
    }
}

type loadingState = LoadingType | SuccessType | Errortype;

const Union = (idle : loadingState) => {
    switch(idle.state){
        case "_loading": 
            return "loading"
        case "_success":
            console.log(idle.data.id, idle.data.name)
            break;
        case "_error":
            console.log(idle.error.message, idle.error.status)
            break;
    }
}


type List<T> = T[];

type human = {
    name : string,
    num_of_leg : number,
}

type animal = {
    type : string,
    num_of_leg : number,
    num_of_hand : number,
}

const humanList : List<human> = [
    {
        name : "zin",
        num_of_leg : 2
    }
]

class Animal{
    constructor({type, num_of_leg, num_of_hand} : animal) {
        return {
            type : type,
            num_of_hand : num_of_hand,
            num_of_leg : num_of_leg,
        }
    }
}

const animalList :List<animal> = [{type:"cat", num_of_hand: 2, num_of_leg: 2}]