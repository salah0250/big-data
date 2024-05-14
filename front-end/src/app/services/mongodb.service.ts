// mongo

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Medecin } from '../models/medecin.model';
import { Visite } from '../models/visite.model';
import {Patient} from "../models/patient.model";

@Injectable({
  providedIn: 'root'
})
export class MongodbService {
  private baseUrl = 'http://localhost:8080/api/mongo'; // Mettez Ã  jour l'URL en fonction de votre configuration

  constructor(private http: HttpClient) { }

  // Medecins

  getAllMedecins(): Observable<Medecin[]> {
    return this.http.get<Medecin[]>(`${this.baseUrl}/getmedecins`);
  }
  getMedecinById(uuid: string): Observable<Medecin> {
    return this.http.get<Medecin>(`${this.baseUrl}/getmedecin/${uuid}`);
  }
  createMedecin(medecin: Medecin): Observable<Medecin> {
    return this.http.post<Medecin>(`${this.baseUrl}/addmedecin`, medecin);
  }

  createMedecins(medecins: Medecin[]): Observable<Medecin[]> {
    return this.http.post<Medecin[]>(`${this.baseUrl}/addmedecins`, medecins);
  }

  updateMedecin(uuid: string, medecin: Medecin): Observable<Medecin> {
    return this.http.put<Medecin>(`${this.baseUrl}/upmedecin/${uuid}`, medecin);
  }

  deleteMedecin(uuid: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/deletemedecin/${uuid}`);
  }

  deleteAllMedecins(): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/deletemedecins`);
  }


// Visites

  getAllVisites(): Observable<Visite[]> {
    return this.http.get<Visite[]>(`${this.baseUrl}/getvisites`);
  }

  getVisiteById(uuid: string): Observable<Visite> {
    return this.http.get<Visite>(`${this.baseUrl}/getvisite/${uuid}`);
  }

  createVisite(visite: Visite): Observable<Visite> {
    return this.http.post<Visite>(`${this.baseUrl}/addvisite`, visite);
  }

  updateVisite(uuid: string, visite: Visite): Observable<Visite> {
    return this.http.put<Visite>(`${this.baseUrl}/upvisite/${uuid}`, visite);
  }

  deleteVisite(uuid: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/deletevisite/${uuid}`);
  }

  // Patient


  getAllPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${this.baseUrl}/getpatients`);
  }

  getPatientById(uuid: string): Observable<Patient> {
    return this.http.get<Patient>(`${this.baseUrl}/getpatient/${uuid}`);
  }

  createPatient(patient: Patient): Observable<Patient> {
    return this.http.post<Patient>(`${this.baseUrl}/addpatient`, patient);
  }

  updatePatient(uuid: string, patient: Patient): Observable<Patient> {
    return this.http.put<Patient>(`${this.baseUrl}/uppatient/${uuid}`, patient);
  }

  deletePatient(uuid: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/deletepatient/${uuid}`);
  }


}
