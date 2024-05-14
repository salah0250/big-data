import { Component, OnInit } from '@angular/core';
import { Medecin } from '../../models/medecin.model';
import { CassandraService } from '../../services/cassandra.service';
import { MongodbService } from '../../services/mongodb.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent implements OnInit {
  medecin: Medecin = {
    uuid: '',
    nom: '',
    prenom: '',
    specialite: '',
    horaires: '',
    contact: ''
  };

  constructor(
    private cassandraService: CassandraService,
    private mongodbService: MongodbService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const uuid = params.get('uuid');
      if (uuid) {
        this.cassandraService.getMedecinById(uuid).subscribe(
          medecin => {
            this.medecin = medecin;
          },
          error => {
            console.error('Error fetching medecin:', error);
          }
        );
        this.mongodbService.getMedecinById(uuid).subscribe(
          medecin => {
            this.medecin = medecin;
          },
          error => {
            console.error('Error fetching medecin:', error);
          }
        );
      }
    });
  }


  updateMedecin(): void {
    const uuid = this.medecin.uuid;
    if (uuid) {
      this.cassandraService.updateMedecin(uuid, this.medecin).subscribe(
        updatedMedecin => {
          console.log('Updated medecin (Cassandra):', updatedMedecin);
          // Clear the form or handle success as needed
        },
        error => {
          console.error('Error updating medecin (Cassandra):', error);
        }
      );

      this.mongodbService.updateMedecin(uuid, this.medecin).subscribe(
        updatedMedecin => {
          console.log('Updated medecin (MongoDB):', updatedMedecin);
          // Clear the form or handle success as needed
        },
        error => {
          console.error('Error updating medecin (MongoDB):', error);
        }
      );
    } else {
      console.error('UUID is undefined');
    }
  }

}
