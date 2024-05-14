import { Component, OnInit } from '@angular/core';
import { Medecin } from '../../models/medecin.model';
import { CassandraService } from '../../services/cassandra.service';
import { MongodbService } from '../../services/mongodb.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-read',
  templateUrl: './read.component.html',
  styleUrls: ['./read.component.css']
})
export class ReadComponent implements OnInit {
  cassandraMedecins: Medecin[] = [];
  mongodbMedecins: Medecin[] = [];

  constructor(private cassandraService: CassandraService, private mongodbService: MongodbService , private router: Router) { }

  ngOnInit(): void {
    this.getCassandraMedecins();
    this.getMongoDBMedecins();
  }

  getCassandraMedecins(): void {
    const startTimeCassandra = performance.now(); // Mesurer le temps de départ pour Cassandra
    this.cassandraService.getAllMedecins().subscribe(
      medecins => {
        const endTimeCassandra = performance.now(); // Mesurer le temps d'arrêt pour Cassandra
        const elapsedTimeCassandra = endTimeCassandra - startTimeCassandra; // Calculer le temps écoulé pour Cassandra

        console.log('Cassandra medecins fetched in', elapsedTimeCassandra, 'milliseconds');

        this.cassandraMedecins = medecins;
      },
      error => {
        console.error('Error fetching Cassandra medecins:', error);
      }
    );
  }

  getMongoDBMedecins(): void {
    const startTimeMongo = performance.now(); // Mesurer le temps de départ pour MongoDB
    this.mongodbService.getAllMedecins().subscribe(
      medecins => {
        const endTimeMongo = performance.now(); // Mesurer le temps d'arrêt pour MongoDB
        const elapsedTimeMongo = endTimeMongo - startTimeMongo; // Calculer le temps écoulé pour MongoDB

        console.log('MongoDB medecins fetched in', elapsedTimeMongo, 'milliseconds');

        this.mongodbMedecins = medecins;
      },
      error => {
        console.error('Error fetching MongoDB medecins:', error);
      }
    );
  }
  navigateToUpdate(id: string): void {
    this.router.navigate(['/update', id]); // Navigate to update component with the id parameter
  }
  // ReadComponent
  updateMedecin(medecin: Medecin): void {
    const uuid = medecin?.uuid; // Use optional chaining to handle potential undefined values
    if (uuid) {
      this.router.navigate(['/update', uuid]); // Navigate to update component with the id parameter
    } else {
      console.error('ID is undefined');
    }
  }





  deleteMedecinCassandra(medecin: Medecin): void {
    const uuid = medecin?.uuid;
    if (uuid) {
      this.cassandraService.deleteMedecin(uuid).subscribe(
        () => {
          // Mettez à jour la liste des médecins après la suppression
          this.getCassandraMedecins();
        },
        error => {
          console.error('Error deleting medecin (Cassandra):', error);
        }
      );
    } else {
      console.error('ID is undefined');
    }
  }
  deleteMedecinMongo(medecin: Medecin): void {
    const uuid = medecin?.uuid;
    if (uuid) {
      this.mongodbService.deleteMedecin(uuid).subscribe(
        () => {
          // Mettez à jour la liste des médecins après la suppression
          this.getMongoDBMedecins();
        },
        error => {
          console.error('Error deleting medecin (Mongo):', error);
        }
      );
    } else {
      console.error('ID is undefined');
    }
  }

  deleteAllMedecins(): void {
    const startTimeCassandra = performance.now(); // Mesurer le temps de départ pour Cassandra
    // Supprimer tous les médecins de Cassandra
    this.cassandraService.deleteAllMedecins().subscribe(
      () => {
        const endTimeCassandra = performance.now(); // Mesurer le temps d'arrêt pour Cassandra
        const elapsedTimeCassandra = endTimeCassandra - startTimeCassandra; // Calculer le temps écoulé pour Cassandra

        console.log('Tous les médecins de Cassandra ont été supprimés en', elapsedTimeCassandra, 'millisecondes');

        const startTimeMongo = performance.now(); // Mesurer le temps de départ pour MongoDB
        // Supprimer tous les médecins de MongoDB
        this.mongodbService.deleteAllMedecins().subscribe(
          () => {
            const endTimeMongo = performance.now(); // Mesurer le temps d'arrêt pour MongoDB
            const elapsedTimeMongo = endTimeMongo - startTimeMongo; // Calculer le temps écoulé pour MongoDB

            console.log('Tous les médecins de MongoDB ont été supprimés en', elapsedTimeMongo, 'millisecondes');
          },
          error => {
            console.error('Error deleting all medecins (MongoDB):', error);
          }
        );
      },
      error => {
        console.error('Error deleting all medecins (Cassandra):', error);
      }
    );
  }

}
