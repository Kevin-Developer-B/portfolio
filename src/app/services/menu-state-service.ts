import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MenuStateService {
    private isOpen$ = new BehaviorSubject<boolean>(false);

    /**
    * Opens the component by setting its state to true.
    */
    open() { 
        this.isOpen$.next(true); 
    }

    /**
    * Closes the component by setting its state to false.
    */
    close() { 
        this.isOpen$.next(false); 
    }

    /**
    * Returns an observable of the current open/close state.
    * @returns {Observable<boolean>}
    */
    state$() {
        return this.isOpen$.asObservable();
    }
}
