package org.unice.medirecords.apparaiment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.unice.medirecords.Data.mongo.PatientsMongoData;
import org.unice.medirecords.Data.cassandra.PatientsCassandraData;
import org.unice.medirecords.entite.Patients;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class PatientsController {

    @Autowired
    private PatientsCassandraData patientsCassandraData;
    @Autowired
    private PatientsMongoData patientsMongoData;


    // **********Cassandra***********

    // Afficher tous les patients
    @GetMapping("/cassandra/getpatients")
    public List<Patients> getAllPatientsCassandra() {
        return patientsCassandraData.findAll(); // Vous pouvez remplacer par Mongo si nécessaire
    }

    // Ajouter un patient
    @PostMapping("/cassandra/addpatient")
    public Patients createPatient(@RequestBody Patients patient) {
        // Générer un UUID
        UUID uuid = UUID.randomUUID();
        // Définir l'UUID généré pour l'objet patient
        patient.setUuid(uuid);
        return patientsCassandraData.save(patient); // Vous pouvez remplacer par Mongo si nécessaire
    }

    // Mettre à jour un patient
    @PutMapping("/cassandra/uppatient/{uuid}")
    public Patients updatePatient(@PathVariable UUID uuid, @RequestBody Patients patientDetails) {
        // Trouver le patient existant par UUID
        Patients existingPatient = patientsCassandraData.findById(uuid).orElseThrow(() -> new NotFoundException("Patient non trouvé avec l'UUID: " + uuid));

        // Mettre à jour les détails du patient existant
        existingPatient.setNom(patientDetails.getNom());
        existingPatient.setPrenom(patientDetails.getPrenom());
        existingPatient.setDateNaissance(patientDetails.getDateNaissance());
        existingPatient.setAdresse(patientDetails.getAdresse());
        existingPatient.setNumeroTelephone(patientDetails.getNumeroTelephone());
        existingPatient.setHistoriqueMedical(patientDetails.getHistoriqueMedical());

        // Enregistrer et retourner le patient mis à jour
        return patientsCassandraData.save(existingPatient); // Vous pouvez remplacer par Mongo si nécessaire
    }


    // Supprimer un patient
    @DeleteMapping("/cassandra/deletepatient/{uuid}")
    public void deletePatient(@PathVariable UUID uuid) {
        patientsCassandraData.deleteById(uuid); // Vous pouvez remplacer par Mongo si nécessaire
    }

    // Obtenez un patient par UUID
    @GetMapping("/cassandra/getpatient/{uuid}")
    public Patients getPatientById(@PathVariable UUID uuid) {
        return patientsCassandraData.findById(uuid).orElse(null); // Vous pouvez remplacer par Mongo si nécessaire
    }

    // **********Mongo***********

    @GetMapping("/mongo/getpatients")
    public List<Patients> getAllPatientsMongo() {
        return patientsCassandraData.findAll(); // Vous pouvez remplacer par Mongo si nécessaire
    }

    // Ajouter un patient
    @PostMapping("/mongo/addpatient")
    public Patients createPatientMongo(@RequestBody Patients patient) {
        // Générer un UUID
        UUID uuid = UUID.randomUUID();
        // Définir l'UUID généré pour l'objet patient
        patient.setUuid(uuid);
        return patientsMongoData.save(patient); // Vous pouvez remplacer par Mongo si nécessaire
    }

    // Mettre à jour un patient
    @PutMapping("/mongo/uppatient/{uuid}")
    public Patients updatePatientMongo(@PathVariable UUID uuid, @RequestBody Patients patientDetails) {
        // Trouver le patient existant par UUID
        Patients existingPatient = patientsMongoData.findById(uuid).orElseThrow(() -> new NotFoundException("Patient non trouvé avec l'UUID: " + uuid));

        // Mettre à jour les détails du patient existant
        existingPatient.setNom(patientDetails.getNom());
        existingPatient.setPrenom(patientDetails.getPrenom());
        existingPatient.setDateNaissance(patientDetails.getDateNaissance());
        existingPatient.setAdresse(patientDetails.getAdresse());
        existingPatient.setNumeroTelephone(patientDetails.getNumeroTelephone());
        existingPatient.setHistoriqueMedical(patientDetails.getHistoriqueMedical());

        // Enregistrer et retourner le patient mis à jour
        return patientsMongoData.save(existingPatient); // Vous pouvez remplacer par Mongo si nécessaire
    }


    // Supprimer un patient
    @DeleteMapping("/mongo/deletepatient/{uuid}")
    public void deletePatientMongo(@PathVariable UUID uuid) {
        patientsCassandraData.deleteById(uuid); // Vous pouvez remplacer par Mongo si nécessaire
    }

    // Obtenez un patient par UUID
    @GetMapping("/mongo/getpatient/{uuid}")
    public Patients getPatientByIdMongo(@PathVariable UUID uuid) {
        return patientsCassandraData.findById(uuid).orElse(null); // Vous pouvez remplacer par Mongo si nécessaire
    }
}
