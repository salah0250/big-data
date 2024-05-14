import { Component, OnInit } from '@angular/core';
import { Visite } from '../../models/visite.model';
import { CassandraService } from '../../services/cassandra.service';
import { MongodbService } from '../../services/mongodb.service';
import { Router } from '@angular/router';
import {Medecin} from "../../models/medecin.model";

@Component({
  selector: 'app-visites',
  templateUrl: './visites.component.html',
  styleUrls: ['./visites.component.css']
})
export class VisitesComponent implements OnInit {
  cassandravisites: Visite[] = [];
  mongovisites: Visite[] = [];

  constructor(private cassandraService: CassandraService, private mongodbService: MongodbService, private router: Router) { }

  ngOnInit(): void {
    this.getCassandraVisites();
    this.getMongoVisites();
  }

  getCassandraVisites(): void {
    this.cassandraService.getAllVisites().subscribe(
      visites => {
        this.cassandravisites = visites;
      },
      error => {
        console.error('Error fetching visites (Cassandra):', error);
      }
    );
  }
  getMongoVisites(): void {
    this.mongodbService.getAllVisites().subscribe(
      visites => {
        this.mongovisites = visites;
      },
      error => {
        console.error('Error fetching visites (Mongo):', error);
      }
    );
  }
  updateVisite(visite: Visite): void {
    const uuid = visite?.uuid; // Use optional chaining to handle potential undefined values
    if (uuid) {
      this.router.navigate(['/update', uuid]); // Navigate to update component with the id parameter
    } else {
      console.error('ID is undefined');
    }
  }
  deleteCassandraVisite(visite: Visite): void {
    const uuid = visite?.uuid;
    if (uuid) {
      this.cassandraService.deleteVisite(uuid).subscribe(
        () => {
          this.getCassandraVisites();
        },
        error => {
          console.error('Error deleting visite (Cassandra):', error);
        }
      );
    } else {
      console.error('ID is undefined');
    }
  }
  deleteMongoVisite(visite: Visite): void {
    const uuid = visite?.uuid;
    if (uuid) {
      this.mongodbService.deleteVisite(uuid).subscribe(
        () => {
          this.getMongoVisites();
        },
        error => {
          console.error('Error deleting visite (Mongo):', error);
        }
      );
    } else {
      console.error('ID is undefined');
    }
  }
}
