import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Visite } from '../../models/visite.model';
import { Medecin } from '../../models/medecin.model';
import { Patient } from '../../models/patient.model';
import { CassandraService } from '../../services/cassandra.service';
import { MongodbService } from '../../services/mongodb.service';
@Component({
  selector: 'app-create-visites',
  templateUrl: './create-visites.component.html',
  styleUrls: ['./create-visites.component.css']
})
export class CreateVisitesComponent implements OnInit {
  visite: Visite = {
    uuid: '', // Remplissez avec des valeurs par défaut si nécessaire
    dateVisite: '',
    heureVisite: '',
    medecinId: '',
    patientId: '',
    motifVisite: '',
    notesMedecin: '',
    prescription: ''
  };
  medecins: Medecin[] = [];
  patients: Patient[] = [];
  constructor( private router: Router,
               private cassandraService: CassandraService,
               private mongodbService: MongodbService) { }

  ngOnInit(): void {
    this.getCassandraMedecins();
    this.getMongoMedecins();
    this.getCassandraPatients();
    this.getMongoPatients();
  }
  getCassandraMedecins(): void {
    this.cassandraService.getAllMedecins().subscribe(
      medecins => {
        this.medecins = medecins;
      },
      error => {
        console.error('Error fetching medecins:', error);
      }
    );
  }
  getMongoMedecins(): void {
    this.mongodbService.getAllMedecins().subscribe(
      medecins => {
        this.medecins = medecins;
      },
      error => {
        console.error('Error fetching medecins:', error);
      }
    );
  }
  getCassandraPatients(): void {
    this.cassandraService.getAllPatients().subscribe(
      patients => {
        this.patients = patients;
      },
      error => {
        console.error('Error fetching patients:', error);
      }
    );
  }
  getMongoPatients(): void {
    this.mongodbService.getAllPatients().subscribe(
      patients => {
        this.patients = patients;
      },
      error => {
        console.error('Error fetching patients:', error);
      }
    );
  }
  createVisiteCassandra(): void {
    this.cassandraService.createVisite(this.visite).subscribe(
      () => {
        console.log('Visite created successfully (Cassandra)');
        this.router.navigate(['/visites']);
      },
      error => {
        console.error('Error creating visite (Cassandra):', error);
      }
    );
  }

  createVisiteMongo(): void {
    this.mongodbService.createVisite(this.visite).subscribe(
      () => {
        console.log('Visite created successfully (Mongo)');
        this.router.navigate(['/visites']);
      },
      error => {
        console.error('Error creating visite (Mongo):', error);
      }
    );
  }
}
