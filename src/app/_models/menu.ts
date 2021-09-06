/**
 * creates a model to receive data from the menu service
 */

 export class Menu {
    id: string;
    title: string;
    subItems: any = {
        id:'',
        title:''
    };
    
    constructor(values: Object = {}) {
      // Constructor initialization
      Object.assign(this, values);
    }
 }