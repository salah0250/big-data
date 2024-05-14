package org.unice.medirecords.Data.cassandra;

import org.unice.medirecords.entite.Patients;
import org.unice.medirecords.Data.PatientsData;
import org.springframework.data.cassandra.repository.CassandraRepository;
import java.util.UUID;

public interface PatientsCassandraData  extends CassandraRepository<Patients, UUID> , PatientsData {
}
