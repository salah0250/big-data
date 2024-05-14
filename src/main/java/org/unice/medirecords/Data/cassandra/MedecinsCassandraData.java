package org.unice.medirecords.Data.cassandra;

import org.unice.medirecords.entite.Medecins;
import org.unice.medirecords.Data.MedecinsData;
import org.springframework.data.cassandra.repository.CassandraRepository;
import java.util.UUID;

public interface MedecinsCassandraData extends CassandraRepository<Medecins, UUID> , MedecinsData {
}
