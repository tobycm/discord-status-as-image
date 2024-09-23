import { RefinerUser } from './models';

export default class Refiner {
  constructor(readonly endpoint: string) {}

  /*
   * Fetches user data from the Refiner API
   *
   * @throws if the request fails
   */
  async getUserData(id: string) {
    const response = await fetch(`${this.endpoint}/user/${id}`);
    if (response.status === 404) return;
    return response.json() as Promise<RefinerUser>;
  }
}
