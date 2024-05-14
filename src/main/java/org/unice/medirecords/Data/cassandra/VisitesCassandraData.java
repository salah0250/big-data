package org.unice.medirecords.Data.cassandra;

import org.unice.medirecords.entite.Visites;
import org.unice.medirecords.Data.VisitesData;
import org.springframework.data.cassandra.repository.CassandraRepository;
import java.util.UUID;
public interface VisitesCassandraData  extends CassandraRepository<Visites, UUID> , VisitesData {
}
