package org.unice.medirecords.apparaiment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.unice.medirecords.Data.MedecinsData;
import org.unice.medirecords.Data.mongo.MedecinsMongoData;
import org.unice.medirecords.entite.Medecins;
import org.unice.medirecords.Data.cassandra.*;
import java.lang.management.ManagementFactory;
import com.sun.management.OperatingSystemMXBean;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class MedecinsController {

    @Autowired
    private MedecinsData medecinsData;
    @Autowired
    private MedecinsCassandraData medecinsCassandraData;
    @Autowired
    private MedecinsMongoData medecinsMongoData;

    // *************************************************
                       // Medecins
    // *************************************************

    @GetMapping("/cassandra/getmedecins")
    public List<Medecins> getAllMedecinsCassandra() {
        return medecinsCassandraData.findAll();
    }
    @GetMapping("/mongo/getmedecins")
    public List<Medecins> getAllMedecinsMongo() {
        return medecinsMongoData.findAll();
    }

    // ajouter les medecins
    @PostMapping("/cassandra/addmedecin")
    public Medecins createMedecinCassandra(@RequestBody Medecins medecin) {
        // Generate a UUID
        UUID uuid = UUID.randomUUID();
        // Set the generated UUID to the medecin object
        medecin.setUuid(uuid);
        return medecinsCassandraData.save(medecin);
    }
    @PostMapping("/mongo/addmedecin")
    public Medecins createMedecinMongo(@RequestBody Medecins medecin) {
        // Generate a UUID
        UUID uuid = UUID.randomUUID();
        // Set the generated UUID to the medecin object
        medecin.setUuid(uuid);
        return medecinsMongoData.save(medecin);
    }

    @PostMapping("/cassandra/addmedecins")
    public List<Medecins> createMedecinsCassandra(@RequestBody List<Medecins> medecins) {
        // Generate UUIDs for each medecin
        medecins.forEach(medecin -> {
            UUID uuid = UUID.randomUUID();
            medecin.setUuid(uuid);
        });
        return medecinsCassandraData.saveAll(medecins);
    }

    @PostMapping("/mongo/addmedecins")
    public List<Medecins> createMedecinsMongo(@RequestBody List<Medecins> medecins) {
        // Generate UUIDs for each medecin
        medecins.forEach(medecin -> {
            UUID uuid = UUID.randomUUID();
            medecin.setUuid(uuid);
        });
        return medecinsMongoData.saveAll(medecins);
    }

    @PutMapping("/mongo/upmedecin/{uuid}")
    public Medecins updateMedecinMongo(@PathVariable UUID uuid, @RequestBody Medecins medecinDetails) {
        // Find the existing medecin by UUID
        Medecins existingMedecin = medecinsMongoData.findById(uuid).orElseThrow(() -> new NotFoundException("Medecin not found with UUID: " + uuid));

        // Update the existing medecin details
        existingMedecin.setNom(medecinDetails.getNom());
        existingMedecin.setPrenom(medecinDetails.getPrenom());
        existingMedecin.setSpecialite(medecinDetails.getSpecialite());
        existingMedecin.setHoraires(medecinDetails.getHoraires());
        existingMedecin.setContact(medecinDetails.getContact());

        // Save and return the updated medecin
        return medecinsMongoData.save(existingMedecin);
    }

    @PutMapping("/cassandra/upmedecin/{uuid}")
    public Medecins updateMedecinCassandra(@PathVariable UUID uuid, @RequestBody Medecins medecinDetails) {
        // Find the existing medecin by UUID
        Medecins existingMedecin = medecinsCassandraData.findById(uuid).orElseThrow(() -> new NotFoundException("Medecin not found with UUID: " + uuid));

        // Update the existing medecin details
        existingMedecin.setNom(medecinDetails.getNom());
        existingMedecin.setPrenom(medecinDetails.getPrenom());
        existingMedecin.setSpecialite(medecinDetails.getSpecialite());
        existingMedecin.setHoraires(medecinDetails.getHoraires());
        existingMedecin.setContact(medecinDetails.getContact());

        // Save and return the updated medecin
        return medecinsCassandraData.save(existingMedecin);
    }
    @GetMapping("/mongo/getmedecin/{uuid}")
    public Medecins getMedecinByIdMongo(@PathVariable UUID uuid) {
        return medecinsMongoData.findById(uuid).orElse(null);
    }

    @GetMapping("/cassandra/getmedecin/{uuid}")
    public Medecins getMedecinByIdCassandra(@PathVariable UUID uuid) {
        return medecinsCassandraData.findById(uuid).orElse(null);
    }

    @DeleteMapping("/cassandra/deletemedecin/{uuid}")
    public void deleteMedecinCassandra(@PathVariable UUID uuid) {
        medecinsCassandraData.deleteById(uuid);
    }
    @DeleteMapping("/mongo/deletemedecin/{uuid}")
    public void deleteMedecinMongo(@PathVariable UUID uuid) {
        medecinsMongoData.deleteById(uuid);
    }

    @DeleteMapping("/cassandra/deletemedecins")
    public void deleteAllMedecinsCassandra() {
        medecinsCassandraData.deleteAll();
    }

    @DeleteMapping("/mongo/deletemedecins")
    public void deleteAllMedecinsMongo() {
        medecinsMongoData.deleteAll();
    }


    @GetMapping("/metrics/cassandra/memory")
    public MemoryMetrics getCassandraMemoryMetrics() {
        OperatingSystemMXBean osBean = ManagementFactory.getPlatformMXBean(OperatingSystemMXBean.class);
        long totalMemory = osBean.getTotalMemorySize();
        long freeMemory = osBean.getFreeMemorySize();
        long usedMemory = totalMemory - freeMemory;
        return new MemoryMetrics(totalMemory, freeMemory, usedMemory);
    }

    @GetMapping("/metrics/mongodb/memory")
    public MemoryMetrics getMongoDBMemoryMetrics() {
        OperatingSystemMXBean osBean = ManagementFactory.getPlatformMXBean(OperatingSystemMXBean.class);
        long totalMemory = osBean.getTotalMemorySize();
        long freeMemory = osBean.getFreeMemorySize();
        long usedMemory = totalMemory - freeMemory;
        return new MemoryMetrics(totalMemory, freeMemory, usedMemory);
    }

    @GetMapping("/metrics/cassandra/cpu")
    public CPUMetrics getCassandraCPUMetrics() {
        OperatingSystemMXBean osBean = ManagementFactory.getPlatformMXBean(OperatingSystemMXBean.class);
        double cpuUsage = osBean.getCpuLoad() * 100;
        return new CPUMetrics(cpuUsage);
    }

    @GetMapping("/metrics/mongodb/cpu")
    public CPUMetrics getMongoDBCPUMetrics() {
        OperatingSystemMXBean osBean = ManagementFactory.getPlatformMXBean(OperatingSystemMXBean.class);
        double cpuUsage = osBean.getCpuLoad() * 100;
        return new CPUMetrics(cpuUsage);
    }
}
