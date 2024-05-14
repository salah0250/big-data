package org.unice.medirecords.apparaiment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.unice.medirecords.Data.mongo.VisitesMongoData;
import org.unice.medirecords.Data.cassandra.VisitesCassandraData;
import org.unice.medirecords.entite.Visites;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class VisitesController {

    @Autowired
    private VisitesCassandraData visitesCassandraData;
    @Autowired
    private VisitesMongoData visitesMongoData;

    // Afficher toutes les visites
    @GetMapping("/cassandra/getvisites")
    public List<Visites> getAllVisitesCassandra() {
        return visitesCassandraData.findAll(); // Vous pouvez remplacer par Mongo si nécessaire
    }

    // Ajouter une visite
    @PostMapping("/cassandra/addvisite")
    public Visites createVisite(@RequestBody Visites visite) {
        // Générer un UUID
        UUID uuid = UUID.randomUUID();
        // Définir l'UUID généré pour l'objet visite
        visite.setUuid(uuid);
        return visitesCassandraData.save(visite); // Vous pouvez remplacer par Mongo si nécessaire
    }

    // Mettre à jour une visite
    @PutMapping("/cassandra/upvisite/{uuid}")
    public Visites updateVisite(@PathVariable UUID uuid, @RequestBody Visites visiteDetails) {
        // Trouver la visite existante par UUID
        Visites existingVisite = visitesCassandraData.findById(uuid).orElseThrow(() -> new NotFoundException("Visite non trouvée avec l'UUID: " + uuid));

        // Mettre à jour les détails de la visite existante
        existingVisite.setDateVisite(visiteDetails.getDateVisite());
        existingVisite.setHeureVisite(visiteDetails.getHeureVisite());
        existingVisite.setMedecinId(visiteDetails.getMedecinId());
        existingVisite.setPatientId(visiteDetails.getPatientId());
        existingVisite.setMotifVisite(visiteDetails.getMotifVisite());
        existingVisite.setNotesMedecin(visiteDetails.getNotesMedecin());
        existingVisite.setPrescription(visiteDetails.getPrescription());

        // Enregistrer et retourner la visite mise à jour
        return visitesCassandraData.save(existingVisite); // Vous pouvez remplacer par Mongo si nécessaire
    }

    // Supprimer une visite
    @DeleteMapping("/cassandra/deletevisite/{uuid}")
    public void deleteVisite(@PathVariable UUID uuid) {
        visitesCassandraData.deleteById(uuid); // Vous pouvez remplacer par Mongo si nécessaire
    }

    // Obtenez une visite par UUID
    @GetMapping("/cassandra/getvisite/{uuid}")
    public Visites getVisiteById(@PathVariable UUID uuid) {
        return visitesCassandraData.findById(uuid).orElse(null); // Vous pouvez remplacer par Mongo si nécessaire
    }

    // *********** Mongo  ************

    // Afficher toutes les visites
    @GetMapping("/mongo/getvisites")
    public List<Visites> getAllVisitesMongo() {
        return visitesMongoData.findAll(); // Vous pouvez remplacer par Mongo si nécessaire
    }

    // Ajouter une visite
    @PostMapping("/mongo/addvisite")
    public Visites createVisiteMongo(@RequestBody Visites visite) {
        // Générer un UUID
        UUID uuid = UUID.randomUUID();
        // Définir l'UUID généré pour l'objet visite
        visite.setUuid(uuid);
        return visitesMongoData.save(visite); // Vous pouvez remplacer par Mongo si nécessaire
    }

    // Mettre à jour une visite
    @PutMapping("/mongo/upvisite/{uuid}")
    public Visites updateVisiteMongo(@PathVariable UUID uuid, @RequestBody Visites visiteDetails) {
        // Trouver la visite existante par UUID
        Visites existingVisite = visitesMongoData.findById(uuid).orElseThrow(() -> new NotFoundException("Visite non trouvée avec l'UUID: " + uuid));

        // Mettre à jour les détails de la visite existante
        existingVisite.setDateVisite(visiteDetails.getDateVisite());
        existingVisite.setHeureVisite(visiteDetails.getHeureVisite());
        existingVisite.setMedecinId(visiteDetails.getMedecinId());
        existingVisite.setPatientId(visiteDetails.getPatientId());
        existingVisite.setMotifVisite(visiteDetails.getMotifVisite());
        existingVisite.setNotesMedecin(visiteDetails.getNotesMedecin());
        existingVisite.setPrescription(visiteDetails.getPrescription());

        // Enregistrer et retourner la visite mise à jour
        return visitesMongoData.save(existingVisite); // Vous pouvez remplacer par Mongo si nécessaire
    }

    // Supprimer une visite
    @DeleteMapping("/mongo/deletevisite/{uuid}")
    public void deleteVisiteMongo(@PathVariable UUID uuid) {
        visitesMongoData.deleteById(uuid); // Vous pouvez remplacer par Mongo si nécessaire
    }

    // Obtenez une visite par UUID
    @GetMapping("/mongo/getvisite/{uuid}")
    public Visites getVisiteByIdMongo(@PathVariable UUID uuid) {
        return visitesMongoData.findById(uuid).orElse(null); // Vous pouvez remplacer par Mongo si nécessaire
    }


}
