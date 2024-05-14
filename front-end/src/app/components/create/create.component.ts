import { Component, OnInit } from '@angular/core';
import { Medecin } from '../../models/medecin.model'
import { CassandraService } from '../../services/cassandra.service';
import { MongodbService } from '../../services/mongodb.service';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  medecin: Medecin = {
    uuid: '',
    nom: '',
    prenom: '',
    specialite: '',
    horaires: '',
    contact: ''
  };

  constructor(private cassandraService: CassandraService, private mongodbService: MongodbService) { }

  ngOnInit(): void {
  }

  createMedecin(): void {
    this.cassandraService.createMedecin(this.medecin).subscribe(response => {
      console.log('Medecin created in Cassandra:', response);
    });

    this.mongodbService.createMedecin(this.medecin).subscribe(response => {
      console.log('Medecin created in MongoDB:', response);
    });
  }
  // Fonction pour générer aléatoirement des médecins
  generateRandomMedecin(): Medecin {
    const nomList = [
      "Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "Garcia", "Rodriguez", "Martinez",
      "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
      "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson",
      "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores", "Green",
      "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts", "Gomez",
      "Phillips", "Evans", "Turner", "Diaz", "Parker", "Cruz", "Edwards", "Collins", "Reyes", "Stewart",
      "Morris", "Morales", "Murphy", "Cook", "Rogers", "Gutierrez", "Ortiz", "Morgan", "Cooper", "Peterson",
      "Bailey", "Reed", "Kelly", "Howard", "Ramos", "Kim", "Cox", "Ward", "Richardson", "Watson", "Brooks",
      "Chavez", "Wood", "James", "Bennett", "Gray", "Mendoza", "Ruiz", "Hughes", "Price", "Alvarez", "Castillo"
    ];
    const prenomList = [
      "Emma", "Liam", "Olivia", "Noah", "Ava", "Oliver", "Isabella", "William", "Sophia", "Elijah",
      "Charlotte", "James", "Amelia", "Benjamin", "Mia", "Lucas", "Harper", "Henry", "Evelyn", "Alexander",
      "Abigail", "Michael", "Emily", "Daniel", "Ella", "Matthew", "Scarlett", "Jackson", "Grace", "Sebastian",
      "Chloe", "David", "Victoria", "Joseph", "Riley", "Carter", "Aria", "Mateo", "Luna", "John",
      "Penelope", "Wyatt", "Layla", "Owen", "Zoey", "Jack", "Nora", "Luke", "Camila", "Jayden",
      "Hannah", "Dylan", "Bella", "Christopher", "Avery", "Isaac", "Mila", "Gabriel", "Aubrey", "Julian",
      "Lily", "Anthony", "Eleanor", "Jaxon", "Hazel", "Levi", "Ellie", "Muhammad", "Sofia", "Lincoln",
      "Natalie", "Joshua", "Nova", "Andrew", "Madison", "Isaiah", "Stella", "Ezra", "Paisley", "Ryan",
      "Skylar", "Asher", "Everly", "Nathan", "Genesis", "Caleb", "Emilia", "Josiah", "Leah", "Christian",
      "Elizabeth", "Hunter", "Willow", "Eli", "Madelyn", "Connor", "Addison", "Landon", "Elena", "Adrian"
    ];
    const specialiteList = ["Cardiologue", "Dermatologue", "Gynécologue", "Ophtalmologue"];

    const horairesList = ["Matin", "Après-midi", "Soir"];
    const contactList = ["123456789", "987654321", "456789123", "789123456"];

    const randomNom = nomList[Math.floor(Math.random() * nomList.length)];
    const randomPrenom = prenomList[Math.floor(Math.random() * prenomList.length)];
    const randomSpecialite = specialiteList[Math.floor(Math.random() * specialiteList.length)];
    const randomHoraires = horairesList[Math.floor(Math.random() * horairesList.length)];
    const randomContact = contactList[Math.floor(Math.random() * contactList.length)];

    return {
      nom: randomNom,
      prenom : randomPrenom,
      specialite: randomSpecialite,
      horaires: randomHoraires,
      contact: randomContact
    };
  }

// Générer 1000 médecins aléatoires
  generateRandomMedecins(): Medecin[] {
    const medecins: Medecin[] = [];
    for (let i = 0; i < 10000; i++) {
      medecins.push(this.generateRandomMedecin());
    }
    return medecins;
  }

// Insérer tous les médecins générés dans la base de données
  insertMedecinsIntoDatabase(): void {
    const medecins = this.generateRandomMedecins();

    // Pour Cassandra
    const startTimeCassandra = performance.now(); // Mesurer le temps de départ pour Cassandra
    this.cassandraService.createMedecins(medecins).subscribe(
      response => {
        const endTimeCassandra = performance.now(); // Mesurer le temps d'arrêt pour Cassandra
        const elapsedTimeCassandra = endTimeCassandra - startTimeCassandra; // Calculer le temps écoulé pour Cassandra

        console.log('Medecins created in Cassandra:', response);
        console.log('Temps écoulé pour l\'insertion dans Cassandra:', elapsedTimeCassandra, 'millisecondes');
      },
      error => {
        console.error('Erreur lors de la création de médecins dans Cassandra:', error);
      }
    );

    // Pour MongoDB
    const startTimeMongo = performance.now(); // Mesurer le temps de départ pour MongoDB
    this.mongodbService.createMedecins(medecins).subscribe(
      response => {
        const endTimeMongo = performance.now(); // Mesurer le temps d'arrêt pour MongoDB
        const elapsedTimeMongo = endTimeMongo - startTimeMongo; // Calculer le temps écoulé pour MongoDB

        console.log('Medecins created in MongoDB:', response);
        console.log('Temps écoulé pour l\'insertion dans MongoDB:', elapsedTimeMongo, 'millisecondes');
      },
      error => {
        console.error('Erreur lors de la création de médecins dans MongoDB:', error);
      }
    );
  }



}
