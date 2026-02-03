
type RequestMock ={
  method: Http_Methods,
    host: string,
    path: string,
    body?: UserMock,
    params: {id?:string},
}
type ObserverMethods = {
    next: <T>(request: T) => { status: Http_Methods };
    error?: (error: HttpErrorResponse) => { status: Http_Methods };
    complete: () => void;
  };
type UserMock ={
    name: string,
    age: number,
    roles: Array<string>,
    createdAt: Date,
    isDeleated: boolean,
  };
enum Http_Methods {
  HTTP_POST_METHOD = 'POST',
  HTTP_GET_METHOD = 'GET',

  HTTP_STATUS_OK = 200,
  HTTP_STATUS_INTERNAL_SERVER_ERROR = 500,
}
interface IObservervable{
    _subscribe: (observer: Observer<T>) => () => void;
}
interface IObserver{
     handlers: ObserverMethods;
     isUnsubscribed: boolean;
     _unsubscribe: () => void;
}
class Observer implements IObserver {
    handlers: ObserverMethods;
    isUnsubscribed: boolean;
    // _unsubscribe: () => void;
    // isUnsubscribed: boolean;
  constructor(handlers : ObserverMethods) {
    this.handlers = handlers;
    this.isUnsubscribed = false;
  }
    _unsubscribe: () => void;
    
    

  next(value : Observer<T>) {
    if (this.handlers.next && !this.isUnsubscribed) {
      this.handlers.next(value);
    }
  }

  error(error:) {
    if (!this.isUnsubscribed) {
      if (this.handlers.error) {
        this.handlers.error(error);
      }

      this.unsubscribe();
    }
  }

  complete() {
    if (!this.isUnsubscribed) {
      if (this.handlers.complete) {
        this.handlers.complete();
      }

      this.unsubscribe();
    }
  }

  unsubscribe() {
    this.isUnsubscribed = true;

    if (this._unsubscribe) {
      this._unsubscribe();
    }
  }
}

class Observable implements IObservervable {
  constructor(subscribe: { (observer: Observer<T>): () => void; (observer: Observer<T>): () => void; }) {
    this._subscribe = subscribe;
  }
    _subscribe: (observer: Observer<T>) => () => void;
  static from(values) {
    return new Observable((observer) => {
      values.forEach((value) => observer.next(value));

      observer.complete();

      return () => {
        console.log('unsubscribed');
      };
    });
  }

  subscribe(obs:ObserverMethods):{unsubscribe():void} {
    const observer = new Observer(obs);

    observer._unsubscribe = this._subscribe(observer);

    return ({
      unsubscribe() {
        observer.unsubscribe();
      }
    });
  }
}



const userMock:UserMock = {
  name: 'User Name',
  age: 26,
  roles: [
    'user',
    'admin'
  ],
  createdAt: new Date(),
  isDeleated: false,
};

const requestsMock :Array<RequestMock> = [
  {
    method: Http_Methods.HTTP_POST_METHOD,
    host: 'service.example',
    path: 'user',
    body: userMock,
    params: {}
  },
  {
    method: Http_Methods.HTTP_GET_METHOD,
    host: 'service.example',
    path: 'user',
    params: {
      id: '3f5h67s4s'
    },
  }
];

const handleRequest = (request: T ) => {
  // handling of request
  return {status: Http_Methods.HTTP_STATUS_OK};
};
const handleError = (error:HttpErrorResponse) => {
  // handling of error
  return {status: Http_Methods.HTTP_STATUS_INTERNAL_SERVER_ERROR};
};

const handleComplete = () => console.log('complete');

const requests$ = Observable.from(requestsMock);

const subscription = requests$.subscribe({
  next: handleRequest,
  error: handleError,
  complete: handleComplete
});

subscription.unsubscribe();
