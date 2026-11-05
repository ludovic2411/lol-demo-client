export class BackendProperties {

  private _BASE_URL: string = "http://localhost:8080";

  private _CHAMPIONS_ENDPOINT: string = "/champions"

  private _OBJECTS_ENDPOINT: string = '/objects'

  private _LOGIN_ENDPOINT: string = '/login';

  private _LOGOUT_ENDPOINT: string = '/logout';

  private _ASK_RESET_PASSWORD_ENDPOINT = '/reset/token';

  private _SIGNUP_ENDPOINT:string = '/user/create';

  private _AVAILABLE_LANGUAGES_ENDPOINT: string = '/languages/available';

  private _RIOT_HEADER: string = 'X-Riot-Token'

  private _RIOT_TOKEN: string = 'RGAPI-bba8af16-a395-4540-9ee9-de348f5e930b';

  constructor() {}


  get BASE_URL(): string {
    return this._BASE_URL;
  }

  get CHAMPIONS_ENDPOINT(): string {
    return this._CHAMPIONS_ENDPOINT;
  }

  get RIOT_HEADER(): string {
    return this._RIOT_HEADER;
  }

  get RIOT_TOKEN(): string {
    return this._RIOT_TOKEN;
  }


  get OBJECTS_ENDPOINT(): string {
    return this._OBJECTS_ENDPOINT;
  }

  get LOGIN_ENDPOINT(): string {
    return this._LOGIN_ENDPOINT;
  }


  get AVAILABLE_LANGUAGES_ENDPOINT(): string {
    return this._AVAILABLE_LANGUAGES_ENDPOINT;
  }

  getLanguagesAvailableUrl() {
    return `${this.BASE_URL.concat(this._AVAILABLE_LANGUAGES_ENDPOINT)}`;
  }

  getAllObjectsUrl():string {
    return `${this.BASE_URL.concat(this._OBJECTS_ENDPOINT)}`;
  }

  getAllChampionsUrl(): string {
    return `${this.BASE_URL.concat(this.CHAMPIONS_ENDPOINT)}`
  }

  getOwnedSkinEndpoints(name: string, skinId: string): string {
    return `${this.BASE_URL.concat(this.CHAMPIONS_ENDPOINT).concat(`/${name}/skins/${skinId}/ownership`)}` ;
  }

  getLoginUrl(): string {
    return `${this.BASE_URL.concat(this.LOGIN_ENDPOINT)}`
  }

  getLogoutUrl(): string {
    return `${this.BASE_URL.concat(this._LOGOUT_ENDPOINT)}`
  }

  getChampionByNameUrl(name: string) : string {
  return (`${this._BASE_URL.concat(this._CHAMPIONS_ENDPOINT)}/${name}`);
}

getSignupUrl() {
    return `${ this.BASE_URL.concat(this._SIGNUP_ENDPOINT) }`
}

getAskResetPasswordUrl(): string {
    return `${this.BASE_URL.concat(this._ASK_RESET_PASSWORD_ENDPOINT)}`
}

}
