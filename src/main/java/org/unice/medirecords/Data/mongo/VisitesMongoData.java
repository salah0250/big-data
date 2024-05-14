package org.unice.medirecords.Data.mongo;
import org.unice.medirecords.entite.Visites;
import org.unice.medirecords.Data.VisitesData;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.UUID;

public interface VisitesMongoData extends  MongoRepository<Visites, UUID> , VisitesData{
}
