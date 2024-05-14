package org.unice.medirecords.Data;
import org.unice.medirecords.entite.Medecins;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedecinsData {
    public List<Medecins> findAll();
}
