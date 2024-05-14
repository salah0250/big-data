package org.unice.medirecords.entite;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.cassandra.core.mapping.PrimaryKey;
import org.springframework.data.cassandra.core.mapping.Table;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.UUID;

@Setter @Getter @NoArgsConstructor @AllArgsConstructor @Builder
@Document(collection = "visites")
@Table("visites")
public class Visites {

    @Id
    @PrimaryKey
    private UUID uuid;
    private String dateVisite;
    private String heureVisite;
    private UUID medecinId;
    private UUID patientId;
    private String motifVisite;
    private String notesMedecin;
    private String prescription;
}
