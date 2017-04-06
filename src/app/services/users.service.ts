import { Injectable } from '@angular/core';

@Injectable()
export class UsersService {

  constructor() { }

  isActualUser(itemId, userId) {
    return itemId && userId && itemId === userId;
  }

}
