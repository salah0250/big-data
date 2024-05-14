package org.unice.medirecords.Data.mongo;
import org.unice.medirecords.entite.Patients;
import org.unice.medirecords.Data.PatientsData;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.UUID;

public interface PatientsMongoData extends MongoRepository<Patients, UUID> , PatientsData {
}
