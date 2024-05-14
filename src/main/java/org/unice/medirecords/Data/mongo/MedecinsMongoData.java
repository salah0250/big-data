package org.unice.medirecords.Data.mongo;

import org.springframework.context.annotation.Primary;
import org.unice.medirecords.entite.Medecins;
import org.unice.medirecords.Data.MedecinsData;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.UUID;

@Primary
public interface MedecinsMongoData extends MongoRepository<Medecins, UUID>, MedecinsData {
}
