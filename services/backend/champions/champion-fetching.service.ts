import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BackendProperties} from '../BackendProperties';
import {Observable} from 'rxjs';
import {ChampionListResponse} from '../../../models/backend/champions/ChampionListResponse';
import {ChampionResponse} from '../../../models/backend/champions/ChampionResponse';

@Injectable({
  providedIn: 'root'
})
export class ChampionFetchingService {

  private backendProperties: BackendProperties;

  constructor(private httpClient: HttpClient) {
    this.backendProperties = new BackendProperties();
  }

  getAllChampions(): Observable<ChampionListResponse | null> {
  return this.httpClient
      .get<ChampionListResponse | null>(this.backendProperties.getAllChampionsUrl());
  }

  getChampionByName(name: string): Observable<ChampionResponse | null> {
    return this.httpClient
      .get<ChampionResponse | null>(this.backendProperties.getChampionByNameUrl(name));
  }

  /**
   * No body is required so it is empty
   * @param name
   * @param skinId
   * @param owned
   */
  //"/{name}/skins/{skin}/ownership"
  updateOwnedChampionSkin(name: string, skinId: string, owned: boolean) {
    return owned ? this.httpClient.put(this.backendProperties.getOwnedSkinEndpoints(name,skinId),{})
      : this.httpClient.delete(this.backendProperties.getOwnedSkinEndpoints(name,skinId));
  }
}
