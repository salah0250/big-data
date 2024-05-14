import { Component, OnInit } from '@angular/core';
import {CassandraService} from "../../services/cassandra.service";
import {MongodbService} from "../../services/mongodb.service";
import { Medecin } from '../../models/medecin.model'
import { HttpClient } from '@angular/common/http';


interface MemoryMetrics {
  totalMemory: number | null;
  freeMemory: number | null;
  usedMemory: number | null;
}

interface CPUMetrics {
  cpuUsage: number | null;
}

interface InsertionResult {
  dataSize: number;
  elapsedTimeCassandra: number;
  elapsedTimeMongoDB: number;
  memoryMetricsDiffCassandra: MemoryMetrics | null;
  memoryMetricsDiffMongoDB: MemoryMetrics | null;
  cpuMetricsDiffCassandra: CPUMetrics | null;
  cpuMetricsDiffMongoDB: CPUMetrics | null;
  deleteSpeedCassandra: number;
  deleteSpeedMongoDB: number;
}

@Component({
  selector: 'app-traitement',
  templateUrl: './traitement.component.html',
  styleUrls: ['./traitement.component.css']
})
export class TraitementComponent implements OnInit {
  medecin: Medecin = {
    uuid: '',
    nom: '',
    prenom: '',
    specialite: '',
    horaires: '',
    contact: ''
  };
  results: InsertionResult[] = [];
  resufinals : any[] = [];
  constructor(private cassandraService: CassandraService, private mongodbService: MongodbService, private http: HttpClient) { }

  ngOnInit(): void {
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
  generateRandomMedecins(dataSize: number): Medecin[] {
    const medecins: Medecin[] = [];

    for (let i = 0; i < dataSize; i++) {
      medecins.push(this.generateRandomMedecin());
    }
    return medecins;
  }

  async benchmarkInsert(): Promise<void> {
    const dataSizes = [100,1000,2000,3000,4000];
    for (const size of dataSizes) {
      await this.insertMedecinsIntoDatabase(size);
    }
  }
  async benchmarkInsertManyTime(): Promise<void> {
    const dataSize = 100; // Taille des données à insérer
    const iterations = 25; // Nombre d'itérations

    let totalElapsedTimeCassandra = 0;
    let totalElapsedTimeMongoDB = 0;
    let totalElapsedTimeMongoDBCassandra = 0;
    let totalElapsedTimeMongoDBDelete = 0;
    let totalMemoryMetricsDiffCassandra: MemoryMetrics = { totalMemory: 0, freeMemory: 0, usedMemory: 0 };
    let totalMemoryMetricsDiffMongoDB: MemoryMetrics = { totalMemory: 0, freeMemory: 0, usedMemory: 0 };
    let totalCPUMetricsDiffCassandra: CPUMetrics = { cpuUsage: 0 };
    let totalCPUMetricsDiffMongoDB: CPUMetrics = { cpuUsage: 0 };

    for (let i = 0; i < iterations; i++) {
      // Insérer les médecins dans la base de données
      await this.insertMedecinsIntoDatabase(dataSize);

      // Récupérer les résultats de la dernière insertion
      const lastResult = this.results[this.results.length - 1];

      // Ajouter les temps d'exécution
      totalElapsedTimeCassandra += lastResult.elapsedTimeCassandra;
      totalElapsedTimeMongoDB += lastResult.elapsedTimeMongoDB;

      // Ajouter les différences de mémoire
      /*
      if (lastResult.memoryMetricsDiffCassandra) {
        totalMemoryMetricsDiffCassandra.totalMemory += lastResult.memoryMetricsDiffCassandra.totalMemory || 0 ;
        totalMemoryMetricsDiffCassandra.freeMemory += lastResult.memoryMetricsDiffCassandra.freeMemory || 0;
        totalMemoryMetricsDiffCassandra.usedMemory += lastResult.memoryMetricsDiffCassandra.usedMemory || 0;
      }
      if (lastResult.memoryMetricsDiffMongoDB) {
        totalMemoryMetricsDiffMongoDB.totalMemory += lastResult.memoryMetricsDiffMongoDB.totalMemory || 0;
        totalMemoryMetricsDiffMongoDB.freeMemory += lastResult.memoryMetricsDiffMongoDB.freeMemory || 0;
        totalMemoryMetricsDiffMongoDB.usedMemory += lastResult.memoryMetricsDiffMongoDB.usedMemory || 0;
      }

      // Ajouter les différences de CPU
      if (lastResult.cpuMetricsDiffCassandra) {
        totalCPUMetricsDiffCassandra.cpuUsage += lastResult.cpuMetricsDiffCassandra.cpuUsage || 0;
      }
      if (lastResult.cpuMetricsDiffMongoDB) {
        totalCPUMetricsDiffMongoDB.cpuUsage += lastResult.cpuMetricsDiffMongoDB.cpuUsage || 0;
      }
*/
      // Attendre un court instant pour éviter de surcharger le serveur

      await new Promise(resolve => setTimeout(resolve, 1000));
      // Supprimer les médecins de la base de données
      await this.deleteMedecinsFromDatabase();
      totalElapsedTimeMongoDBCassandra += lastResult.deleteSpeedCassandra;
      totalElapsedTimeMongoDBDelete += lastResult.deleteSpeedMongoDB;
      await new Promise(resolve => setTimeout(resolve, 1000));

    }
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Calculer les moyennes
    const averageElapsedTimeCassandra = totalElapsedTimeCassandra / iterations;
    const averageElapsedTimeMongoDB = totalElapsedTimeMongoDB / iterations;
    const averageElapsedTimeCassandraDelete = totalElapsedTimeMongoDBCassandra / iterations;
    const averageElapsedTimeMongoDBDelete = totalElapsedTimeMongoDBDelete / iterations;
    /*
    const averageMemoryMetricsDiffCassandra: MemoryMetrics = {
      totalMemory: totalMemoryMetricsDiffCassandra.totalMemory / iterations,
      freeMemory: totalMemoryMetricsDiffCassandra.freeMemory / iterations,
      usedMemory: totalMemoryMetricsDiffCassandra.usedMemory / iterations
    };
    const averageMemoryMetricsDiffMongoDB: MemoryMetrics = {
      totalMemory: totalMemoryMetricsDiffMongoDB.totalMemory / iterations,
      freeMemory: totalMemoryMetricsDiffMongoDB.freeMemory / iterations,
      usedMemory: totalMemoryMetricsDiffMongoDB.usedMemory / iterations
    };
    const averageCPUMetricsDiffCassandra: CPUMetrics = {
      cpuUsage: totalCPUMetricsDiffCassandra.cpuUsage / iterations
    };
    const averageCPUMetricsDiffMongoDB: CPUMetrics = {
      cpuUsage: totalCPUMetricsDiffMongoDB.cpuUsage / iterations
    };
*/
    // Afficher les moyennes
    console.log('Moyenne du temps d\'insertion (Cassandra):', averageElapsedTimeCassandra);
    console.log('Moyenne du temps d\'insertion (MongoDB):', averageElapsedTimeMongoDB);
    console.log('Moyenne du temps de delete (Cassandra):', averageElapsedTimeCassandraDelete);
    console.log('Moyenne du temps de delete (MongoDB):', averageElapsedTimeMongoDBDelete);

    this.resufinals.push(averageElapsedTimeCassandra);
    this.resufinals.push(averageElapsedTimeMongoDB);
    this.resufinals.push(averageElapsedTimeCassandraDelete);
    this.resufinals.push(averageElapsedTimeMongoDBDelete);
    /*
    console.log('Moyenne des différences de mémoire (Cassandra):', averageMemoryMetricsDiffCassandra);
    console.log('Moyenne des différences de mémoire (MongoDB):', averageMemoryMetricsDiffMongoDB);
    console.log('Moyenne des différences de CPU (Cassandra):', averageCPUMetricsDiffCassandra);
    console.log('Moyenne des différences de CPU (MongoDB):', averageCPUMetricsDiffMongoDB);
     */
  }


  async insertMedecinsIntoDatabase(dataSize: number): Promise<void> {
    const medecins = this.generateRandomMedecins(dataSize);
    const memoryMetricsBeforeCassandra = await this.fetchMemoryMetrics('http://localhost:8080/api/metrics/cassandra/memory');
    const memoryMetricsBeforeMongoDB = await this.fetchMemoryMetrics('http://localhost:8080/api/metrics/mongodb/memory');
    const cpuMetricsBeforeCassandra = await this.fetchCPUMetrics('http://localhost:8080/api/metrics/cassandra/cpu');
    const cpuMetricsBeforeMongoDB = await this.fetchCPUMetrics('http://localhost:8080/api/metrics/mongodb/cpu');

    // Insertion pour Cassandra
    const startTimeCassandra = performance.now();
    try {
      await this.cassandraService.createMedecins(medecins).toPromise();
    } catch (error) {
      console.error('Erreur lors de l\'insertion dans Cassandra:', error);
    }
    const endTimeCassandra = performance.now();

    // Insertion pour MongoDB
    const startTimeMongo = performance.now();
    try {
      await this.mongodbService.createMedecins(medecins).toPromise();
    } catch (error) {
      console.error('Erreur lors de l\'insertion dans MongoDB:', error);
    }
    const endTimeMongo = performance.now();

    const memoryMetricsAfterCassandra = await this.fetchMemoryMetrics('http://localhost:8080/api/metrics/cassandra/memory');
    const memoryMetricsAfterMongoDB = await this.fetchMemoryMetrics('http://localhost:8080/api/metrics/mongodb/memory');
    const cpuMetricsAfterCassandra = await this.fetchCPUMetrics('http://localhost:8080/api/metrics/cassandra/cpu');
    const cpuMetricsAfterMongoDB = await this.fetchCPUMetrics('http://localhost:8080/api/metrics/mongodb/cpu');

    const memoryMetricsDiffCassandra = this.calculateMetricsDiff(memoryMetricsBeforeCassandra, memoryMetricsAfterCassandra);
    const memoryMetricsDiffMongoDB = this.calculateMetricsDiff(memoryMetricsBeforeMongoDB, memoryMetricsAfterMongoDB);
    const cpuMetricsDiffCassandra = this.calculateCPUMetricsDiff(cpuMetricsBeforeCassandra, cpuMetricsAfterCassandra);
    const cpuMetricsDiffMongoDB = this.calculateCPUMetricsDiff(cpuMetricsBeforeMongoDB, cpuMetricsAfterMongoDB);


    const result: InsertionResult = {
      dataSize,
      elapsedTimeCassandra: endTimeCassandra - startTimeCassandra,
      elapsedTimeMongoDB: endTimeMongo - startTimeMongo,
      memoryMetricsDiffCassandra,
      memoryMetricsDiffMongoDB,
      cpuMetricsDiffCassandra,
      cpuMetricsDiffMongoDB,
      deleteSpeedCassandra : 0,
      deleteSpeedMongoDB : 0
    };

    this.results.push(result);
  }

  async fetchMemoryMetrics(endpoint: string): Promise<MemoryMetrics | undefined> {
    try {
      const response = await this.http.get<any>(endpoint).toPromise();
      const memoryMetrics: MemoryMetrics = {
        totalMemory: response.totalMemory || null,
        freeMemory: response.freeMemory || null,
        usedMemory: response.usedMemory || null
      };
      console.log(memoryMetrics);
      return memoryMetrics;
    } catch (error) {
      console.error('Erreur lors de la récupération des métriques de mémoire:', error);
      return undefined;
    }
  }

  async fetchCPUMetrics(endpoint: string): Promise<CPUMetrics | undefined> {
    try {
      const response = await this.http.get<any>(endpoint).toPromise();
      const cpuMetrics: CPUMetrics = {
        cpuUsage: response.cpuUsage || null
      };
      console.log(cpuMetrics)
      return cpuMetrics;
    } catch (error) {
      console.error('Erreur lors de la récupération des métriques de CPU:', error);
      return undefined;
    }
  }

  calculateMetricsDiff(metricsBefore: MemoryMetrics | undefined, metricsAfter: MemoryMetrics | undefined): MemoryMetrics | null {
    if (metricsBefore && metricsAfter) {
      const diff: MemoryMetrics = {
        totalMemory: metricsAfter.totalMemory !== null && metricsBefore.totalMemory !== null ? metricsAfter.totalMemory - metricsBefore.totalMemory : null,
        freeMemory: metricsAfter.freeMemory !== null && metricsBefore.freeMemory !== null ? metricsAfter.freeMemory - metricsBefore.freeMemory : null,
        usedMemory: metricsAfter.usedMemory !== null && metricsBefore.usedMemory !== null ? metricsAfter.usedMemory - metricsBefore.usedMemory : null
      };
      return diff;
    }
    return null;
  }
  calculateCPUMetricsDiff(metricsBefore: CPUMetrics | undefined, metricsAfter: CPUMetrics | undefined): CPUMetrics | null {
    if (metricsBefore && metricsAfter) {
      const diff: CPUMetrics = {
        cpuUsage: metricsAfter.cpuUsage !== null && metricsBefore.cpuUsage !== null ? metricsAfter.cpuUsage - metricsBefore.cpuUsage : null
      };
      return diff;
    }
    return null;
  }

  async deleteMedecinsFromDatabase(): Promise<void> {
    const startTimeCassandra = performance.now();
    try {
      await this.cassandraService.deleteAllMedecins().toPromise();
    } catch (error) {
    console.error('Erreur lors de delete  dans Cassandra:', error);
    }
    const endTimeCassandra = performance.now();
    const startTimeMongo = performance.now();
    try {
      await this.mongodbService.deleteAllMedecins().toPromise();
    } catch (error) {
      console.error('Erreur lors de delete  dans mongo:', error);
    }
    const endTimeMongo = performance.now();
    const lastResult = this.results[this.results.length - 1];
    lastResult.deleteSpeedCassandra = endTimeCassandra - startTimeCassandra;
    lastResult.deleteSpeedMongoDB = endTimeMongo - startTimeMongo;
  }
}
