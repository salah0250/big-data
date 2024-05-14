package org.unice.medirecords.entite;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.cassandra.core.mapping.PrimaryKey;
import org.springframework.data.cassandra.core.mapping.Table;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.UUID;

@Setter @Getter @NoArgsConstructor @AllArgsConstructor @Builder
@Document(collection = "medecins")
@Table("medecins")
public class Medecins {

    @Id
    @PrimaryKey
    private UUID uuid;
    private String nom;
    private String prenom;
    private String specialite;
    private String horaires;
    private String contact;
}
