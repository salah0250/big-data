package org.unice.medirecords;

// importation des classes et interfaces
import org.unice.medirecords.entite.*;
import org.unice.medirecords.Data.cassandra.*;
import org.unice.medirecords.Data.mongo.*;

// importation des bibliotheques
import org.springframework.boot.SpringApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.cassandra.repository.config.EnableCassandraRepositories;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

import java.util.UUID;


@SpringBootApplication
@EnableMongoRepositories(basePackages = "org.unice.medirecords.Data.mongo")
@EnableCassandraRepositories(basePackages = "org.unice.medirecords.Data.cassandra")
public class MediRecordsApplication {

	public static void main(String[] args) {
		SpringApplication.run(MediRecordsApplication.class, args);
	}



	// test pour les deux bases de donnees
	@Bean
	CommandLineRunner commandLineRunner(MedecinsMongoData medecinsMongoData,
										MedecinsCassandraData medecinsCassandraData) {
		// Injection has to be done on the specific repository, not on the common interface because of the multiple inheritance
		return args -> {

			// Créer un nouveau médecin
			Medecins medecin = new Medecins();
			medecin.setUuid(UUID.randomUUID());
			medecin.setNom("Dr. Jean Dupont");
			medecin.setPrenom("Jean");
			medecin.setSpecialite("Cardiologie");
			medecin.setHoraires("Lundi - Vendredi, 8h00 - 17h00");
			medecin.setContact("jean.dupont@example.com");

			// Sauvegarder le médecin dans les repositories Cassandra et MongoDB
			medecinsCassandraData.save(medecin);
			medecinsMongoData.save(medecin);

			// Récupérer tous les médecins depuis les repositories Cassandra et MongoDB
			System.out.println(medecinsCassandraData.findAll());
			System.out.println(medecinsMongoData.findAll());
		};
	}

}
