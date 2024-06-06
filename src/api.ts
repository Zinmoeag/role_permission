type successType<T> = {
    status : 200,
    data : T
}

type failedType<T> = {
    status : 404 | 500 | 422,
    message : T
}

// type returnType<data> = successType<data> | failedType<data>;

const fetchFromPlaceHolder = <returnType>(url: string): Promise<returnType> => {
  return fetch(url)
    .then((res) => {
        return res.json() as Promise<returnType>
    })
};  

fetchFromPlaceHolder<
    {
      id: number;
      userId: number;
      title: string;
      completed: boolean;
    }
  | {
      status: 500 | 404;
      message: string;
    }
>("https://jsonplaceholder.typicode.com/todos/9999999").then((res) =>
  console.log(res)
)
.catch(err => {
    console.log(err)
});


//conditionl type

